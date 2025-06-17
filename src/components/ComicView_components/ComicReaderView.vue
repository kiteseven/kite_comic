

<template>
  <div class="comic-reader">
    <!-- 顶部的标题栏 -->
    <!-- 新增设置按钮和菜单 -->
    <div class="settings-container" :class="{ active: showSettings }">
      <button
          class="settings-trigger"
          @click="toggleSettings"
          @mouseenter="hoverSettings = true"
          @mouseleave="hoverSettings = false"
      >
        ⚙️
      </button>

      <transition name="slide-fade">
        <div v-show="showSettings" class="settings-menu">
          <h4>阅读设置</h4>
          <div class="menu-item" @click="setDisplayMode('original')">
            <span :class="{ active: comicReaderConfig.displayMode === 'original' }">原始尺寸</span>
          </div>
          <div class="menu-item" @click="setDisplayMode('single')">
            <span :class="{ active: comicReaderConfig.displayMode === 'single' }">单页模式</span>
          </div>
          <div class="menu-item" @click="setDisplayMode('double')">
            <span :class="{ active: comicReaderConfig.displayMode === 'double' }">跨页模式</span>
          </div>
          <div class="menu-item" @click="setJapaneseReadingOrder">
            <span >日式阅读</span>
            <span >{{comicReaderConfig.JapaneseReadingOrder ? 'on':'off'}}</span>
          </div>
          <div class="menu-item" @click="toggleDarkMode">
            <span>夜间模式</span>
            <span class="toggle-indicator">{{ comicReaderConfig.isDarkMode ? '☀️' : '🌙' }}</span>
          </div>
        </div>
      </transition>
    </div>
    <div class="comic-header">
      <h1>{{ comicTitle }}/{{ chapterName }}</h1>
    </div>

    <div v-show=" comicReaderConfig.displayMode === 'original' " class="comic-page-original" v-for="(page, index) in pages" :key="index">
      <img
          v-lazyload="page.imageUrl"
          :data-src="page.imageUrl"
          class="comic-image-original"
          alt="漫画页面"
          @error="handleImageError"
          loading="lazy"
      />
    </div>

    <div v-show="comicReaderConfig.displayMode === 'double'" class="comic-page-double" @click="handlePageClick">
      <div v-for="(group, index) in doublePageGroups" :key="index" class="page-group" v-show="index === currentPageIndex">
        <div class="page-container" v-for="page in group" :key="page.imageUrl">
          <img
              :src="page.imageUrl"
              class="comic-image-double"
              :class="{ 'blank-page': page.isPlaceholder }"
              @error="handleImageError"
              loading="lazy"
              alt="跨页漫画界面"
          />
        </div>
      </div>
    </div>

    <div v-show="comicReaderConfig.displayMode === 'single'" class="comic-page-single" @click="handlePageClick">
      <div v-for="(page, index) in pages" :key="index" v-show ="index===currentPageIndex">
        <img
            v-lazyload="page.imageUrl"
            :data-src="page.imageUrl"
            class="comic-image-single"
            alt="漫画页面"
            @error="handleImageError"
            loading="lazy"
        />
      </div>
    </div>

    <!-- 底部的导航按钮 -->
    <div class="comic-footer">
      <button @click="goToPreviousChapter" :disabled="chapterNumber <= 1">上一话</button>
      <span>第{{ chapterNumber }} / {{ totalChapterCount }}话</span>
      <button @click="goToNextChapter" :disabled="chapterNumber===totalChapterCount">下一话</button>
    </div>
  </div>




</template>

<script setup lang="ts">
import {ref, onMounted, computed, onUnmounted, nextTick} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import { debounce, throttle } from 'lodash-es';
import {
  getComicChapterPages, incrementComicClickCount, saveTheComicReadHistoryDetail,
} from '@/api/comicAPi'
import {
  encipher,
  decrypt
} from '@/util/encryptedUtils'
import {getUserReaderConfig, saveTheComicReadConfig} from "@/api/userApi";


const route = useRoute();
const router = useRouter();
const props = defineProps({
  slug: String,
  comicId: Number,
});
let screenWidth = window.innerWidth

