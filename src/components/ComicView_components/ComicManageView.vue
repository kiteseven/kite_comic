<template>
  <el-card>
    <el-divider></el-divider>
    <!-- 编辑按钮，右上角 -->
      <div style="display: flex; justify-content: flex-end;">
        <el-button type="primary" size="small" @click="editComicDialogVisible = true">编辑漫画</el-button>
        <el-button type="warning" size="small" @click="deleteTheComic">删除漫画</el-button>
      </div>
    <div class="manage-comic-header">
      <img :src="comic.coverImage" alt="comic.title" class="manage-cover-image" />
      <div class="manage-comic-info">
        <h1>{{ comic.comicTitle }}</h1>
        <p>作者: {{ comic.authorName }}</p>
        <p>状态: {{ statusText }}</p>
        <p>类型: {{genreText}}</p>
        <p>标签: <span v-for="tag in comic.tags" :key="tag" class="tag">{{ tag + "、" }}</span></p>
        <p>简介: {{ comic.description }}</p>
        <div class="buttons">
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </el-card>

  <el-dialog
      v-model="editComicDialogVisible"
      title="编辑漫画信息"
      width="800px"
  >
    <div class="edit-dialog-body">
      <!-- 左侧：封面上传 -->
      <div class="edit-left">
        <el-form-item>
          <div class="cover-upload-container">
            <el-upload
                class="cover-upload"
                action="/api/upload/updateComicCoverImage"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
                name="file"
                :data="{comicTitle: editComicForm.comicTitle}"
            >
              <div class="cover-wrapper">
                <img :src="editComicForm.coverImage" class="cover-preview" />
                <div class="cover-overlay">
                  <span>点击更换封面</span>
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>

      <!-- 右侧：表单字段 -->
      <div class="edit-right">
        <el-form :model="editComicForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="editComicForm.comicTitle" />
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="editComicForm.authorName" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editComicForm.status" placeholder="选择状态">
              <el-option label="连载中" :value="0" />
              <el-option label="已完结" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="editComicForm.genre" placeholder="选择类型">
              <el-option label="少年漫" :value="1" />
              <el-option label="少女漫" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
                v-model="editComicForm.tags"
                multiple
                placeholder="选择标签"
                style="width: 100%"
            >
              <el-option label="热血" value="热血" />
              <el-option label="搞笑" value="搞笑" />
              <el-option label="校园" value="校园" />
            </el-select>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" v-model="editComicForm.description" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
    <span class="dialog-footer">
      <el-button @click="editComicDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">保存</el-button>
    </span>
    </template>
  </el-dialog>


  <!-- 章节管理卡片 -->
  <el-card class="chapter-section">
    <div class="chapter-toolbar">
      <!-- 章节状态筛选按钮 -->
      <el-radio-group v-model="filterStatus">
        <el-radio-button label="全部" />
        <el-radio-button label="已上线" />
        <el-radio-button label="待审核" />
      </el-radio-group>

      <!-- 搜索框 -->
      <el-input
          v-model="searchKeyword"
          placeholder="搜索章节"
          clearable
          suffix-icon="el-icon-search"
          class="chapter-search"
      />
    </div>

    <!-- 章节表格 -->
    <el-table :data="filteredChapters" style="width: 100%" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="章节封面" width="120">
        <template #default="scope">
          <el-image :src="scope.row.chapterCoverImage" fit="cover" style="width: 80px; height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="chapterName" label="标题" />
      <el-table-column prop="reviewStatusText" label="审核状态">
        <template #default="scope">
          {{ getReviewStatusText(scope.row.reviewStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="text" size="small" @click="previewChapter(scope.row.comicId,scope.row.chapterNumber)">预览</el-button>
          <el-button type="text" size="small" @click="editChapter(scope.row.comicId,scope.row.chapterNumber)">编辑章节</el-button>
          <el-button type="text" size="small" @click="deleteTheChapter(scope.row.comicId,scope.row.chapterNumber)">删除章节</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="totalChapters"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
      <el-button type="primary" icon="Plus" @click="handleAddChapter">
        新增章节
      </el-button>
    </div>

  </el-card>



  <el-dialog
      v-model="previewDialogVisible"
      title="章节预览"
      width="60%"
  >
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <el-image
          v-for="(img, index) in previewImages"
          :key="index"
          :src="img"
          fit="contain"
          style="width: auto; max-width: 600px;"
          lazy
          :preview-src-list="previewImages"
      />
    </div>
  </el-dialog>

  <!-- 新增章节弹窗 -->
  <el-dialog
      v-model="addChapterDialogVisible"
      title="新增章节"
      width="50%"
      :height="'80vh'"
  >
    <div class="edit-dialog-body">
      <el-form :model="comicData" label-width="100px">
        <el-form-item label="章节名">
          <el-input v-model="comicData.comicChapter.chapterName" placeholder="请输入章节名称" />
        </el-form-item>

        <el-form-item label="章节序号">
          <el-input v-model="comicData.comicChapter.chapterNumber" placeholder="请输入章节序号" />
        </el-form-item>

        <!-- 上传图片 -->
        <el-form-item label="章节图片">
          <el-upload
              ref="uploadRef"
              class="upload-area"
              :action="uploadUrl"
              list-type="picture-card"
              :auto-upload="false"
              multiple
              name="file"
              accept=".jpg,.jpeg,.png,.webp"
              :before-upload="beforeUpload"
              :on-success="handleUploadComicPageSuccess"
              :on-error="handleUploadError"
              :data="comicData"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="el-upload__tip">
            支持 jpg/png/webp，最多 300 张，建议命名格式：章节-页数（例：1-1）
          </div>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleUpload">上传图片</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
        <span class="dialog-footer">
          <el-button @click="addChapterDialogVisible = false">取消</el-button>
          <el-button type="success" @click="handleUploadComic">发布章节</el-button>
        </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="editChapterDialogVisible"
      title="编辑章节"
      label-width="100px"
      width="100%"
  >

    <el-form :model="chapterData" label-width="100px">
      <el-form-item>
        <el-row :gutter="10">
          <el-col v-for="(image, index) in chapterData.comicPages" :key="index" :span="5">
        <div class="page-upload-container">
          <div class="page-number" @click="handleSortSelect(image.pageNumber)">{{ image.pageNumber }}</div>
          <div v-if="isDeleteMode" class="page-checkbox">
            <el-checkbox v-model="selectedPages" :label="image.pageNumber" />
          </div>
          <el-upload
              ref="uploadRef"
              class="page-upload"
              :action="updateUrl"
              :show-file-list="false"
              :on-success="handleUploadPageSuccess"
              :before-upload="beforeUpload"
              name="file"
              :data="{
                comicTitle: chapterData.comicTitle,
                pageNumber: image.pageNumber
              }"
          >
              <div class="page-wrapper">
                <img :src="image.imageUrl" class="edit-page-preview" />
                <div class="page-overlay">
                  <span>更换</span>
                </div>
              </div>

          </el-upload>

        </div>
          </el-col>
        </el-row>

        <el-upload
            ref="uploadRef"
            class="page-upload-area"
            :action="uploadUrl"
            list-type="picture-card"
            :auto-upload="true"
            multiple
            name="file"
            accept=".jpg,.jpeg,.png,.webp"
            :before-upload="beforeUpload"
            :on-success="handleAddNewComicPageSuccess"
            :on-error="handleUploadError"
            :data="comicData"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <div class="el-upload__tip">
          支持 jpg/png/webp，最多 300 张，建议命名格式：章节-页数（例：1-1）
        </div>

      </el-form-item>
    </el-form>

    <div>
      <el-button type="danger" @click="isDeleteMode = !isDeleteMode">
        {{ isDeleteMode ? '取消删除' : '删除图片' }}
      </el-button>
      <el-button v-if="isDeleteMode" type="primary" @click="deleteSelectedPages">
        确认删除
      </el-button>
      <el-button type="info" @click="toggleSortMode" style="margin-left: 10px;">
        {{ isSortMode ? '退出排序' : '排序页面' }}
      </el-button>
      <el-button @click="editChapterDialogVisible=false">
        取消修改
      </el-button>
      <el-button @click="updateComicPage">
        保存修改
      </el-button>
    </div>

  </el-dialog>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {getUserDatas} from "@/util/userDataUtil";
import {decrypt, encipher} from "@/util/encryptedUtils";
import {
  deleteChapter,
  deleteComic,
  getAllComicChapters,
  getComic,
  getComicChapterPages,
  getComicChapters,
  updateComicBaseInformation, updateTheComicPage, uploadComic
} from "@/api/comicApi";
import { watch } from 'vue';
import MainNav from "@/components/HomePage_components/MainNav.vue";
import {ElMessage} from "element-plus";
import {c} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

const avatar = ref("");
const userData = ref();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  slug: String,
  comicId: Number
});
const uploadUrl = '/api/upload/comicImage';

