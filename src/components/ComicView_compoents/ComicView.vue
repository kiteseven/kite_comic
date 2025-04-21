<template>
  <div class="comic-detail">

    <el-card>
      <div class="comic-header">
          <img :src="comic.coverImage" alt="comic.title" class="cover-image" />
          <div class="comic-info">
            <h1>{{ comic.comicTitle }}</h1>
            <p>作者: {{ comic.authorName }}</p>
            <p>点击量: {{ comic.click }}</p>
            <p>状态: {{ comic.status }}</p>
            <p>题材: <span v-for="tag in comic.genre" :key="tag" class="tag">{{ tag }}</span></p>
            <p>简介: {{ comic.description }}</p>
            <div class="buttons">
              <el-button type="primary" @click="goToReader">开始阅读</el-button>
              <el-button type="danger">取消收藏</el-button>
              <el-button type="success" @click="shareTo">分享</el-button>
            </div>
          </div>
      </div>
    </el-card>

    <el-card>
      <div class="comic-chapters">
        <h2>章节列表</h2>
        <div class="chapter-list">
          <el-button
              v-for="chapter in chapters"
              :key="chapter.chapterNumber"
              @click="goToChapter(chapter.chapterNumber)"
              class="chapter-button"
          >
            {{ chapter.chapterName}}
          </el-button>
        </div>
      </div>
    </el-card>


  </div>


  <el-dialog
      v-model="shareDialogVisible"
      title="分享链接"
      width="500"

  >
    <div style="height: 200px">

    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="shareDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="shareDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import{
  getComic,
  getComicChapters,
} from '@/api/comicAPi'
import {
  encipher,
  decrypt
} from '@/util/encryptedUtils'

import CryptoJS from "crypto-js";
import {Action, ElMessage, ElMessageBox} from "element-plus";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  slug: String,
  comicId: Number
});
const slug = props.slug

const shareDialogVisible=ref(false)
const shareLink = ref('');
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
  slug:''
});

// 章节列表
const chapters = ref([
  {comicId:0,chapterNumber:0,chapterName:''}
]);
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
    const chaptersResponse = await getComicChapters(slug,comicId);
    console.log(chaptersResponse)
    chapters.value = chaptersResponse.data;
    console.log(chapters)
  } catch (error) {
    console.error('Failed to load comic data', error);
  }
}
// 页面挂载时加载漫画数据
onMounted( () => {
  getTheComic()
});

// 跳转到阅读页面
const goToReader = () => {

  if (chapters.value.length > 0) {
    let v = encipher(comic.value.comicId)
    const url = router.resolve(
        {
          name: 'ComicReader',
          params: {
            slug:comic.value.slug,
            chapterNumber: chapters.value[0].chapterNumber
          },
          query: { v : v} }
    ).href;
    window.open(url, '_blank');
  }
};

// 跳转到具体章节阅读
const goToChapter = (chapterNumber: number) => {
  console.log(chapterNumber)
  let v = encipher(comic.value.comicId)
  // 在新标签页中打开路径
  const url = router.resolve(
      {
        name: 'ComicReader',
        params: {
          slug:comic.value.slug,
          chapterNumber : chapterNumber
        },
    query: { v:v } }
  ).href;
  window.open(url, '_blank');
};

//分享链接功能
const shareTo = () => {
  let v = encipher(comic.value.comicId)
  const comicUrl = `http://localhost:5173/comic/${slug}?v=${v}`;
  const encodedUrl = encodeURIComponent(comicUrl);
  shareLink.value = `http://localhost:5173/shared?redirect=${encodedUrl}`;
  console.info(shareLink.value);
  shareDialogVisible.value=true
}
</script>

<style scoped>
.comic-detail {
  padding: 33px;
}

.comic-header {
  display: flex;
}

.cover-image {
  max-width: 333px;
  width: auto;
  height: auto;
  max-height: 420px;
  margin-right: 33px;
}

.comic-info {
  display: flex;
  flex-direction: column;
  margin: -5px 10px;
  align-items: flex-start; /* 新增：强制左对齐 */
  width: 100%; /* 新增：撑满容器宽度 */
}
.comic-info p {
  font-size: 20px;
  margin: 8px 0;
}
.buttons {
  margin-top: 33px;
}
.buttons button{
  width: 100px;
  height: 40px;
}

.comic-chapters {
  margin-top: 66px;
}

.chapter-list {
  display: flex;
  flex-wrap: wrap;
}

.chapter-button {
  margin: 8px;
}
</style>
