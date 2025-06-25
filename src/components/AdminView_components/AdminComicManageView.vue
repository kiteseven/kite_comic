<script setup>
import{ ref,onMounted} from 'vue'
import {adminDeleteComics, adminGetComics, exportComicsToTheExcel} from "@/api/adminApi.js";
import { saveAs } from 'file-saver'
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";

const comics = ref([]);
const totalComics = ref(0);
const currentPage = ref(1);
const pageSize = ref(4);
const searchKeyword = ref("");

const getAllComics =async () => {
  try {
    const response = await adminGetComics(currentPage.value, pageSize.value);
    comics.value = response.data.records; // 例如，后端返回的数据包含一个名为 comics 的数组
    totalComics.value = response.data.total; // 例如，后端返回的数据包含一个名为 total 的总数
    console.log(comics);
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

const exportComicsToExcel = async () => {
  try {
    const response = await exportComicsToTheExcel();
    console.info(response);
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, '漫画数据.xlsx');
  } catch (error) {
    console.error('导出失败', error);
  }
};

const uploadHeaders = ref({ Authorization: localStorage.getItem('token')});

const handleSuccess = () => {
  ElMessage.success("导入成功！");
};
const previewDialogVisible = ref(false);
const thePreviewCoverImage = ref();
const previewCoverImage = (comic) => {
  previewDialogVisible.value = true;
  thePreviewCoverImage.value = comic.coverImage;
}

const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const deleteSelectedComics = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择要删除的漫画');
    return;
  }

  ElMessageBox.confirm('确定删除选中的漫画吗？', '批量删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const ids = multipleSelection.value.map((item) => item.comicId);
    await adminDeleteComics(ids); // 后端批量删除接口
    ElMessage.success('批量删除成功');
    await getAllComics(); // 重新获取数据
  });
};

</script>

<template>

  <!-- 漫画管理卡片 -->
  <el-card class="adminComic-section">
    <div class="adminComic-toolbar">
      <!-- 章节状态筛选按钮 -->
      <el-radio-group >
        <el-radio-button label="全部" />
        <el-radio-button label="已上线" />
        <el-radio-button label="待审核" />
      </el-radio-group>

      <!-- 搜索框 -->
      <el-input
          v-model="searchKeyword"
          placeholder="搜索漫画"
          clearable
          suffix-icon="el-icon-search"
          class="adminComic-search"
      />
      <div class="adminComic-toolbar-button">
        <el-button type="success" @click="exportComicsToExcel">导出 Excel</el-button>
        <el-upload
            action="/api/admin/import"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleSuccess"
            accept=".xlsx"
        >
          <el-button type="primary">导入 Excel</el-button>
        </el-upload>
      </div>
    </div>

    <!-- 章节表格 -->
    <el-table :data="comics"
              style="
              width: 100%"
              border
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"  />
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="漫画封面" width="120">
        <template #default="scope">
          <el-image :src="scope.row.coverImage" fit="cover" style="width: 80px; height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="comicTitle" label="漫画名" />
      <el-table-column prop="genre" label="漫画类型">
        <template #default="scope">
          {{ scope.row.genre }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核状态">
        <template #default="scope">
          {{ scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="text" size="small" @click="previewCoverImage(scope.row)">预览封面</el-button>
          <el-button type="primary" size="small" @click="Manage(comic)">管理漫画</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
      <el-pagination
          layout="prev, pager, next, jumper"
          :total="totalComics"
          :page-size="pageSize"
          @current-change="handlePageChange"
      />
      <el-button type="danger" size="small" @click="deleteSelectedComics">删除</el-button>
    </div>

  </el-card>

  <el-dialog
      v-model="previewDialogVisible"
      title="封面预览"
      width="60%"
  >
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <el-image
          :src="thePreviewCoverImage"
          fit="contain"
          style="width: auto; max-width: 600px;"
          lazy
      />
    </div>
  </el-dialog>

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
.adminComic-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.adminComic-search{
  width: 240px;
}
.adminComic-toolbar-button{
  display: flex;

}
</style>