<script setup>
import {onMounted, reactive, ref} from "vue";
import {getStats, getTheComicStats} from "@/api/adminApi.js";
import {ChatSquare, Memo, Reading, User} from "@element-plus/icons-vue";
import * as echarts from 'echarts';

const chartRef1 = ref(null);  // 绑定图表 DOM 元素

const chartRef2 = ref(null);  // 绑定图表 DOM 元素

const chartRef3 = ref(null); // 新增这个 ref

const stats =reactive({
  comicNumber: 0,
  commentNumber:0,
  userNumber:0,
})

const comicStats = reactive({
  totalComics:10,
  totalClicks:5,
  ongoingComics:2,
  completedComics:1
})


const getTheStats =async () => {
  const response = await getStats();
   stats.comicNumber =response.data.comicNumber
   stats.commentNumber =response.data.commentNumber
   stats.userNumber =response.data.userNumber
   renderChart1(); // 数据加载完后绘制图表
}

const getComicStats =async () => {
  const response = await getTheComicStats();
  comicStats.totalComics =response.data.totalComics
  comicStats.totalClicks =response.data.totalClicks
  comicStats.ongoingComics =response.data.ongoingComics
  comicStats.completedComics =response.data.completedComics
  console.info(comicStats)
  renderChart2();
  renderChart3();
}

const renderChart1 = () => {
  if (!chartRef1.value) return;
  const chart = echarts.init(chartRef1.value);

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

// 渲染 ECharts 图表
const renderChart2 = () => {
  if (!chartRef2.value) return;
  const chart = echarts.init(chartRef2.value); // 初始化图表

  chart.setOption({
    title: {
      text: '漫画数据统计',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['漫画总数', '总点击量', '连载中', '已完结']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        data: [
          comicStats.totalComics,
          comicStats.totalClicks,
          comicStats.ongoingComics,
          comicStats.completedComics
        ],
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  });
};


const renderChart3 = () => {
  if (!chartRef3.value) return;
  const chart = echarts.init(chartRef3.value);
// ✅ 每次绘制都重新生成 pieData，确保数据最新
  const pieData = [
    { value: comicStats.ongoingComics, name: '连载中' },
    { value: comicStats.completedComics, name: '已完结' }
  ];
  const option = {
    title: {
      text: '漫画状态分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '漫画状态',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  chart.setOption(option);
};
onMounted(() => {
  getTheStats()
  getComicStats()
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

      <!-- ECharts 图表容器1 -->

        <div ref="chartRef1" class="chart-container"></div>
        <!-- ECharts 图表容器2 -->
        <div ref="chartRef2" class="chart-container"></div>
        <div ref="chartRef3" class="chart-container"></div>
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