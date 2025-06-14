<template>
<div class="upload-view">
<el-form ref="formRef" :model="comicData" label-width="120px">
  <el-form-item label="漫画名称">
    <el-input v-model="comicData.comicTitle" placeholder="请输入漫画名称"></el-input>
  </el-form-item>
  <el-form-item label="章节名">
    <el-input v-model="comicData.comicChapter.chapterName" placeholder="请输入章节名"></el-input>
  </el-form-item>
  <el-form-item label="章节数">
    <el-input v-model="comicData.comicChapter.chapterNumber" placeholder="请输入章节数"></el-input>
  </el-form-item>
  <el-form-item label="图片上传">
    <el-upload
        ref="uploadRef"
        :action="uploadUrl"
        multiple
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        list-type="picture"
        accept=".jpg,.jpeg,.png,.webp"
        name="file"
        :data="comicData"
    >
      <el-button type="primary">批量添加图片</el-button>
      <template v-slot:tip>
        <div class="el-upload__tip">支持批量上传，最大300张图片。为以防顺序错乱，请将图片文件统一命名为章节-张数（例 1-1，2-2）</div>
      </template>
    </el-upload>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleUpload">上传图片</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleUploadComic">上传漫画</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadInstance, UploadRawFile } from 'element-plus'
import {getUserDatas} from "@/util/userDataUtil";
import {uploadComic} from "@/api/comicApi";

const userData=ref();


const comicData = ref({
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
    chapterName: '',
  },
  comicPages:{

  }
});
const extractPageNumber = (url) => {
  // 使用正则表达式提取最后的数字
  const match = url.match(/_(\d+)\.webp$/);
  return match ? parseInt(match[1], 10) : null;
};
const uploadUrl = '/api/upload/comicImage'; // 后端上传接口的URL

const ComicPagesMapData = new Map();
const handleUploadSuccess = (response, file, files) => {
  console.log('上传成功', response);
  const imgUrl = response.data;
  const pageNumber = extractPageNumber(imgUrl);
  // 按页码对上传的图片进行排序
  console.log(imgUrl);
  ComicPagesMapData.set(pageNumber,imgUrl)
  console.log('第'+pageNumber+'页')
  console.log(ComicPagesMapData)

  // 处理上传成功后的逻辑，比如更新页面数据或显示图片地址
};

const handleUploadError = (error, file, files) => {
  console.error('上传失败', error);
  // 处理上传失败后的逻辑，比如显示错误提示
};

const uploadRef = ref<UploadInstance>()
const handleUpload = () => {
  uploadRef.value!.submit()
}

const beforeUpload = (file: UploadRawFile) => {
  // 检查文件大小，限制在5MB以内
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('上传的图片大小不能超过 5MB!');
    return false;
  }

  // 检查文件类型，限制为指定格式
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    ElMessage.error('仅支持上传 jpg, jpeg, png, webp 格式的图片!');
    return false;
  }

  // 其他安全性检查，例如防止恶意文件上传，可以根据业务需求增加检查逻辑
  // 可以使用第三方库来进一步验证文件内容
  console.log('检查通过')
  return true;
}
const handleUploadComic = async () => {

  const pageData =Object.fromEntries(ComicPagesMapData);//Map转json对象

  //给comicData的comicChapter中的Map对象pages赋值
  comicData.value.comicPages=pageData;
  comicData.value.uploadUserId=userData.userId;
  console.log(comicData)
  const response =await uploadComic(comicData.value);
  if(response.code===1){
    alert('上传成功!')
    window.location.reload(); // 上传成功后刷新界面
  }else
  {
    alert(response.msg)
  }
};

onMounted( async () => {
  userData.value = await getUserDatas();
})
</script>

<style scoped>
.upload-view {
  padding: 20px;

}
</style>