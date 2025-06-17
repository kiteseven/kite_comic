<template>
  <el-card class="upload-chapter-card">
    <el-form ref="formRef" :model="comicData" label-width="100px">
      <!-- 基本信息 -->
      <el-form-item label="章节名">
        <el-input v-model="comicData.comicChapter.chapterName" placeholder="例如：第1话" />
      </el-form-item>

      <el-form-item label="章节序号">
        <el-input v-model="comicData.comicChapter.chapterNumber" placeholder="例如：1" />
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
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
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
        <el-button type="success" @click="handleUploadComic">发布章节</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getUserDatas } from '@/util/userDataUtil';
import { uploadComic } from '@/api/comicApi';
const props = defineProps({
  slug: String,
  comicId: Number
});
const uploadUrl = '/api/upload/comicImage';

const formRef = ref();
const uploadRef = ref();
const userData = ref();

const slug = props.slug
const comicId= props.comicId;

const comicData = ref({
  comicId:'',
  comicTitle: '',
  authorId: '',
  authorName: '',
  description: '',
  coverImage: '',
  genre: '测试',
  isCompleted: 0,
  uploadUserId: '',
  review_status: 0,
  comicChapter: {
    chapterNumber: '',
    chapterName: ''
  },
  comicPages: {}
});

const ComicPagesMapData = new Map();

const extractPageNumber = (url: string) => {
  const match = url.match(/_(\d+)\.webp$/);
  return match ? parseInt(match[1], 10) : null;
};

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

const handleUploadSuccess = (res, file) => {
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
  comicData.value.uploadUserId = userData.value.userId;
  comicData.value.comicId=comicId;
  const res = await uploadComic(comicData.value);
  if (res.code === 1) {
    ElMessage.success('上传成功！');
    window.location.reload();
  } else {
    ElMessage.error(res.msg);
  }
};

const resetForm = () => {
  comicData.value = {
    comicTitle: '',
    authorId: '',
    authorName: '',
    description: '',
    coverImage: '',
    genre: '测试',
    isCompleted: 0,
    uploadUserId: '',
    review_status: 0,
    comicChapter: {
      chapterNumber: '',
      chapterName: ''
    },
    comicPages: {}
  };
  ComicPagesMapData.clear();
  uploadRef.value?.clearFiles?.();
};

onMounted(async () => {
  userData.value = await getUserDatas();
});

</script>

<style scoped>
.upload-chapter-card {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}
.upload-area {
  width: 100%;
}

</style>