const pages = ref([]); // 将 pages 初始化为空数组，直接存储漫画页数据
const chapterName=ref();
const chapterNumber= ref();
const comicTitle = ref()
const comicId = decrypt(route.query.v);
const chapterNumbers = Number(route.params.chapterNumber);
const slug = route.params.slug;
const totalChapterCount=ref();

// 新增状态
const isSaving = ref(false);
const saveStatusText = ref('');
const saveTimer = ref(null);

// 图片加载优化
const visiblePages = ref(new Set());
const observer = ref(null);

// 设置Intersection Observer
const setupObserver = () => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const pageIndex = parseInt(entry.target.dataset.index);
      if (entry.isIntersecting) {
        visiblePages.value.add(pageIndex);
      } else {
        visiblePages.value.delete(pageIndex);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });

  // 观察所有页面元素
  document.querySelectorAll('.comic-page').forEach(el => {
    observer.value.observe(el);
  });
};


// 新增显示模式类型
type DisplayMode = 'single' | 'double' | 'original';
const currentPageIndex = ref(0); // 当前页码

// 新增响应式状态
const showSettings = ref(false)
const hoverSettings = ref(false)

const comicReaderConfig =ref(
    {
      displayMode:'single',
      isDarkMode: false,
      JapaneseReadingOrder:false,
    }
)

// 切换设置菜单
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
const setJapaneseReadingOrder =() =>{
  comicReaderConfig.value.JapaneseReadingOrder = !comicReaderConfig.value.JapaneseReadingOrder
  setDisplayMode('double')
  processDoublePages();
  saveTheComicReadConfig(comicReaderConfig.value)
}
// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const settingsEl = document.querySelector('.settings-container')
  if (settingsEl && !settingsEl.contains(event.target as Node)) {
    showSettings.value = false
  }
}
// 夜间模式切换
const toggleDarkMode = () => {
  comicReaderConfig.value.isDarkMode = !comicReaderConfig.value.isDarkMode
  document.documentElement.classList.toggle('dark-mode', comicReaderConfig.value.isDarkMode)
  saveTheComicReadConfig(comicReaderConfig.value)
}
// 切换显示模式
const setDisplayMode = (mode: DisplayMode) => {
  comicReaderConfig.value.displayMode = mode;
  // 切换模式后滚动回顶部
  //执行保存操作
  saveTheComicReadConfig(comicReaderConfig.value)
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 计算当前显示的跨页组索引
const currentGroupIndex = computed(() => Math.floor(currentPageIndex.value / 2));

// 点击事件处理
// 分页方法
//翻页（下一页）
const nextPage = () => {

  let maxPageIndex = 0;
  console.log(currentGroupIndex.value);
  if (comicReaderConfig.value.displayMode === 'double') {
    // 跨页模式：currentPageIndex 表示跨页组索引
    maxPageIndex = doublePageGroups.value.length - 1;

    if (currentPageIndex.value < maxPageIndex) {
      currentPageIndex.value++;
    } else {
      // 跨页模式到章节末尾的处理
      if (chapterNumber.value < totalChapterCount.value) {
        // 前往下一话
        ElMessageBox.confirm(
            '是否前往下一话？',
            '',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
            }
        ).then(() =>{
          goToNextChapter()
        })
      }else {
        ElMessage.info("已经到底了")
      }
    }
  } else {
    // 单页或原始模式
    maxPageIndex = pages.value.length - 1;

    if (currentPageIndex.value < maxPageIndex) {
      currentPageIndex.value++;
    } else {
      // 单页模式到章节末尾的处理
      if (chapterNumber.value < totalChapterCount.value) {
        console.info("已经到底了")
        if (chapterNumber.value < totalChapterCount.value){
          ElMessageBox.confirm(
              '是否前往下一话？',
              '',
              {
                confirmButtonText: '是',
                cancelButtonText: '否',
              }
          ).then(() =>{
            goToNextChapter()
          })
        }
      }else {
        ElMessage.info("已经到底了")
      }
    }
  }
  saveReadingProgressDebounced();
}

