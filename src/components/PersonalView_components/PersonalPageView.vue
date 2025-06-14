<template>
  <div class="common-layout">
    <el-container class="Personal_container">
      <el-main class="Personal_main">
        <el-card>
          <div class="PersonalInformation">
            <el-avatar :size="200" :src="userAvatar"></el-avatar>
            <div class="PersonalInformationDatil">
              <span class="label">亲爱的 </span>
              <span class="value">{{  userData?.userName || '未知' }}</span>
            </div>
          </div>
        </el-card>
      <personal-main-warp></personal-main-warp>
      </el-main>
      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PersonalMainWarp from "@/components/PersonalView_components/PersonalMainWarp.vue";

const userData = ref();
import {getUserDatas} from "@/util/userDataUtil";


const userAvatar =ref();

onMounted(async ()=>{
  userData.value = await getUserDatas();
  console.info(userData.value);
  userAvatar.value=userData.value.avatar
})

</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
}
.Personal_container {
  height: 100%;
  width: 100%;
}
.Personal_main {

}
.PersonalInformation{
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100%;
}
.PersonalInformationDatil{

}
</style>