const updateUrl = '/api/upload/updateComicImage';

const editComicDialogVisible = ref(false);
const previewDialogVisible = ref(false);
const previewImages = ref<string[]>([]);
const slug = props.slug

const formRef = ref();
const uploadRef = ref();
const addChapterDialogVisible = ref(false);
// 漫画信息
const comic = ref({
  comicId:0,
  comicTitle: '',
  authorName: '',
  click: 0,
  genre: '',
  coverImage: '',
  popularity: '',
  description: '',
  status: '',
  slug:'',
  tags:[],
  isCollection:false,
});
const editComicForm =ref(
    {
      comicId:0,
      comicTitle: '',
      authorName: '',
      description: '',
      genre: '',
      tags: [],
      status:0,
      coverImage: '',
    }
)
const comicData = ref({
  comicId: comic.value.comicId,
  comicTitle: comic.value.comicTitle,
  comicChapter: {
    chapterNumber: '',
    chapterName: ''
  },
  comicPages: {}
});
const extractPageNumber = (url: string) => {
  const match = url.match(/_(\d+)\.webp$/);
  return match ? parseInt(match[1], 10) : null;
};
const ComicPagesMapData = new Map();

const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('单图最大5MB');
    return false;
  }
  const valid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  if (!valid) {
    ElMessage.error('仅支持 jpg/png/webp');
    return false;
  }
  return true;
};