//翻页（上一页）
const prevPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }else if(currentGroupIndex.value === 0){
    console.info("已经到顶了")
    if(chapterNumber.value > 1){
      ElMessageBox.confirm(
          '是否前往上一话？',
          '',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
          }
      ).then(() =>{
        goToPreviousChapter()
      })
    }else {
      ElMessage.info("已经到顶了")
    }
  }
  saveReadingProgressDebounced()
}



const handlePageClick = (event: MouseEvent) => {
  const container = event.currentTarget as HTMLElement
  const clickX = event.clientX
  const width = window.innerWidth
  if (clickX < width / 2) {
    prevPage()
  } else {
    nextPage()
  }
}

interface ComicPage {
  imageUrl: string
  isPlaceholder: boolean
}

// 响应式数据
const doublePageGroups = ref<ComicPage[][]>([])

// 计算跨页组的数量
const doublePageCount = computed(() => {
  if (!pages.value || pages.value.length === 0) return 0;

  // 计算需要的跨页组数量
  return Math.ceil(pages.value.length / 2);
});

// 完整的跨页处理函数
const processDoublePages = () => {
  doublePageGroups.value = [] // 清空旧数据

  // 创建临时分组容器
  const groups: ComicPage[][] = []
  let currentGroup: ComicPage[] = []

  // 遍历所有页面
  if (comicReaderConfig.value.JapaneseReadingOrder === false){
    for (const [index, page] of pages.value.entries()) {
      currentGroup.push(page)

      // 每两个页面形成一组，或在最后一页时结束
      if (currentGroup.length === 2 || index === pages.value.length - 1) {
        groups.push([...currentGroup])
        currentGroup = []
      }
    }

    // 处理奇数页最后一组的情况
    if (pages.value.length % 2 !== 0) {
      const lastGroup = groups[groups.length - 1]
      // 如果需要保持双页对称，可以添加空白页
      // lastGroup.push({ imageUrl: 'placeholder.jpg' })
    }
  }else if(comicReaderConfig.value.JapaneseReadingOrder === true){
    // 遍历所有页面（从右到左）
    for (let i = pages.value.length - 1; i >= 0; i--) {
      currentGroup.unshift(pages.value[i]) // 从右侧开始添加

      // 每两个页面形成一组，或在最后一页时结束
      if (currentGroup.length === 2 || i === 0) {
        // 日式漫画需要交换组内顺序
        if (currentGroup.length === 2) {
          // 交换组内图片顺序 [右页, 左页] => [左页, 右页]
          ;[currentGroup[0], currentGroup[1]] = [currentGroup[1], currentGroup[0]]
        }
        groups.unshift(currentGroup) // 保持整体顺序从右到左
        currentGroup = []
      }
    }

    // 处理奇数页情况
    if (pages.value.length % 2 !== 0) {
      // 在最后一组前面添加空白页
      const lastGroup = groups[0]
      groups[0] = [blankPage, ...lastGroup]
    }
  }

  doublePageGroups.value = groups
  console.info("跨页数据",doublePageGroups.value);
  nextTick(() => {
    doublePageGroups.value = groups;
    console.info('处理后的跨页数据:', doublePageGroups.value);
  });

  // 确保当前页码在有效范围内
  if (comicReaderConfig.value.displayMode === 'double') {
    currentPageIndex.value = Math.min(
        currentPageIndex.value,
        doublePageCount.value - 1
    );
  }
}



// 添加空白页处理
const blankPage: ComicPage = {
  imageUrl: '/images/blank-page.jpg',
  isPlaceholder: true
}


//懒加载
// 自定义指令定义
const vLazyload = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.src = binding.value;
              observer.unobserve(el);
            }
          });
        },
        { rootMargin: '100px' }
    );
    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    el._observer?.disconnect();
  }
};
// 图片错误处理
const handleImageError = (e) => {
  e.target.style.opacity = 0.5;
  e.target.style.backgroundColor = '#ffcccc';
};
// 跳转到前一话
const goToPreviousChapter = () => {
  let v = encipher(comicId)
  if (chapterNumber.value > 1) {
    chapterNumber.value -= 1; // 更新 chapterNumber
    router.push({ name: 'ComicReader', params: { slug, chapterNumber: chapterNumber.value }, query: { v:v } });
  }
};
// 跳转到下一话
const goToNextChapter = () => {
  let v = encipher(comicId)
  if(chapterNumber.value<totalChapterCount.value){
    chapterNumber.value += 1; // 更新 chapterNumber
    router.push({name: 'ComicReader', params: {slug, chapterNumber: chapterNumber.value}, query: {v: v}});
  }

}

