<template>
  <div class="topTheme">

    <div class="topTheme_inner">


      <div class="topTheme_inner_logo">
        <a href="/" class="topTheme_inner_logo_a">
          <!-- 在这里可以插入 logo 图片或内容 -->
          <img src="/logo_picture.jpg" alt="主页 Logo" class="logo-img">
        </a>
      </div>


      <div class="topTheme_inner_search">
        <el-input class="search" v-model="input" placeholder="请输入关键词" size="large"/>
      </div>
      <div class="topTheme_inner_search_submit">
        <el-button type="primary" :icon="Search" size="large" @click="handleSearch"/>
      </div>

      <div class="topTheme_inner_right"></div>
    </div>


    <div class="topTheme_inner_nav">
      <el-menu class="topTheme_inner_nav_menu" mode="horizontal" collapse="false">
        <el-menu-item index="1">
          <router-link to="/" style="text-decoration: none; color: inherit;" >首页</router-link>
        </el-menu-item>
        <el-menu-item index="2">类别1</el-menu-item>
        <el-menu-item index="3">类别2</el-menu-item>
        <el-menu-item index="4">排行榜</el-menu-item>
        <el-menu-item index="5"><router-link to="/category">全部</router-link></el-menu-item>

        <el-menu-item index="6" class="upload-menu-item" >
          <a target="_blank" href="/personal/uploadComic">上传漫画</a>
        </el-menu-item>

      </el-menu>
    </div>
    <div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {useRouter} from "vue-router";
const input = ref('')
const router = useRouter();
// 处理搜索逻辑
const handleSearch = () => {
  if (!input.value.trim()) return;
    // 跳转到搜索路由
    if(router.currentRoute.value.path!=='/search'){
      const url = router.resolve(
          {
            name: 'search',
            query: { q: input.value }
          }
      ).href;
      window.open(url, '_blank');
    }
    else {
      router.push({ path: '/search', query: { q: input.value } });
    }
}

</script>

<style scoped>
.topTheme{
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 100px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 1850px;
  background-image: url('/88a52215cd47768934ca069075faedbf614323946.jpg');
  background-size: cover; /* 背景图覆盖整个容器 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 不重复背景图 */
}
.topTheme_inner{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  margin: 0 auto; /* 保持居中 */
  padding: 10px;
}
.topTheme_inner_logo {
  flex: 0 1 auto;
  width: 250px; /* 固定 Logo 的宽度 */
}
.topTheme_inner_logo_a {
  width: 250px;
  height: auto;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.logo-img {
  max-width: 166px; /* 设置 Logo 图片的最大宽度，你可以调整这个值 */
  height: auto; /* 高度自动调整 */
}
.topTheme_inner_search {
  flex: 0 0 33.33%; /* 搜索框占用 1/3 宽度 */
  flex-direction: row;
  margin: 0 auto; /* 保持居中 */
  text-align: center; /* 搜索框居中对齐 */
  min-width: 500px; /* 设置最小宽度，防止过度缩小 */
}
.search {
  width: 100%; /* 让搜索框填充父容器的剩余宽度 */
}
.topTheme_inner_right {
  flex: 0 1 auto;
  width: 250px; /* 右侧可以留作未来扩展（如用户头像等） */
}
.topTheme_inner_nav{
  display: flex;
  flex-direction: column;
  height: 100px; /* 增大导航栏整体高度 */
  max-width: 1920px;
}
.topTheme_inner_nav_menu{
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 100%;
  max-width: 1920px;
  height: 100% !important; /* 继承父容器高度 */
  font-size: 30px; /* 基础字体大小 */
}
</style>