const handleUploadComicPageSuccess = (res, file) => {
  const url = res.data;
  const page = extractPageNumber(url);
  ComicPagesMapData.set(page, url);
};

const handleUploadError = (err) => {
  console.error('上传失败：', err);
};

const handleUpload = () => {
  uploadRef.value!.submit();
};

const handleUploadComic = async () => {
  comicData.value.comicPages = Object.fromEntries(ComicPagesMapData);
  const res = await uploadComic(comicData.value);
  if (res.code === 1) {
    ElMessage.success('上传成功！');
    addChapterDialogVisible.value = false;
    window.location.reload();
  } else {
    ElMessage.error(res.msg);
  }
};
const resetForm = () => {
  comicData.value = {
    comicId: comic.value.comicId,
    comicTitle: comic.value.comicTitle,
    comicChapter: {
      chapterNumber: '',
      chapterName: ''
    },
    comicPages: {}
  };
  ComicPagesMapData.clear();
  uploadRef.value?.clearFiles?.();
};
const handleAddChapter =()=>{
  addChapterDialogVisible.value = true;
  comicData.value.comicId = comic.value.comicId;
  comicData.value.comicTitle = comic.value.comicTitle;
  console.log(comicData.value);
}


// 打开弹窗时复制当前漫画数据
watch(editComicDialogVisible, (visible) => {
  if (visible) {
    editComicForm.value = {
      comicId: comic.value.comicId,
      comicTitle: comic.value.comicTitle,
      authorName: comic.value.authorName,
      description: comic.value.description,
      genre: comic.value.genre,
      status: comic.value.status,
      tags: Array.isArray(comic.value.tags) ? comic.value.tags : [comic.value.tags],  // 兼容字符串或数组
      coverImage: comic.value.coverImage,
    };
  }
});