// 在 loadChapterData 函数末尾添加
const incrementClickCount = async (comicId) => {
  try {
    await incrementComicClickCount(comicId);
  } catch (err) {
    console.error('点击量统计失败', err);
  }
}

const loadChapterData = async () => {
  console.info(comicId)
  console.info(chapterNumbers)
  console.info(slug)
  chapterNumber.value=chapterNumbers
  const pagesResponse = await getComicChapterPages(slug,comicId,chapterNumbers)
  console.info(pagesResponse)
  comicTitle.value=pagesResponse.data.comicTitle
  chapterName.value=pagesResponse.data.chapterName
  pages.value = pagesResponse.data.comicPages
  totalChapterCount.value=pagesResponse.data.totalChapterCount;
  console.info(pages.value)
  console.info(comicTitle.value)
  processDoublePages()
  await loadReadingSettings();
  await incrementClickCount(comicId);
}

const loadReadingSettings = async () => {
  const config = await getUserReaderConfig();
  console.info(config);
  comicReaderConfig.value.displayMode =config.data.displayMode;
  comicReaderConfig.value.JapaneseReadingOrder=config.data.japaneseReadingOrder
  comicReaderConfig.value.isDarkMode=config.data.isDarkMode
  console.info("displayMode:",comicReaderConfig.value.displayMode)
  if (comicReaderConfig.value.displayMode==='double') {
    processDoublePages()
  }
}

// 计算当前阅读位置
const currentReadingPosition = computed(() => {
  let pageIndex=0;
  if(comicReaderConfig.value.displayMode=='double'){
    pageIndex=currentPageIndex.value*2+1;
  }else {
    pageIndex=currentPageIndex.value+1;
  }
  return {
    comicId: comicId,
    readChapterNumber: chapterNumber.value,
    readPageIndex: pageIndex,
    readPercentage: Math.round((currentPageIndex.value / (pages.value.length - 1)) * 100)
  };
});

// 带防抖的保存函数（300ms防抖）
const saveReadingProgressDebounced = debounce(async () => {
  try {
    isSaving.value = true;
    saveStatusText.value = '保存中...';
    console.info("保存阅读记录:",currentReadingPosition.value);
    await saveTheComicReadHistoryDetail(currentReadingPosition.value);

    saveStatusText.value = '进度已保存';
    isSaving.value = false;

    // 3秒后隐藏保存提示
    clearTimeout(saveTimer.value);
    saveTimer.value = setTimeout(() => {
      saveStatusText.value = '';
    }, 3000);
  } catch (err) {
    console.error('保存阅读进度失败', err);
    saveStatusText.value = '保存失败';
    setTimeout(() => {
      saveStatusText.value = '';
    }, 2000);
  }
}, 300);

// 立即保存（无防抖）
const saveImmediately = async () => {
  // 取消防抖保存（如果有）
  saveReadingProgressDebounced.cancel();

  try {
    isSaving.value = true;
    saveStatusText.value = '正在保存...';

    console.info("立即保存阅读记录:", currentReadingPosition.value);
    await saveTheComicReadHistoryDetail(currentReadingPosition.value);

    saveStatusText.value = '进度已保存';
    isSaving.value = false;

    // 3秒后隐藏保存提示
    if (saveTimer.value) clearTimeout(saveTimer.value);
    saveTimer.value = setTimeout(() => {
      saveStatusText.value = '';
    }, 3000);
  } catch (err) {
    console.error('立即保存失败', err);
    saveStatusText.value = '保存失败';
    setTimeout(() => {
      saveStatusText.value = '';
    }, 2000);
  }
};

