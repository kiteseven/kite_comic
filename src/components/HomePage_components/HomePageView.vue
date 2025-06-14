<script setup>

import MainNav from "@/components/HomePage_components/MainNav.vue";
import TopTheme from "@/components/HomePage_components/TopTheme.vue";
</script>

<template>
  <div class="common-layout">
    <el-container class="HomePage_container">
      <el-header>
        <div class="header_Nav"><MainNav></MainNav></div>
      </el-header>
      <el-main>
        <div class="HomePage_TopTheme"><TopTheme></TopTheme></div>
        <div class="HomePage_Wrap"><router-view></router-view></div>
      </el-main>
      <el-footer>
        © 2024 KITE_COMIC ALL KITESEVEN
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.HomePage_container{
  height: 100%;
  width: 100%;
}
.common-layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 确保内容从顶部开始对齐 */
  flex-grow: 1;
  min-height: 100vh; /* 设置最小高度为 100% 视窗高度 */
}
.header_Nav {
  display: flex;
  flex-direction: row;
  width: 100%;
  position: fixed;
  top: 0;
  height: 100px; /* 固定导航栏高度 */
  background-color: #f8f9fa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* main 占据剩余空间 */
.el-main {
  margin-top: 1px;
  display: flex;
  flex-direction: column; /* 设置列方向的 Flexbox 布局 */
  justify-content: flex-start; /* 确保内容从顶部开始对齐 */
  flex-grow: 1;
  align-items: center; /* 可选：如果你希望内容水平居中 */
  padding-top: 0;
  overflow-y: hidden;
}
.HomePage_Wrap{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* footer 固定在底部 */
.el-footer {
  text-align: center;
  background-color: #f0f0f0;
  padding: 10px;
  width: 100%;
}
html, body #app{
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>