// 章节列表

// 章节相关
const chapters = ref<any[]>([]);
const filterStatus = ref("全部");
const searchKeyword = ref("");
const pageSize = 10;
const currentPage = ref(1);
const totalChapters = ref(10)
const statusText = computed(() => {
  const statusMap = {
    0: '连载中',
    1: '已完结'
  };
  return statusMap[comic.value.status] || '未知状态';
});

const genreText =computed(() => {
  const genreMap = {
    1: '少年漫',
    2: '少女漫',
  }
  return genreMap[comic.value.genre] || '未知类型';
})


const reviewStatusMap = {
  0: '未审核',
  1: '已通过',
  2: '被退回'
}
const getReviewStatusText = (status) => {
  return reviewStatusMap[status] || '未知状态';
};

const filteredChapters = computed(() => {
  const filtered = chapters.value.filter((ch) => {
    const statusMatch = filterStatus.value === '全部' || ch.reviewStatus === filterStatus.value;
    const keywordMatch = ch.chapterName.includes(searchKeyword.value);
    return statusMatch && keywordMatch;
  });

  // 安全排序（兼容数字和字符串格式的数字）
  return filtered.sort((a, b) => {
    // 转换为数字比较
    const numA = Number(a.chapterNumber);
    const numB = Number(b.chapterNumber);
    return numA - numB;
  });
});

const getTheComic =async () => {
  const comicId = decrypt(route.query.v);
  try {
    console.info(props)
    console.info(slug)
    console.info(comicId)
    // 请求漫画详细信息
    const comicResponse = await getComic(slug, comicId);
    console.log(comicResponse)
    comic.value = comicResponse.data;

    // 请求章节列表
    const chaptersResponse = await getAllComicChapters(slug,comicId,currentPage.value,pageSize);
    console.log(chaptersResponse)
    chapters.value = chaptersResponse.data.records;
    totalChapters.value = chaptersResponse.data.total;
    console.log('总章节数:', totalChapters.value);
    console.log(chapters)
  } catch (error) {
    console.error('Failed to load comic data', error);
  }
}

// 获取章节内容图片
const previewChapter = async (comicId,chapterNumbers) => {
  try {

    const pagesResponse = await getComicChapterPages(slug,comicId,chapterNumbers) // 返回图片 URL 列表
    previewDialogVisible.value = true;
    previewImages.value = pagesResponse.data.comicPages.map(p => p.imageUrl); // res.data 是你的数组对象
    console.log(pagesResponse.data.comicPages);
  } catch (error) {
    console.error('预览章节失败', error);
    ElMessage.error('章节预览失败');
  }
};

const handleUploadSuccess = (response, file, files) => {
  console.log('上传成功', response);
  editComicForm.value.coverImage=response.data
  console.log(editComicForm)
  // 处理上传成功后的逻辑，比如更新页面数据或显示图片地址
};

//保存修改
const submitEdit = async () => {
  try {
    const res = await updateComicBaseInformation(editComicForm.value);
    if (res.code === 1) {
      ElMessage.success('修改成功!');
      editComicDialogVisible.value = false;
      // 延迟刷新页面
      setTimeout(() => {
        router.go(0);
      }, 1000); // 延迟 1 秒

    } else {
      ElMessage.warning(res.msg || '修改失败，请检查输入内容');
    }
  } catch (error) {
    console.error('修改漫画信息时发生异常：', error);
    ElMessage.error('系统异常，修改失败，请稍后重试');
  }
}

onMounted(async () => {
  await getTheComic()
  userData.value = await getUserDatas();
  avatar.value =userData.value.avatar;
})



// 处理图片上传成功
const handleImageUploadSuccess = (response, file) => {
  const newImageUrl = response.data;
  chapterData.value.images.push(newImageUrl); // 添加上传的图片
  ElMessage.success('图片上传成功');
};

