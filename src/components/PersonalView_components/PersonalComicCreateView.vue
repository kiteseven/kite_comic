<template>
  <div class="upload-view">
    <el-form ref="formRef" :model="comicData" label-width="120px">
      <el-form-item label="漫画名称">
        <el-input v-model="comicData.comicTitle" placeholder="请输入漫画名称"></el-input>
      </el-form-item>
      <el-form-item label="漫画简介">
        <el-input v-model="comicData.description" placeholder="请输入漫画简介"></el-input>
      </el-form-item>
      <el-form-item label="漫画作者">
        <el-input v-model="comicData.authorName" placeholder="请输入作者名字"></el-input>
      </el-form-item>

      <el-form-item label="漫画类型">
        <el-select
            v-model="comicData.genre"
            placeholder="Select"
            size="large"
            style="width: 240px"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传类型">
        <el-radio-group v-model="radio">
          <el-radio :value="0">原创创作</el-radio>
          <el-radio :value="1">转载作品</el-radio>
          <el-radio :value="2">汉化作品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload
            ref="uploadRef"
            :action="uploadUrl"
            :auto-upload="false"
            :on-success="handleUploadSuccess"
            list-type="picture"
            accept=".jpg,.jpeg,.png,.webp"
            name="file"
            :data="comicData"
        >
          <el-button type="primary">选择漫画封面</el-button>
          <template v-slot:tip>
            <div class="el-upload__tip">最好选足够清晰的封面</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpload">上传漫画封面</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreateComic">创建漫画</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {UploadInstance} from 'element-plus'
import {getUserDatas} from "@/util/userDataUtil";
import {createComic} from "@/api/comicApi";
import {c} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

const userData=ref();


const radio = ref(3)
const uploadUrl = '/api/upload/comicCoverImage'; // 后端上传接口的URL
const comicData = ref({
  comicTitle: '',
  authorId: '',
  authorName: '',
  description: '',
  coverImage: '',
  genre: '',
  status: 0,
  uploadUserId:0,
  review_status: 0,
});

const options = [
  {
    value: 1,
    label: '少年漫'
  },
  {
    value: 2,
    label: '少女漫'
  },
]
const handleUploadSuccess = (response, file, files) => {
  console.log('上传成功', response);
  comicData.value.coverImage=response.data
  console.log(comicData)
  // 处理上传成功后的逻辑，比如更新页面数据或显示图片地址
};

//上传图片
const uploadRef = ref<UploadInstance>()
const handleUpload = () => {
  uploadRef.value!.submit()
}

const handleCreateComic = async () => {
  console.log(comicData)
  if(radio.value===0){
    comicData.value.authorName=userData.value.nickName||userData.value.userName
    comicData.value.authorId=userData.value.userId
  }
  comicData.value.uploadUserId=userData.value.userId;
  console.log(comicData.value.uploadUserId)
  const response =await createComic(comicData.value);
  if(response.code===1){
    alert('漫画创建成功!')
  }
  else{
    alert(response.msg)
  }

};
onMounted( async () => {
  userData.value = await getUserDatas();
})
</script>

<style scoped>
.upload-view{
  padding: 20px;
}
</style>