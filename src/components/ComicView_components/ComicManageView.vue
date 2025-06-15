<template>
  <el-card>
    <el-divider></el-divider>
    <div class="manage-comic-header">
      <img :src="comic.coverImage" alt="comic.title" class="manage-cover-image" />
      <div class="manage-comic-info">
        <h1>{{ comic.comicTitle }}</h1>
        <p>作者: {{ comic.authorName }}</p>
        <p>状态: {{ statusText }}</p>
        <p>类型: {{genreText}}</p>
        <p>标签: <span v-for="tag in comic.genre" :key="tag" class="tag">{{ tag }}</span></p>
        <p>简介: {{ comic.description }}</p>
        <div class="buttons">
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </el-card>



  <el-card>

  </el-card>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {getUserDatas} from "@/util/userDataUtil";
import {decrypt} from "@/util/encryptedUtils";
import {getComic, getComicChapters} from "@/api/comicApi";
import MainNav from "@/components/HomePage_components/MainNav.vue";

const avatar = ref("");
const userData = ref();
const router = useRouter();
const route = useRoute();
const props = defineProps({
  slug: String,
  comicId: Number
});


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
  isCollection:false,
});

// 章节列表
const chapters = ref([
  {comicId:0,chapterNumber:0,chapterName:''}
]);
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


</style>