// 上传图片之前的检查
const beforeImageUpload = (file) => {
  const isValid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const isLt5M = file.size / 1024 / 1024 < 5; // 5MB 以下
  if (!isValid) {
    ElMessage.error('上传文件只能是 jpg/png/webp 格式');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('上传文件大小不能超过 5MB');
    return false;
  }
  return true;
};

//编辑章节功能

const editChapter = async (comicId,chapterNumber) => {
  await loadChapterImages(comicId,chapterNumber)
  editChapterDialogVisible.value = true;
}

const chapterData = ref({
  comicId: 23,
  comicTitle:'不存在的漫畫裡的一格',
  chapterNumber: 1,
  comicPages: [
    {
    chapterNumber: 1,
    comicId: 23,
    comicTitle:'不存在的漫畫裡的一格',
    imageUrl: "https://kite-comic.oss-cn-beijing.aliyuncs.com/不存在的漫畫裡的一格-1_1.webp",
    pageNumber: 1
  }
  ] // 用来保存章节图片的数组
});

const editChapterDialogVisible = ref(false);

const isDeleteMode = ref(false); // 是否进入删除模式
const selectedPages = ref([]);   // 被选中的 pageNumber 列表

// 获取当前章节的所有图片
const loadChapterImages = async (comicId, chapterNumber) => {
  try {
    const pagesResponse = await getComicChapterPages(slug,comicId,chapterNumber) // 返回图片 URL 列表
    console.log(pagesResponse)
    chapterData.value.comicId=comicId;
    chapterData.value.comicTitle=comic.value.comicTitle;
    chapterData.value.chapterNumber=chapterNumber;
    chapterData.value.comicPages = pagesResponse.data.comicPages;
    console.log(chapterData.value)
  } catch (error) {
    ElMessage.error('加载章节图片失败');
  }
};

const deleteSelectedPages = () => {
  if (selectedPages.value.length === 0) {
    ElMessage.warning('请先选择要删除的页面');
    return;
  }

  chapterData.value.comicPages = chapterData.value.comicPages.filter(
      page => !selectedPages.value.includes(page.pageNumber)
  );
  console.log(chapterData.value)
  selectedPages.value = [];
  isDeleteMode.value = false;
  ElMessage.success('删除成功');
};

const isSortMode = ref(false);           // 是否处于排序模式
const sortSelection = ref([]);           // 已选中的两个 pageNumber

const toggleSortMode = () => {
  isSortMode.value = !isSortMode.value;
  sortSelection.value = [];
};

const handleSortSelect = (pageNumber) => {
  if (!isSortMode.value) return;

  if (!sortSelection.value.includes(pageNumber)) {
    sortSelection.value.push(pageNumber);
  }

  if (sortSelection.value.length === 2) {
    const [pageA, pageB] = sortSelection.value;

    // 找到两个页面对象
    const pages = chapterData.value.comicPages;
    const indexA = pages.findIndex(p => p.pageNumber === pageA);
    const indexB = pages.findIndex(p => p.pageNumber === pageB);

    if (indexA !== -1 && indexB !== -1) {
      // 交换位置
      const temp = pages[indexA];
      pages[indexA] = pages[indexB];
      pages[indexB] = temp;

      // 重新赋值 pageNumber
      pages[indexA].pageNumber = indexA + 1;
      pages[indexB].pageNumber = indexB + 1;
    }

    chapterData.value.comicPages = pages;
    console.log(chapterData.value);
    sortSelection.value = []; // 清空选中
  }
};