//加载界面时
onMounted(
    () =>
    {
      loadChapterData()
      saveImmediately()
    }
)

//离开页面时
onUnmounted( () => {
  if (observer.value) {
    observer.value.disconnect();
  }
  saveImmediately();
});
// 监听显示模式变化
watch(() => comicReaderConfig.value.displayMode, (newMode) => {
  if (newMode === 'double') {
    // 切换到跨页模式时重新处理页面
    processDoublePages();
    // 重置当前页码
    currentPageIndex.value = 0;
  } else {
    // 单页或原始模式下使用单页索引
    currentPageIndex.value = 0;
  }
});

// 监听章节变化
watch(() => route.params.chapterNumber, (newChapter) => {
  // 重置当前页码
  currentPageIndex.value = 0;
  // 重新加载章节数据
  loadChapterData();
}, { immediate: true });

// 新增响应式样式
const cursorStyle = ref({ cursor: 'default' })

document.onmousemove = (event) => {
  const width = window.innerWidth
  const { clientX, clientY } = event;
  if(clientX<width/2){
    console.info("在左侧")
    document.body.style.cursor = 'w-resize';
  }else if(clientX>width/2){
    console.info("在右侧")
    document.body.style.cursor = 'e-resize';
  }else {
    document.body.style.cursor = 'default';
  }
};

</script>

<style scoped>
.comic-reader {
  text-align: center;
}
.comic-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  text-align: center;
  z-index: 1000; /* 确保标题栏显示在最上层 */
}
.comic-page-original {
  margin-top: 70px; /* 确保内容不被顶部标题栏遮挡 */
  margin-bottom: 50px; /* 确保内容不被底部导航栏遮挡 */
}
.comic-image-original {
  width: 80vw; /* 让图片宽度占据整个屏幕宽度 */
  height: auto; /* 保持纵横比 */
  object-fit: cover; /* 图片覆盖整个宽度 */
}

.comic-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 1000; /* 确保导航栏显示在最上层 */
}

.comic-page-double{
  margin-top: 70px; /* 确保内容不被顶部标题栏遮挡 */
  margin-bottom: 50px; /* 确保内容不被底部导航栏遮挡 */
}

.comic-image-double {
  width: 663px; /* 让图片宽度占据整个屏幕宽度 */
  height: 1000px; /* 保持纵横比 */
  object-fit: cover; /* 图片覆盖整个宽度 */
}
.comic-page-single{
  margin-top: 70px; /* 确保内容不被顶部标题栏遮挡 */
  margin-bottom: 50px; /* 确保内容不被底部导航栏遮挡 */
}
.comic-image-single{
  width: 663px; /* 让图片宽度占据整个屏幕宽度 */
  height: 1000px; /* 保持纵横比 */
  object-fit: cover; /* 图片覆盖整个宽度 */
}

.page-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.page-container {
  flex: 1;
  position: relative;
}

.blank-page {
  background: #f0f0f0;
  border: 1px dashed #ccc;
}

/* 设置容器 */
.settings-container {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  transition: all 0.3s ease;
}

/* 触发按钮 */
.settings-trigger {
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50% 0 0 50%;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.settings-trigger:hover {
  background: rgba(0, 0, 0, 0.9);
  padding-right: 20px;
}

/* 设置菜单 */
.settings-menu {
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px 0 0 8px;
  color: white;
  min-width: 180px;
  padding: 16px;
  position: absolute;
  right: -100%;
  top: 50%;
  transform: translateY(-50%);
}

.settings-container.active .settings-menu {
  right: 100%;
}

.menu-item {
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item span.active {
  color: #00a8ff;
}

.toggle-indicator {
  margin-left: 16px;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(20px);
}

/* 夜间模式 */
.dark-mode {
  background: #1a1a1a;
  color: #ffffff;
}

.dark-mode .comic-image-double,
.dark-mode .comic-image-single {
  filter: brightness(0.9);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .settings-trigger {
    padding: 10px 14px;
    font-size: 1.2rem;
  }

  .settings-menu {
    min-width: 160px;
    padding: 12px;
  }

  .menu-item {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}
</style>