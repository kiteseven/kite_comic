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
          <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              >
            <div class="history_card" v-for="comic in comicHistoryRecords" key="comic.comicId">
              <img :src="comic.coverImage" alt="comic.title" class="comic-history-cover"/>
              <div class="comic-history-info">
                <h3 @click="goToComicByTheComicReadHistory(comic)">{{ comic.comicTitle }}</h3>

                <p>更新至: {{ comic.leastChapter ||'暂无'}}</p>
                <p @click="goToReadByTheComicReadHistory(comic)">阅读至: {{ comic.readToChapter || '暂无记录' }}</p>
              </div>
            </div>
            <template #reference>
            <el-link>历史</el-link>
            </template>
          </el-popover>


          <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              >
            <div class="collection_card" v-for="comic in comicCollections" key="comic.comicId">
              <img :src="comic.coverImage" alt="comic.title" class="comic-collection-cover"/>
              <div class="comic-collection-info">
                <h3 @click="goToComicByTheComicReadHistory(comic)">{{ comic.comicTitle }}</h3>

                <p>更新至: {{ comic.leastChapter ||'暂无'}}</p>
                <p @click="goToReadByTheComicReadHistory(comic)">阅读至: {{ comic.readToChapter || '暂无记录' }}</p>
              </div>
            </div>
            <template #reference>
              <el-link>追漫</el-link>
            </template>
          </el-popover>

          <div class="block">

            <!-- 头像弹出框 -->
            <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
                v-model:visible="avatarPopoverVisible"
            >
              <div class="popover-content">
                <el-link href="/personal" target="_blank">个人主页</el-link>
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
                title="登录"
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
                title="注册"
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

<script setup>
import {reactive ,ref,onMounted} from "vue";
import {
  submitLoginDTO,
  submitRegisterDTO,
  getUserData,
} from "@/api/userApi"
import {useUserStore} from "@/store/user.js";
import {getComicCollectionToShow, getTheComicReadHistoryToShow} from "@/api/comicApi.js";
import {encipher} from "@/util/encryptedUtils.js";
import {useRouter} from "vue-router";
const isLogin = ref(false);
const Login_dialogVisible = ref(false)

const Registry_dialogVisible=ref(false)

const userAvatar = ref(''); // 用户头像 URL
const router = useRouter();

const loginForm=reactive({
  identifier: '',
  password: ''
})
const registerForm=reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const  comicHistoryRecords =ref(

)
const comicCollections =ref()
// 模拟退出逻辑
const logout = () => {
  isLogin.value = false; // 退出后重置登录状态
  userAvatar.value = ''; // 清空头像
  localStorage.removeItem('token')
};

const submitLogin = async () => {
  try {
    // 简单的表单验证，确保用户名和密码不为空
    if (!loginForm.identifier || !loginForm.password) {
      alert("请输入用户名和密码");
      return;
    }
    console.log(loginForm)
    // 模拟向服务器发送登录请求
    const response = await submitLoginDTO(loginForm);
    // 根据服务器响应处理登录逻辑
    if (response.code===1) {
      isLogin.value = true; // 更新登录状态
      userAvatar.value = response.data.avatar; // 设置用户头像 URL
      const token = response.data.token;
      console.log(token)
      localStorage.setItem('token',token)
      Login_dialogVisible.value = false; // 关闭登录对话框
    } else {
      alert(response.message); // 显示错误信息
    }
  } catch (error) {
    console.error("登录失败", error);
    alert("登录失败，请稍后再试");
  }
};
const submitRegistry = async () => {
  try {
    // 简单的表单验证，确保用户名、密码和确认密码不为空
    if (!registerForm.username || !registerForm.password || !registerForm.confirmPassword) {
      alert("请完整填写所有注册信息");
      return;
    }

    // 确保密码和确认密码一致
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }

    // 模拟向服务器发送注册请求
    const response = await submitRegisterDTO(registerForm);
    // 根据服务器响应处理注册逻辑
    if (response.code===1) {
      alert("注册成功，请登录");
      Registry_dialogVisible.value = false; // 关闭注册对话框
    } else {
      alert(response.message); // 显示错误信息
    }
  } catch (error) {
    console.error("注册失败", error);
    alert("注册失败，请稍后再试");
  }
};
const Login_handleClose = () => {
  // 处理关闭逻辑
  console.log("登录界面关闭");
  // 可以根据需求处理其他关闭逻辑，例如清空表单等
  loginForm.identifier='';
  loginForm.password= '';
  Login_dialogVisible.value=false;
};

