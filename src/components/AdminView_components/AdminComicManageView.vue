<script setup>
import{ ref,onMounted} from 'vue'
import {adminGetComics} from "@/api/adminApi.js";

const comics = ref([]);
const totalComics = ref(0);
const currentPage = ref(1);
const pageSize = ref(9);
const getAllComics =async () => {
  try {
    const response = await adminGetComics(currentPage.value, pageSize.value);
    comics.value = response.data.records; // 例如，后端返回的数据包含一个名为 comics 的数组
    totalComics.value = response.data.total; // 例如，后端返回的数据包含一个名为 total 的总数
  } catch (error) {
    console.error('获取漫画数据失败:', error);
  }
}
const handlePageChange = (page) => {
  currentPage.value = page;
  getAllComics(); // 每次切换页面时重新请求数据
};
const Manage = (comic)=>{
  console.log("管理漫画", comic.title)
}
onMounted(async () => {
  await getAllComics();
})
</script>

<template>
  <div class="manageComicView">
    <div class="comic-grid">
      <div v-for="comic in comics" :key="comic.id" class="comic-item">
        <img :src="comic.coverImage" alt="comic.comicTitle" class="comic-cover"/>
        <div class="comic-info">
          <h3>{{ comic.comicTitle }}</h3>
          <p>作者: {{ comic.authorName }}</p>
          <p>类型: {{ comic.genre }}</p>
          <p>状态: {{ comic.status }}</p>
          <p>最新: {{ comic.updateTime }}</p>
          <el-button type="primary" size="small" @click="Manage(comic)">管理漫画</el-button>
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

<style scoped>
.manageComicView{
  height: 700px;
}
.comic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 33px;
  padding: 33px;
}
.comic-item {
  background-color: #fff;
  padding: 24px;
  border-radius: 17px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.comic-cover {
  width: 100%;
  height: auto;
  max-width: 600px;
  max-height: 600px;
  border-radius: 8px;
}
.comic-info h3 {
  margin: 10px 0;
  font-size: 18px;
}
.comic-info p {
  margin: 5px 0;
  color: #666;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>