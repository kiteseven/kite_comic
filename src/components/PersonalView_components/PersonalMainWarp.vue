<template>
  <div class="personalMainWarp">
    <div class="personalNav">
      <el-menu class="menu-list">
        <el-menu-item index="1"><router-link to="/personal/manageComic">管理我的漫画</router-link></el-menu-item>
        <el-menu-item index="2">我的小说</el-menu-item>
        <el-menu-item index="3"><router-link to="/personal/createComic">创建漫画</router-link></el-menu-item>
        <el-menu-item index="4"><router-link to="/personal/uploadComic">上传漫画</router-link></el-menu-item>
        <el-menu-item index="5">空间背景</el-menu-item>
        <el-menu-item index="6"><router-link to="/personal/personalSettings">个人设置</router-link></el-menu-item>
      </el-menu>
    </div>


    <!-- 右侧主内容区域 -->
    <div class="personalMainContent">
      <router-view></router-view>
    </div>
  </div>


</template>

<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
  userData: {
    type: Object,
    required: false
  }
});



const defaultAvatar = 'https://via.placeholder.com/150'; // 默认头像图片
</script>

<style scoped>
.personalMainWarp{
  display: flex;
  flex-direction: row;
  width: 100%;
}
.personal-view-main-wrap {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 80px); /* 去除顶部和页脚的高度 */
  padding: 20px; /* 增加整体边距 */
}
.personalNav{
  width: 10%;
}
.personalMainContent{
  width: 90%;
}
</style>