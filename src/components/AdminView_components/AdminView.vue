<script setup>
import {
  Location,
  Setting, Menu, Reading, User,
} from '@element-plus/icons-vue'
</script>

<template>
  <div class="common__layout">
    <el-container class="el-c-admin">
      <el-aside class="admin-aside-c">
        <el-menu
            default-active="2"
            class="el-menu-vertical"
            @open="handleOpen"
            @close="handleClose"
            :router="true"
        >
          <el-menu-item index="/admin">
            <el-icon><Menu /></el-icon>
            <span>首页概览</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Reading /></el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/manageComic">漫画管理</el-menu-item>
            <el-menu-item index="/admin/manageComic">审核管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/admin/manageUser">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </div>

</template>

<style scoped>
.common__layout{
  height: 100%;
  width: 100%;
}
.el-c-admin{
  height: 100%;
  width: 100%;
}
.admin-aside-c{
  width: 20%;
}
.el-menu-vertical{
  font-size: 200px;
}
.el-menu-item {
  font-size: 20px;
}
.el-icon{
  font-size: 20px;
}

</style>