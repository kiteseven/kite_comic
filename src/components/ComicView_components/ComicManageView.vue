<template>
  <el-card>
    <el-divider></el-divider>
    <!-- 编辑按钮，右上角 -->
      <div style="display: flex; justify-content: flex-end;">
        <el-button type="primary" size="small" @click="editComicDialogVisible = true">编辑漫画</el-button>
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
      <el-table-column prop="" label="观看数" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="text" size="small">编辑章节</el-button>
          <el-button type="text" size="small">状态变更</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="text-align: center; margin-top: 20px;">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="totalChapters"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </el-card>



  <el-card>

  </el-card>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {getUserDatas} from "@/util/userDataUtil";
import {decrypt} from "@/util/encryptedUtils";
import {getAllComicChapters, getComic, getComicChapters, updateComicBaseInformation} from "@/api/comicApi";
import { watch } from 'vue';
import MainNav from "@/components/HomePage_components/MainNav.vue";
import {ElMessage} from "element-plus";

const avatar = ref("");
const userData = ref();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  slug: String,
  comicId: Number
});

const editComicDialogVisible = ref(false);

const slug = props.slug
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
  // 根据 filterStatus 和 searchKeyword 返回筛选后的章节（分页未实现，仅示例）
  return chapters.value.filter((ch) => {
    const statusMatch = filterStatus.value === '全部' || ch.reviewStatus === filterStatus.value;
    const keywordMatch = ch.chapterName.includes(searchKeyword.value);
    return statusMatch && keywordMatch;
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
</style>