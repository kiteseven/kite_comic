<template>
  <div class="comic-detail">
    <div class="header_Nav"><MainNav></MainNav></div>
    <el-card>
      <el-divider></el-divider>
      <div class="comic-header">
          <img :src="comic.coverImage" alt="comic.title" class="cover-image" />
          <div class="comic-info">
            <h1>{{ comic.comicTitle }}</h1>
            <p>作者: {{ comic.authorName }}</p>
            <p>点击量: {{ comic.click }}</p>
            <p>状态: {{ statusText }}</p>
            <p>类型: {{genreText}}</p>
            <p>标签: <span v-for="tag in comic.genre" :key="tag" class="tag">{{ tag }}</span></p>
            <p>简介: {{ comic.description }}</p>
            <div class="buttons">
              <el-button type="primary" @click="goToReader">开始阅读</el-button>
              <el-button
                  v-if="!comic.isCollection"
                  type="primary"
                  @click="collectComic"
              >
              收藏
              </el-button>
              <el-button v-else type="danger" @click="cancelCollectComic">取消收藏</el-button>
              <el-button type="success" @click="shareTo">分享</el-button>
            </div>
          </div>
      </div>
      <el-divider></el-divider>
    </el-card>


    <el-card>
      <el-divider></el-divider>
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
      <el-divider></el-divider>
    </el-card>

    <!--评论列表 --->
    <el-card class="comicComment">
      <h3 style="margin-right: 1360px">评论</h3>
      <div>
        <el-card>
          <div class="comicComment_userInformation">
            <el-avatar :size="100" :src="avatar"></el-avatar>
            <el-input
                v-model="commentInput"
                placeholder="请输入内容"
                type="textarea"
                resize="none"
                :rows="6"
            ></el-input>
          </div>
            <el-button style="margin-left: 1340px" @click="publishComment">发布</el-button>
        </el-card>
      </div>


      <el-card class="commentList">
        <ul>
          <li
              v-for="comment in commentList"
              :key="comment.commentId"

          >
            <el-card class="commentCard">
              <div class="comment_userInformation">
                <el-avatar :size="75" :src="comment.avatar"></el-avatar>
                <div>{{comment.userName}}</div>
              </div>
              <el-divider></el-divider>
              <el-text>{{comment.commentContent}}</el-text>
              <el-divider></el-divider>

                  <el-descriptions size="default">
                    <el-descriptions-item >{{comment.uploadTime||'暂无'}}</el-descriptions-item>
                    <el-descriptions-item ><el-button style="margin-top: 2.8px" type="text">回复</el-button></el-descriptions-item>
                  </el-descriptions>

              <div class="sonCommentList"
                   v-for="sonComment in comment.sonComments"
                   :key="sonComment.commentId"
              >
                <div class="sonComment_userInformation">
                  <el-avatar :size="50" :src="sonComment.avatar"></el-avatar>
                  <div>{{sonComment.userName}}</div>
                </div>
                <el-divider></el-divider>
                <el-text>{{sonComment.commentContent}}</el-text>
                <el-divider></el-divider>
                <el-descriptions size="small">
                  <el-descriptions-item >{{comment.uploadTime||'暂无'}}</el-descriptions-item>
                </el-descriptions>
              </div>

            </el-card>
          </li>
        </ul>
      </el-card>

    </el-card>




  </div>

</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CryptoJS from "crypto-js";
import {ElMessage} from "element-plus";
import {
  addTheComicReadHistory, cancelTheCollectComic, collectTheComic,
  getComic,
  getComicChapters, getComments,
  publishComments,
} from '@/api/comicAPi'
import {
  encipher,
  decrypt
} from '@/util/encryptedUtils'
import {getUserDatas} from "@/util/userDataUtil";
import MainNav from "@/components/HomePage_components/MainNav.vue";



const router = useRouter();
const route = useRoute();

const avatar = ref("");

const userData = ref();

