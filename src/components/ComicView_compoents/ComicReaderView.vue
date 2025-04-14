

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
            <span :class="{ active: displayMode === 'original' }">原始尺寸</span>
          </div>
          <div class="menu-item" @click="setDisplayMode('single')">
            <span :class="{ active: displayMode === 'single' }">单页模式</span>
          </div>
          <div class="menu-item" @click="setDisplayMode('double')">
            <span :class="{ active: displayMode === 'double' }">跨页模式</span>
          </div>
          <div class="menu-item" @click="toggleDarkMode">
            <span>夜间模式</span>
            <span class="toggle-indicator">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          </div>
        </div>
      </transition>
    </div>
    <div class="comic-header">
      <h1>{{ comicTitle }}/{{ chapterName }}</h1>
    </div>

    <div v-if=" displayMode === 'original' " class="comic-page-original" v-for="(page, index) in pages" :key="index">
      <img
          v-lazyload="page.imageUrl"
          :data-src="page.imageUrl"
          class="comic-image-original"
          alt="漫画页面"
          @error="handleImageError"
          loading="lazy"
      />
    </div>

    <div v-if="displayMode === 'double'" class="comic-page-double" @click="handlePageClick">
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

    <div v-if="displayMode === 'single'" class="comic-page-single" @click="handlePageClick">
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
import {ref, onMounted, computed, onUnmounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';
import{
  getComicChapterPages,
} from '@/api/comicAPi'
import {
  encipher,
  decrypt
} from '@/util/encryptedUtils'
import refresh from "@/components/refresh.vue";
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
const totalChapterCount=ref()

// 新增显示模式类型
type DisplayMode = 'single' | 'double' | 'original';
const displayMode = ref<DisplayMode>('original');
const currentPageIndex = ref(0); // 当前页码

// 新增响应式状态
const showSettings = ref(false)
const hoverSettings = ref(false)
const isDarkMode = ref(false)


// 切换设置菜单
const toggleSettings = () => {
  showSettings.value = !showSettings.value
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
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
}
// 切换显示模式
const setDisplayMode = (mode: DisplayMode) => {
  displayMode.value = mode;
  // 切换模式后滚动回顶部
  if(mode==='double'){
    processDoublePages()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 计算当前显示的跨页组索引
const currentGroupIndex = computed(() => Math.floor(currentPageIndex.value / 2));

// 点击事件处理
// 分页方法
const nextPage = () => {
  if (currentPageIndex.value < doublePageGroups.value.length - 1) {
    currentPageIndex.value++
  }
}

const prevPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }
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

// 完整的跨页处理函数
const processDoublePages = () => {
  doublePageGroups.value = [] // 清空旧数据

  // 创建临时分组容器
  const groups: ComicPage[][] = []
  let currentGroup: ComicPage[] = []

  // 遍历所有页面
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

  doublePageGroups.value = groups

  console.info(doublePageGroups.value);
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
    router.push({ name: 'ComicReader', params: { slug, chapterNumber: chapterNumber.value }, query: { v:v } });

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
}

onMounted(
    () =>
    {
      loadChapterData()

    }

)
watch(
    () => route.params.chapterNumber, (oldChapterNumber,newChapterNumber) => {
      router.go(0)
  // 对路由变化做出响应...
})

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