const Registry_handleClose = () => {
  console.log("注册界面关闭");
  // 清空 registerForm 的内容
  registerForm.username = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';

  // 将对话框的显示状态设置为 false
  Registry_dialogVisible.value = false;
};

const getUserDataByToken = async () => {
  const token = localStorage.getItem('token');
  if (token){
    const response = await getUserData();
    if (response.code===1) {
      userAvatar.value=response.data.avatar;
      const userStore = useUserStore();
      userStore.userData=response.data
      console.info(userStore.userData)
      isLogin.value = true; // 设置为登录状态
    }
  }

}
//获取漫画阅读历史记录展示
const getTheComicReadHistory = async () => {
  const response = await getTheComicReadHistoryToShow();
  if (response.code===1) {
    console.log(response.data);
    comicHistoryRecords.value = response.data;
  }
}
const getTheComicCollection = async () => {
  const response = await getComicCollectionToShow();
  if (response.code===1) {
    console.log(response.data);
    comicCollections.value = response.data;
  }
}
//通过历史记录进入漫画详情界面
const goToComicByTheComicReadHistory = (comic) => {
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

//通过历史记录进入上次阅读的漫画观看页面
const goToReadByTheComicReadHistory = (comic) => {
  console.log(comic.readToChapter)
  let v = encipher(comic.comicId)
  // 在新标签页中打开路径
  const url = router.resolve(
      {
        name: 'ComicReader',
        params: {
          slug:comic.slug,
          chapterNumber : comic.readChapterNumber
        },
        query: { v:v } }
  ).href;
  window.open(url, '_blank');
}
// 页面加载时检查是否有 token
onMounted(async () => {
  await getUserDataByToken()
  await getTheComicReadHistory()
  await getTheComicCollection()
});


</script>

<style scoped>
.mainNav{
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 让两个 div 之间有空隙 */
  align-items: center; /* 垂直方向居中对齐 */
  width: 100%;
  height: auto;
  margin: 0;
}
.MainNav_inner_left{

}
.MainNav_inner_right{
  margin-right: 50px; /* 让右侧容器向左推挤 */
}
.nav_link a, .login_link a{
  margin-right: 15px; /* 每个链接之间的间距 */
  text-decoration: none; /* 去除链接下划线 */
  color: #333; /* 设置链接颜色 */
}
.login_link{
  display: flex;
  flex-direction: row;
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
}
.popover-content {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.history_card{
  display: flex;
  flex-direction: row;
}
/* 在 style scoped 中添加 */
.history_card + .history_card {
  margin-top: 10px; /* 根据需要调整间距 */
}
.comic-history-cover {
  width: 75PX;
  height: 120px; /* 固定高度，确保封面高度一致 */
  object-fit: cover; /* 保持封面的比例，不变形，并填充整个容器 */
  overflow: hidden; /* 隐藏超出部分，防止封面大小不一 */
  border-radius: 8px; /* 可选：给封面添加圆角，让视觉效果更好 */
}


.comic-history-info {
  text-align: left;
}

.comic-history-info h3 {
  font-size: 1.2rem;   /* 或者直接写 18px/20px，根据需要调节 */
  font-weight: 700;    /* 也可以写 bold */
  margin: 0;           /* 视情况调整上下间距 */
}

.collection_card{
  display: flex;
  flex-direction: row;
}
/* 在 style scoped 中添加 */
.collection_card + .collection_card {
  margin-top: 10px; /* 根据需要调整间距 */
}

.comic-collection-cover {
  width: 75PX;
  height: 120px; /* 固定高度，确保封面高度一致 */
  object-fit: cover; /* 保持封面的比例，不变形，并填充整个容器 */
  overflow: hidden; /* 隐藏超出部分，防止封面大小不一 */
  border-radius: 8px; /* 可选：给封面添加圆角，让视觉效果更好 */
}


.comic-collection-info {
  text-align: left;
}

.comic-collection-info h3 {
  font-size: 1.2rem;   /* 或者直接写 18px/20px，根据需要调节 */
  font-weight: 700;    /* 也可以写 bold */
  margin: 0;           /* 视情况调整上下间距 */
}
</style>