const handleAddNewComicPageSuccess =(response, file, files)=>{
  const newImageUrl = response.data;
// 获取当前页面数组
  const pages = chapterData.value.comicPages;

  // 获取最后一个页面的 pageNumber（如果没有则设为0）
  const lastPageNumber = pages.length > 0 ? pages[pages.length - 1].pageNumber : 0;

  // 构建新的页面对象
  const newPage = {
    chapterNumber: chapterData.value.chapterNumber,
    comicId: chapterData.value.comicId,
    comicTitle: chapterData.value.comicTitle,
    imageUrl: newImageUrl,
    pageNumber: lastPageNumber + 1
  };

  // 添加到 comicPages 数组中
  pages.push(newPage);
  chapterData.value.comicPages = pages;
  ElMessage.success('图片上传成功，已添加新页面');
}

const handleUploadPageSuccess =(response, file, files)=>{
  console.log(response);

  const newImageUrl = response.data.imageUrl;

  const pages = chapterData.value.comicPages;
  // 获取当前上传图片对应的 pageNumber
  const pageNumber = response.data.pageNumber;  // 从 file.raw 中获取传递的 pageNumber

  console.log(file);
  console.log(files);
  console.log(pageNumber)
  // 获取最后一个页面的 pageNumber（如果没有则设为0）
  const lastPageNumber = pages.length > 0 ? pages[pages.length - 1].pageNumber : 0;
  // 构建新的页面对象
  const newPage = {
    chapterNumber: chapterData.value.chapterNumber,
    comicId: chapterData.value.comicId,
    comicTitle: chapterData.value.comicTitle,
    imageUrl: newImageUrl,
    pageNumber: pageNumber
  };
  // 找到对应 pageNumber 的项并替换
  const index = pages.findIndex(page => page.pageNumber === pageNumber);
  if (index !== -1) {
    pages[index] = newPage;
  } else {
    console.warn(`未找到 pageNumber 为 ${pageNumber} 的项，未执行替换。`);
  }

  // 触发响应式更新
  chapterData.value.comicPages = [...pages];
  ElMessage.success('图片更改成功');
}

const updateComicPage =async ()=>{
  try {
    const res = await updateTheComicPage(chapterData.value);
    if (res.code ===1){
      ElMessage.success('章节内容更改成功');
      editChapterDialogVisible.value = false;
    }
  }catch (error) {
    console.error(error);
  }
}

const deleteTheComic = async ()=>{
  try {
    const res = await deleteComic(comic.value.comicId)
    if (res.code ===1){
      ElMessage.success('删除成功');
      //关闭网页
      window.close();
    }
  }catch (error) {
    console.error(error);
  }
}

const deleteTheChapter = async (comicId,chapterNumber)=>{
  try {
    const res = await deleteChapter(comicId,chapterNumber);
    if (res.code ===1){
      ElMessage.success('删除成功');
      // 延迟刷新页面
      setTimeout(() => {
        router.go(0);
      }, 1000); // 延迟 1 秒
    }
  }catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.manage-comic-header {
  display: flex;
  width: 100%;           /* 占满父容器宽度 */
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  gap: 33px;               /* 子元素间距 */
}

.manage-cover-image {
  max-width: 333px;
  width: auto;
  height: auto;
  max-height: 420px;
  margin-left: 600px;
}

.manage-comic-info {
  display: flex;
  flex-direction: column;
  /* margin: -5px 10px; */ /* 去掉 */
  align-items: flex-start;
  width: 100%;
}
.manage-comic-info p {
  font-size: 20px;
  margin: 8px 0;
}

.chapter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.chapter-search {
  width: 240px;
}
.edit-dialog-body {
  display: flex;
  gap: 24px;
  padding: 10px 20px;
}

.edit-left {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-right: 100px;
}

.edit-right {
  flex: 2;
}

.cover-upload-container {
  width: 120px;
  height: 160px;
}

.cover-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.cover-preview {
  height: 350px;
  width: 300px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-wrapper:hover .cover-overlay {
  opacity: 1;
}
.page-upload-container{
}
.page-wrapper{
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.page-overlay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}
.edit-page-preview{
  height: 350px;
  width: 300px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.page-wrapper:hover .page-overlay {
  opacity: 1;
}

.page-wrapper {
  position: relative;
}
.page-checkbox {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
}
.page-upload-area{

  margin: 25px;
}
</style>