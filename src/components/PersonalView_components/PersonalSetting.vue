<template>
  <div class="account-settings">
    <el-form
        ref="user"
        :model="userData"
        label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input
            v-model="userData.userName"
            :disabled="true"
            size="default"
            style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
         <el-input
             v-model="userData.nickName"
             size="default"
             style="width: 200px;"
         ></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <div class="avatar-upload-container">
          <el-avatar :size="200" :src="avatarUrl"></el-avatar>
          <el-button @click="btnClick" style="margin-top: 10px;">点击上传</el-button>
          只能上傳jpg/png文件，且不超過2MB
          <ImgCorpper
              v-model:dialogVisibleCorpper="dialogVisibleCorpper"
              @confirm="confirm"
          />
        </div>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input
            v-model="userData.signature"
            size="default"
            style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话号">
        <el-input
            v-model="userData.phoneNumber"
            size="default"
            style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
            v-model="userData.email"
            size="default"
            style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="关注数">
      {{userData.following || 0}}
      </el-form-item>
      <el-form-item label="粉丝数">
      {{userData.followers || 0}}
      </el-form-item>
      <el-form-item>
        <el-button @click="saveChangeUserData">保存修改</el-button>
      </el-form-item>
    </el-form>

    <div class="avatar-container" @click="editImage()">
      <el-dialog
          :title="title"
          :model-value="dialogVisibleCorpper"
          width="800px"
          append-to-body
          @opened="openDialog"
          :before-close="beforeClose"
      >
        <el-row>
          <el-col :span="12" style="height: 300px">
            <vue-cropper
                ref="cropper"
                :img="options.img"
                :info="true"
                :autoCrop="options.autoCrop"
                :autoCropWidth="options.autoCropWidth"
                :autoCropHeight="options.autoCropHeight"
                :fixedBox="options.fixedBox"
                :outputType="options.outputType"
                @realTime="realTime"
                v-if="showCropper"
            />
          </el-col>
          <el-col :span="12" style="height: 300px">
            <div class="preview-box">
              <img
                  v-if="previews.url"
                  :src="previews.url"
                  :style="previews.img"
              />
              <span v-else></span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 12px">
          <el-col :span="12">
            <el-row>
              <el-col :span="8">
                <el-upload
                    action="#"
                    :http-request="() => {}"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                >
                  <el-button>选择</el-button>
                </el-upload>
              </el-col>
              <el-col :span="4">
                <el-button :icon="Plus" @click="changeScale(1)"></el-button>
              </el-col>
              <el-col :span="4">
                <el-button :icon="Minus" @click="changeScale(-1)"></el-button>
              </el-col>
              <el-col :span="4">
                <el-button :icon="RefreshLeft" @click="rotateLeft()"></el-button>
              </el-col>
              <el-col :span="4">
                <el-button
                    :icon="RefreshRight"
                    @click="rotateRight()"
                ></el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4" :offset="8" style="margin-left: 22.3%">
            <el-button type="primary" @click="determine()">提 交</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>




  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from 'vue';
import { Plus ,Minus,RefreshLeft,RefreshRight} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
//import 'cropperjs/dist/cropper.css';
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { getCurrentInstance, reactive, watch } from "vue";
import axios from 'axios';
import {getUserDatas} from "@/util/userDataUtil";
import {updateUserData} from "@/api/userApi";
const cropper = ref(null);
const avatarUrl = ref('')
const cropperVisible = ref(false);

const uploadUrl = '/api/upload/avatarImage'; // 后端上传接口的URL

const user =ref()

const userData = ref({
   userName: 'kiteseven',
   nickName: '777',
   account:24035677,
   phoneNumber:13787980131,
   passWord: 12345,
   avatar: "D:\\JavaProject\\kite_comic\\public\\1725076483407.jpg",
   signature:"啦啦啦",//个性签名
   followers:9823,//粉丝数
   following:100000,//关注数
   email: 'sandelija76@gmail.com',
})

const saveChangeUserData = async () =>{
  await updateUserData(userData.value);
}

const { proxy } = getCurrentInstance();

