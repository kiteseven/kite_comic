<template>
  <div class="comic-list">
    <!-- 排序 -->
    <div class="comic-list-sort">
      <span>排序:</span>
      <el-button-group>
        <el-button @click="sortBy('latest')">更新时间</el-button>
        <el-button @click="sortBy('popularity')">热门</el-button>
      </el-button-group>
      <span>分类:</span>
      <el-button-group>
        <el-button @click="sortType(0)">全部</el-button>
        <el-button @click="sortType(1)">少年漫</el-button>
        <el-button @click="sortType(2)">少女漫</el-button>
      </el-button-group>
    </div>

    <!-- 漫画项目 -->
    <div class="comic-grid">
      <div v-for="comic in comics" :key="comic.comicId" class="comic-item">
        <img :src="comic.coverImage" alt="comic.title" class="comic-cover"/>
        <div class="comic-info">
          <h3>{{ comic.comicTitle }}</h3>
          <p>作者: {{ comic.authorName }}</p>
          <p>类型: {{ comic.genre }}</p>
          <p>状态: {{ comic.status }}</p>
          <p>最新: {{ comic.latestChapter }}</p>
          <el-button type="primary" size="small" @click="startReading(comic)">开始阅读</el-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalComics"
          :page-size="pageSize"
          @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'

import {getComicByPageSize} from "@/api/comicApi.js";
import {encipher} from "@/util/encryptedUtils.js";
import {useRouter} from "vue-router";
const currentPage = ref(1);
const pageSize = ref(8);
const totalComics = ref(0); // 用于记录总数
const type= ref("update_time")
const kind = ref(0)
const router = useRouter();
const comics = ref([
  {
    comicId: 1,
    comicTitle: 'AAAA',
    authorName: 'AAAA',
    genre: 'AAA',
    status: 'A',
    latestChapter: 'A',
    coverImage: 'public/1725076483407.jpg',
  }
])
onMounted(() => {
  fetchComics();
});

// 请求漫画数据函数
const fetchComics = async () => {
  try {
    const response = await getComicByPageSize(currentPage.value,pageSize.value,type.value,kind.value);
    console.log(response)
    comics.value = response.data.records; // 例如，后端返回的数据包含一个名为 comics 的数组
    totalComics.value = response.data.total; // 例如，后端返回的数据包含一个名为 total 的总数
  } catch (error) {
    console.error('获取漫画数据失败:', error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchComics(); // 每次切换页面时重新请求数据
};

const sortBy = (criteria) => {
  if (criteria === 'latest') {
    type.value="update_time"
    fetchComics(); // 每次切换页面时重新请求数据
  } else if (criteria === 'popularity') {
    // 模拟排序逻辑
    type.value="click"
    fetchComics(); // 每次切换页面时重新请求数据
  }
}

const sortType = (sort) => {
  kind.value = sort
  fetchComics();
}

const startReading = (comic) => {
  console.log('开始阅读:', comic.comicTitle)
  console.info(comic)
  console.info(comic.slug)
  console.info(comic.comicId)

  //将comicId加密
  const encryptedId = encipher(comic.comicId)

  const url = router.resolve({
        name: 'ComicView',
        params: { slug : comic.slug} ,
        query: {
          v: encryptedId // 示例URL: /comic/one-piece?v=U2FsdGVkX1+...
        }
      }
  ).href;
  // 在新标签页中打开路径
  window.open(url, '_blank');

}


</script>

<style scoped>
.comic-list {
  padding: 33px;
  height: auto;
}

.comic-list-sort {
  margin-bottom: 33px;
}

.comic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 33px;
}

.comic-item {
  border: 1px solid #eaeaea;
  padding: 15px;
  background-color: #fff;
  text-align: center;
}

.comic-cover {
  width: 300PX;
  height: 500px; /* 固定高度，确保封面高度一致 */
  object-fit: cover; /* 保持封面的比例，不变形，并填充整个容器 */
  overflow: hidden; /* 隐藏超出部分，防止封面大小不一 */
  border-radius: 8px; /* 可选：给封面添加圆角，让视觉效果更好 */
}


.comic-info {
  text-align: left;
}

.pagination {
  margin-top: 33px;
  text-align: center;
}
</style>