const props = defineProps({
  slug: String,
  comicId: Number
});
const slug = props.slug
ref(false);

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
  slug:'',
  isCollection:false,
});

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

//评论输入框内容
const commentInput = ref("")

const CommentUploadDTO = ref(
    {
          comicId: 0,
          userId: 0,
          commentContent: '',

    }
)

//发布评论
const publishComment = async () => {

  if (commentInput.value!==null){
    CommentUploadDTO.value.comicId =comic.value.comicId;
    CommentUploadDTO.value.userId= userData.value.id;
    CommentUploadDTO.value.commentContent = commentInput.value;
    console.info(CommentUploadDTO.value)
    const response = await publishComments(CommentUploadDTO.value);

    if (response.code === 1) {
      ElMessage.success("评论成功!")
      commentInput.value = null
    }
  }


}

//评论集合
const commentList = ref(
    [
      { commentId : 0,
        userName: '用户名',
        id: 0,
        commentContent : '内容容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
        avatar: "/logo_picture.jpg", //用户头像
        uploadTime: 2024-1-10,
        sonComments: [
          {
            commentId : 0,
            userName: '用户名',
            id: 0,
            commentContent : '内容',
            avatar: "/logo_picture.jpg", //用户头像
            uploadTime: 2024-1-10,
          }
        ],
      },
      { commentId : 0,
        userName: '用户名',
        id: 0,
        commentContent : '内容',
        avatar: "/logo_picture.jpg", //用户头像
        uploadTime: 2024-1-10,
        sonComments: [
          {
            commentId : 0,
            userName: '用户名',
            id: 0,
            commentContent : '内容',
            avatar: "/logo_picture.jpg", //用户头像
            uploadTime: 2024-1-10,
          }
        ],
      },
      { commentId : 0,
        userName: '用户名',
        id: 0,
        commentContent : '内容',
        avatar: "/logo_picture.jpg", //用户头像
        uploadTime: 2024-1-10,
        sonComments: [
          {
            commentId : 0,
            userName: '用户名',
            id: 0,
            commentContent : '内容',
            avatar: "/logo_picture.jpg", //用户头像
            uploadTime: 2024-1-10,
          }
        ],
      },
    ],

)

const getCommentList = async () => {
   const response = await getComments(comic.value.comicId);
  commentList.value =response.data;
  console.info("评论列表",commentList.value)
}
//将该漫画加入历史记录中
const addComicReadHistory = () => {
  const comicId = decrypt(route.query.v);
  console.log(comicId)
  addTheComicReadHistory(comicId);
}

// 页面挂载时加载漫画数据
onMounted(  async () => {
  await getTheComic()
  userData.value = await getUserDatas();
  avatar.value =userData.value.avatar;
  await getCommentList();
  addComicReadHistory()
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
  shareLink.value = `${window.location.origin}/comic/${slug}?v=${v}`;
  console.info(shareLink.value);
  navigator.clipboard.writeText(shareLink.value);
  ElMessage.success({
    message: '分享链接已复制到剪贴板',
    duration: 2000
  });
}
const collectComic = async()=>{
  const comicId = decrypt(route.query.v);
  const res =await collectTheComic(comicId);
  if(res.code === 1) {
    ElMessage.success({
      message: '收藏成功!',
      duration: 2000
    });
    comic.value.isCollection=true;
  }
}
const cancelCollectComic = async()=>{
  const comicId = decrypt(route.query.v);
  const res = await cancelTheCollectComic(comicId);
  if(res.code === 1) {
    ElMessage.success({
      message: '取消收藏!',
      duration: 2000
    });
    comic.value.isCollection=false;
  }
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
.commentCard{
  display: flex;
  flex-direction: row;
}
.comment_userInformation{
  display: flex;
  flex-direction: row;
}


.sonComment_userInformation{
  display: flex;
  flex-direction: row;
}

.comicComment_userInformation{
  display: flex;
  flex-direction: row;
}
.comment_function_list{
  display: flex;
  flex-direction: row;
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
</style>