const props = defineProps({
  dialogVisibleCorpper: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "上传图片",
  },
});


const showCropper = ref(false);
const UpdatePersonalInformationDTO=ref(
    {
      id:0,
      nickName:'',
      avatar:'',
      phoneNumber:'',
      signature:'',//个性签名
      followers:0,//粉丝数
      following:0,//关注数
      email: '',
    }
)

onMounted(async ()=>{
  userData.value = await getUserDatas();
  console.info(userData.value);
  avatarUrl.value=userData.value.avatar
})

const options = reactive({
  img: null, // 裁剪图片的地址
  autoCropWidth: 200, // 默认生成截图框宽度 默认容器的 80%
  autoCropHeight: 200, // 默认生成截图框高度 默认容器的 80%
  outputType: "png", // 裁剪生成图片的格式 jpeg, png, webp
  autoCrop: true, // 是否默认生成截图框
  fixedBox: false, // 固定截图框大小
});

const previews = ref({
  url: "",
});

// 打开裁剪弹窗
const openDialog = () => {
  showCropper.value = true;
};
// 修改图片大小 正数为变大 负数变小
const changeScale = (num) => {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
};
// 向左边旋转90度
const rotateLeft = () => {
  proxy.$refs.cropper.rotateLeft();
};
// 向右边旋转90度
const rotateRight = () => {
  proxy.$refs.cropper.rotateRight();
};
// 上传图片处理
const beforeUpload = (rawFile) => {
  if (rawFile.type.indexOf("image/") == -1) {
    ElMessage.error("请上传图片类型文件!");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小不能超过2MB!");
    return false;
  }
  const reader = new FileReader();
  reader.readAsDataURL(rawFile);
  reader.onload = () => {
    // 图片在这里
    options.img = reader.result;
  };
};
// 实时预览事件
const realTime = (data) => {
  previews.value = data;
};
const emit = defineEmits(["update:dialogVisibleCorpper", "confirm"]);

// 关闭弹窗
const beforeClose = () => {
  options.img = null;
  previews.value.url = "";
  emit("update:dialogVisibleCorpper", false);
  dialogVisibleCorpper.value = false;
};

// 提交图片
const determine = async () => {
  const cropperInstance = proxy.$refs.cropper;
  cropperInstance.getCropBlob((blob) => {
    if (blob) {
      // 创建 FormData 对象用于上传
      const formData = new FormData();
      formData.append('file', blob); // 确保字段名为 'file'

      // 使用 axios 发起 POST 请求
      axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(async response => {
            if(response.data.code===1)
            {
              UpdatePersonalInformationDTO.value.id=userData.id;
              UpdatePersonalInformationDTO.value.avatar=response.data.data;
              console.log(UpdatePersonalInformationDTO)
              //const newResponse =await axios.put('/api/user/updatePersonalInformation',UpdatePersonalInformationDTO.value);
              if(newResponse.data.code===1){
                ElMessage.success('上传成功!');
                dialogVisibleCorpper.value = false
              }else{
                console.log('上传失败',newResponse.msg);
                ElMessage.success('上传失败',newResponse.msg);
              }
            }
            else{
              console.log('上传失败',response.msg);
              ElMessage.success('上传失败',response.msg);
            }
          })
    }
  });
};

const dialogVisibleCorpper = ref(false);
// 组件点击事件
const btnClick = () => {
  dialogVisibleCorpper.value = true;
};
// 组件提交事件
const confirm = () => {
  dialogVisibleCorpper.value = false;
};

const editUsername = () => {
  console.log('修改用户名');
};

const editPassword = () => {
  console.log('修改密码');
};

const changePhone = () => {
  console.log('更换手机');
};

const bindEmail = () => {
  console.log('绑定邮箱');
};

// 用于将手机号部分遮蔽显示
const maskedPhone = computed(() => {
  return userData.value.phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
});


</script>

<style scoped>
.account-settings {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-upload-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>

<style lang="scss" scoped>
.avatar-container {
  .img-box {
    border-radius: 50%;
    border: 1px solid #ccc;
    width: 10vw;
    height: 10vw;
  }
}
.preview-box {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>
