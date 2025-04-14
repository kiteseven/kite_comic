<script setup>

</script>

<template>
  <div class="mainNav" id="pubNav">

    <div class="MainNav_inner_left">

      <div class="nav_link">
        <a target="_blank" href="/">首页</a>
        <a href="#about">关于我们</a>
        <a href="#contact">联系我们</a>
      </div>

    </div>

    <div class="MainNav_inner_right">

      <div class="login_link">
        <!-- 登录后显示头像和个人（选项）-->
        <template v-if="isLogin">
          <div class="block">
            <!-- 头像弹出框 -->
            <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                v-model:visible="avatarPopoverVisible"
            >
              <div class="popover-content">
                <el-link href="/author" target="_blank">个人主页</el-link>
                <el-button type="text" @click="logout">退出登录</el-button>
              </div>
              <template #reference>
                <el-avatar class="avatar" :size="50" :src="userAvatar" />
              </template>
            </el-popover>
          </div>

        </template>
        <template v-else>
          <div>

            <el-button text @click="Login_dialogVisible = true">登录</el-button>


            <el-dialog
                v-model="Login_dialogVisible"
                title="Login"
                width="30%"
                :before-close="handleClose"
            >
              <el-form :model="loginForm" label-width="100px">
                <el-form-item label="登录" prop="identifier">
                  <el-input v-model="loginForm.identifier" placeholder="请输入用户名/账号/手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" clearable></el-input>
                </el-form-item>
              </el-form>
              <template v-slot:footer>
                <span  class="dialog-footer">
                  <el-button @click="Login_handleClose">取消</el-button>
                  <el-button type="primary" @click="submitLogin">登录</el-button>
                </span>
              </template>
            </el-dialog>



            <el-button text @click="Registry_dialogVisible = true">注册</el-button>

            <el-dialog
                v-model="Registry_dialogVisible"
                title="Registry"
                width="30%"
                :before-close="handleClose"
            >
              <el-form v-model="registerForm" label-width="100px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="registerForm.username" placeholder="请输入用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="registerForm.password" placeholder="请输入密码" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="confirmPassword">
                  <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码" clearable></el-input>
                </el-form-item>
              </el-form>
              <template v-slot:footer>
                <span  class="dialog-footer">
                  <el-button @click="Registry_handleClose">取消</el-button>
                  <el-button type="primary" @click="submitRegistry">注册</el-button>
                </span>
              </template>
            </el-dialog>


          </div>
        </template>
      </div>


    </div>

  </div>
</template>

<style scoped>
.mainNav{
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 让两个 div 之间有空隙 */
  align-items: center; /* 垂直方向居中对齐 */
  width: 100%;
  margin: 0;
}
.MainNav_inner_left{

}
.nav_link a, .login_link a{
  margin-right: 15px; /* 每个链接之间的间距 */
  text-decoration: none; /* 去除链接下划线 */
  color: #333; /* 设置链接颜色 */
}
.login_link a:last-child{
  margin-right: 0; /* 最后一个链接不需要右边距 */
}
.block{
  display:flex;
  flex-direction: row;
}
.logout_nav{
  padding-top: 20px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
}
.popover-content {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>