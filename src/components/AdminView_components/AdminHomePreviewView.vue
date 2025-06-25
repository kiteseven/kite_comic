<script setup>
import {onMounted, reactive, ref} from "vue";
import {getStats} from "@/api/adminApi.js";
import {ChatSquare, Memo, Reading, User} from "@element-plus/icons-vue";
import * as echarts from 'echarts';

const chartRef = ref(null);  // 绑定图表 DOM 元素

const stats =reactive({
  comicNumber: 0,
  commentNumber:0,
  userNumber:0,
})
const getTheStats =async () => {
  const response = await getStats();
   stats.comicNumber =response.data.comicNumber
   stats.commentNumber =response.data.commentNumber
   stats.userNumber =response.data.userNumber
   renderChart(); // 数据加载完后绘制图表
}
const renderChart = () => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);

  chart.setOption({
    title: {
      text: 'KiteComic 数据概览',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['漫画数', '评论数', '用户数']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: [
          stats.comicNumber,
          stats.commentNumber,
          stats.userNumber
        ],
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  });
}

onMounted(() => {
  getTheStats()
})
</script>

<template>
  <div>
    <el-card class="AdminHomePreviewViewClass">
      <template #header>
        <div class="card-header">
          <span>KiteComic后台</span>
        </div>
      </template>

      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.comicNumber }}</div>
          <div class="stat-label">漫画总数</div>
          <el-icon><Reading /></el-icon>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.commentNumber }}</div>
          <div class="stat-label">评论数量</div>
          <el-icon><ChatSquare /></el-icon>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.userNumber }}</div>
          <div class="stat-label">用户数量</div>
          <el-icon><User /></el-icon>
        </div>
      </div>

      <!-- ECharts 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<style scoped>
.AdminHomePreviewViewClass {
  width: 100%;
  height: 100%;
}

.stat-grid {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  width: 450px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.chart-container {
  width: 100%;
  height: 400px;
}
</style>