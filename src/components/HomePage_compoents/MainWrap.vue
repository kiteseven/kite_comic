<template>
  <div class="mainWrap">
    <!---第一层页面，包含走马灯和点击排行榜-->
    <div class="mainWrap_banner">
      <!----走马灯页面-->
      <div class="mainWrap_banner_carousel_wrap">
        <el-carousel indicator-position="outside" class="mainWrap_banner_carousel" height="833px">
          <el-carousel-item v-for="item in carouselComics" :key="item.comicTitle">
            <div @click="goToComicDetail(item)" class="carousel_comic">
              <img :src="item.coverImage" alt="封面" class="carousel_cover">
              <div class="carousel_info">
                <h3>{{ item.comicTitle }}</h3>
                <p>作者: {{ item.authorName }}</p>
                <p>更新至: {{ item.leastChapter }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!---点击排行榜，第一个展示封面-->
      <div class="mainWrap_banner_rank">
        <div class="rank_tabs_wrap">
          <h2>点击排行</h2>
          <ul class="rank_tabs tabs">
            <li>
              <a href="#" :class="{ active: currentTab === 'week' }" @click.prevent="currentTab = 'week'">周</a>
            </li>
            <li>
              <a href="#" :class="{ active: currentTab === 'month' }" @click.prevent="currentTab = 'month'">月</a>
            </li>
          </ul>
        </div>

        <div class="rank_content">
          <ul v-if="currentTab==='week'">
            <li v-for="(item, index) in weekRanking" :key="index" class="rank_item">
              <span class="rank_index">{{ index + 1 }}</span>
              <div class="rank_info">
                <!-- 条件渲染第一名显示更多内容 -->
                <template v-if="index === 0">
                  <div class="rank_info_display">
                    <div>
                      <p class="rank_title" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                      <p class="rank_author">作者: {{ item.authorName }}</p>
                      <p class="rank_update">更新至: {{ item.leastChapter }}</p>
                    </div>
                    <div>
                      <img :src="item.coverImage" alt="封面" class="rank_cover">
                    </div>
                  </div>


                </template>
                <template v-else>
                  <div class="rank_info_inline">
                    <p class="rank_title" @click="goToComicDetail(item)" >{{ item.comicTitle }}</p>
                    <p class="rank_update">更新至: {{ item.leastChapter }}</p>
                  </div>
                </template>
              </div>
            </li>
          </ul>

          <ul v-if="currentTab === 'month'">
            <li v-for="(item, index) in monthRanking" :key="index" class="rank_item">
              <span class="rank_index">{{ index + 1 }}</span>
              <div class="rank_info">
                <template v-if="index === 0">

                  <div class="rank_info_display">
                    <div>
                      <p class="rank_title" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                      <p class="rank_author">作者: {{ item.authorName }}</p>
                      <p class="rank_update">更新至: {{ item.leastChapter }}</p>
                    </div>
                    <div>
                      <img :src="item.coverImage" alt="封面" class="rank_cover">
                    </div>
                  </div>

                </template>
                <template v-else>
                  <div class="rank_info_inline">
                    <p class="rank_title" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                    <p class="rank_update">更新至: {{ item.leastChapter }}</p>
                  </div>
                </template>
              </div>
            </li>
          </ul>

        </div>

      </div>
    </div>

    <!---每日更新页面-->
    <div class="mainWrap_DailyUpdate">
      <div class="mainWrap_DailyUpdate_wrap">
        <div class="mainWrap_DailyUpdate_wrap_menu">
          <h2>最新更新</h2>
          <p>UPDATE</p>
        </div>
      </div>
      <div class="mainWrap_DailyUpdate_wrap_content">
        <li v-for="(item, index) in dailyUpdate" :key="index" class="update_item">
          <div class="update_info_display">
            <div>
              <img :src="item.coverImage" alt="封面" class="update_cover">
            </div>
            <div>
              <p class="update_title" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
              <p class="update_author">作者: {{ item.authorName }}</p>
              <p class="update_update">更新至: {{ item.leastChapter }}</p>
            </div>

          </div>
        </li>
      </div>
    </div>

    <!---每日推荐页面-->
    <div class="mainWrap_Recommend">
      <div class="mainWrap_Recommend_wrap">
        <div class="mainWrap_Recommend_wrap_menu">
          <h2>精品推荐</h2>
          <p>RECOMMEND</p>
        </div>
      </div>
      <div class="mainWrap_Recommend_wrap_content">
        <li v-for="(item, index) in Recommend" :key="index" class="recommend_item">
          <div class="recommend_info_display">
            <div>
              <img :src="item.coverImage" alt="封面" class="recommend_cover">
            </div>
            <div>
              <p class="recommend_title" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
              <p class="recommend_author">作者: {{ item.authorName }}</p>
              <p class="recommend_update">更新至: {{ item.leastChapter }}</p>
            </div>

          </div>
        </li>
      </div>
    </div>
    <!---少年漫-->
    <div class="mainWrap_BoysComic">
      <div class="mainWrap_BoysComic_wrap">
        <div class="mainWrap_BoysComic_wrap_menu">
          <h2>少年漫</h2>
          <p>BOYS_COMIC</p>
        </div>
      </div>
      <div class="mainWrap_BoysComic_content">
        <div class="mainWrap_BoysComic_content_first">

          <ul>
            <li v-for="item in firstBoysRanking" :key="item.title" class="boys_item_first">
              <img :src="item.coverImage" alt="封面" class="boys_cover_first">
              <div class="boys_info_first">
                <p class="boys_title_first" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="boys_author_first">作者: {{ item.authorName }}</p>
                <p class="boys_update_first">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </ul>


        </div>
        <div class="main_BoysComic_content_other">

          <div class="main_BoysComic_content_other_top">
            <li v-for="item in otherBoysRanking_top" :key="item.title" class="boys_item_other_top">
              <div class="boys_info_other">
                <img :src="item.coverImage" alt="封面" class="boys_cover_other">
                <p class="boys_title_other" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="boys_author_other">作者: {{ item.authorName }}</p>
                <p class="boys_update_other">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </div>
          <div class="main_BoysComic_content_other_lower">
            <li v-for="item in otherBoysRanking_lower" :key="item.title" class="boys_item_other_top">
              <div class="boys_info_other">
                <img :src="item.coverImage" alt="封面" class="boys_cover_other">
                <p class="boys_title_other" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="boys_author_other">作者: {{ item.authorName }}</p>
                <p class="boys_update_other">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </div>
        </div>
      </div>


    </div>
    <!---少女漫-->
    <div class="mainWrap_GirlsComic">

      <div class="mainWrap_GirlsComic_wrap">
        <div class="mainWrap_GirlsComic_wrap_menu">
          <h2>少女漫</h2>
          <p>GIRLS_COMIC</p>
        </div>
      </div>
      <div class="mainWrap_GirlsComic_content">
        <div class="mainWrap_GirlsComic_content_first">

          <ul>
            <li v-for="item in firstGirlsRanking" :key="item.title" class="girls_item_first">
              <img :src="item.coverImage" alt="封面" class="girls_cover_first">
              <div class="girls_info_first">
                <p class="girls_title_first" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="girls_author_first">作者: {{ item.author }}</p>
                <p class="girls_update_first">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </ul>


        </div>

        <div class="main_GirlsComic_content_other">

          <div class="main_GirlsComic_content_other_top">
            <li v-for="item in otherGirlsRanking_top" :key="item.title" class="girls_item_other_top">
              <div class="girls_info_other">
                <img :src="item.coverImage" alt="封面" class="girls_cover_other">
                <p class="girls_title_other" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="girls_author_other">作者: {{ item.author }}</p>
                <p class="girls_update_other">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </div>
          <div class="main_GirlsComic_content_other_lower">
            <li v-for="item in otherGirlsRanking_lower" :key="item.title" class="girls_item_other_top">
              <div class="girls_info_other">
                <img :src="item.coverImage" alt="封面" class="girls_cover_other">
                <p class="girls_title_other" @click="goToComicDetail(item)">{{ item.comicTitle }}</p>
                <p class="girls_author_other">作者: {{ item.author }}</p>
                <p class="girls_update_other">更新至: {{ item.leastChapter }}</p>
              </div>
            </li>
          </div>
        </div>

      </div>

    </div>

    <!--简单分类展示页面-->
    <div class="category_show_wrap">

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted,computed} from 'vue';
import CryptoJS from 'crypto-js'
import { useRouter } from 'vue-router';
import{
  getShowComic,
} from '@/api/comicAPi'
import {
  encipher
} from '@/util/encryptedUtils'

import axios from 'axios';

const currentTab = ref('week');
const router = useRouter();
onMounted( () => {
   getComicToShow();
});
//获取首页展示漫画数据
const getComicToShow = async () =>{
  const response = await getShowComic();
  console.log(response.data)
  dailyUpdate.value=response.data.dailyUpdateComic;
  weekRanking.value=response.data.weekRankingComic;
  monthRanking.value=response.data.monthRankingComic;
  Recommend.value=response.data.recommendComic;
  boysRanking.value=response.data.boysRankingComic;
  girlsRanking.value=response.data.girlsRankingComic;
  carouselComics.value=response.data.carouselComics;
}
const goToComicDetail = (comic) => {
  console.info(comic)
  console.info(comic.slug)
  console.info(comic.comicId)

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
};
const carouselComics = ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: '/88a52215cd47768934ca069075faedbf614323946.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: '/025fd6d629dffa1b3ae8379ce4ad547c614323946.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: '/55270534b0750e36a92805ab1dc054cc614323946.png' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: '9f9f641b5b4ebfd2523abd8580073b3a614323946.jpg'  ,slug:"AAA"},
]);
const weekRanking = ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'BBB', authorName: 'B', update: 'BB' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC' ,slug:"AAA"}
  // 更多周排行内容...
])

const monthRanking = ref([
  { comicId: 1 ,comicTitle: 'DDD', authorName: 'D', update: 'DD' ,coverImage: 'https://via.placeholder.com/100' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'EEE', authorName: 'E', update: 'EE' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF' ,slug:"AAA"},
  // 更多月排行内容...
]);
const dailyUpdate = ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"}
]);
const Recommend =ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA' ,coverImage: 'public/1725076483407.jpg' ,slug:"AAA"}
]);
const boysRanking = ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'BBB', authorName: 'B', update: 'BB', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'DDD', authorName: 'D', update: 'DD', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'EEE', authorName: 'E', update: 'EE', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'GGG', authorName: 'G', update: 'GG', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'HHH', authorName: 'H', update: 'HH', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'III', authorName: 'I', update: 'II', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"}
]);

const girlsRanking = ref([
  { comicId: 1 ,comicTitle: 'AAA', authorName: 'A', update: 'AA', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'BBB', authorName: 'B', update: 'BB', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'CCC', authorName: 'C', update: 'CC', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'DDD', authorName: 'D', update: 'DD', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'EEE', authorName: 'E', update: 'EE', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'FFF', authorName: 'F', update: 'FF', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'GGG', authorName: 'G', update: 'GG', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'HHH', authorName: 'H', update: 'HH', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"},
  { comicId: 1 ,comicTitle: 'III', authorName: 'I', update: 'II', coverImage: 'public/1725076483407.jpg', url: '#' ,slug:"AAA"}
])
const firstBoysRanking = computed(() => boysRanking.value.slice(0, 1)); // 第一名
const otherBoysRanking_top = computed(() => boysRanking.value.slice(1,5));    // 2到4
const otherBoysRanking_lower = computed(() => boysRanking.value.slice(5,9));    // 5到8

const firstGirlsRanking = computed(() => girlsRanking.value.slice(0, 1)); // 第一名
const otherGirlsRanking_top = computed(() => girlsRanking.value.slice(1,5));    // 2到4
const otherGirlsRanking_lower = computed(() => girlsRanking.value.slice(5,9));    // 5到8
</script>

<style scoped>
a{cursor: pointer; /* 鼠标悬停时显示为手型 */}

.mainWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 让走马灯居中 */
  align-items: center;
  margin: 1px 5px; /* 添加上下边距 */

}
.mainWrap_banner{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 500px;
  justify-content: space-between;
}
.mainWrap_banner_rank{
  width: 30%; /* 给排行榜设置剩余的 30% 宽度 */
  padding-left: 20px; /* 为排行榜和走马灯之间添加空隙 */
  display: flex;
  max-height: 500px;
  flex-direction: column;
  overflow-y: auto; /* 当内容超过高度时，允许垂直滚动 */
}
.mainWrap_banner_carousel_wrap{
  width: 70%; /* 确保走马灯占满父容器的宽度 */
  height: 100%; /* 设置走马灯高度 */
}
.mainWrap_banner_carousel {
  width: 100%; /* 确保走马灯占满父容器的宽度 */
  height: 500px; /* 设置走马灯高度 */
}

.carousel_comic {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.carousel_cover {
  align-self: center;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例并填充容器 */
  object-position: center; /* 图片居中显示 */
  transition: transform 0.3s; /* 添加悬停动画 */
}
.carousel_info {
  display: flex;
  flex-direction: column;
}
.carousel_info h3 {
  font-size: 40px;
  margin: 0;
}
.carousel_info p {
  font-size: 27px;
  color: #888;
}

.rank_tabs_wrap{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  list-style: none;
  padding: 0;
}
.rank_tabs_wrap h2 {
  font-size: 40px;
  margin-bottom: 10px;
}
.rank_tabs{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none; /* 去掉列表项的点 */
  margin: 20px 10px; /* 添加上下 左右边距 */
}
.rank_tabs li {
  margin-right: 15px;
  cursor: pointer;
}
.rank_tabs a {
  text-decoration: none;
  padding: 5px 10px;
  color: #333;
  border-radius: 5px;
}

.rank_tabs a:hover {
  background-color: #f0f0f0;
}

.rank_tabs a.active {
  background-color: #2196f3;
  color: white;
}
.rank_content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.rank_item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.rank_index {
  font-weight: bold;
  font-size: 30px;
  margin-right: 10px;
  color: #ff5722;
}

.rank_info {
  display: flex;
  flex-direction: column;
}

.rank_info_inline {
  display: flex;
  justify-content: space-between;
  font-size: 20px; /* 缩小字体 */
}

.rank_title {
  font-weight: bold;
  font-size: 25px;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}

.rank_author, .rank_update {
  padding-left: 8px;
  font-size: 20px;
  color: #888;
}
.rank_cover{
  max-width: 166px;
  max-height:166px;
}
.rank_info_display{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mainWrap_DailyUpdate{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
}

.mainWrap_DailyUpdate_wrap_menu{
  display: flex;
  flex-direction: row;
}
.mainWrap_DailyUpdate_wrap_menu h2{
  font-size: 40px;
  margin-bottom: 17px;
  padding-left: 0px;
}
.mainWrap_DailyUpdate_wrap_menu p{
  font-size: 33px;
  margin-bottom: 17px;
  padding-left: 17px;
  padding-top: 8px;
}
.mainWrap_DailyUpdate_wrap_content{
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: row;
  list-style-type: none; /* 去掉列表项的点 */
}
.update_title{
  font-size: 23px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.update_author, .update_update {
  padding-left: 8px;
  font-size: 17px;
  color: #888;
}
.update_item{
  padding: 15px;
}
.update_cover{
  max-width: 333px;
  max-height: 250px;
}

.mainWrap_Recommend{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
}
.mainWrap_Recommend_wrap_menu{
  display: flex;
  flex-direction: row;
}
.mainWrap_Recommend_wrap_menu h2{
  font-size: 40px;
  margin-bottom: 17px;
  padding-left: 0px;
}
.mainWrap_Recommend_wrap_menu p{
  font-size: 33px;
  margin-bottom: 17px;
  padding-left: 17px;
  padding-top: 8px;
}
.mainWrap_Recommend_wrap_content{
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: row;
  list-style-type: none; /* 去掉列表项的点 */
}
.recommend_item{
  padding: 15px;
}
.recommend_title{
  font-size: 23px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.recommend_update{
  padding-left: 8px;
  font-size: 17px;
  color: #888;
}
.recommend_cover{
  max-width: 333px;
  max-height: 250px;
}

.mainWrap_BoysComic {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 1000px;
  margin: 20px 0;
}
.mainWrap_BoysComic_content{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  list-style-type: none; /* 去掉列表项的点 */
}
.mainWrap_BoysComic_content_first{
  width: 26%;
  padding-top:50px;
  list-style-type: none; /* 去掉列表项的点 */
}
.main_BoysComic_content_other{
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 0px;
}
.main_BoysComic_content_other_top{
  display: flex;
  flex-direction: row;
  height: 50%;
  width: 100%;
}
.main_BoysComic_content_other_lower{
  display: flex;
  flex-direction: row;
  height: 50%;
  width: 100%;
}
.mainWrap_BoysComic_wrap_menu{
  display: flex;
  flex-direction: row;
}
.mainWrap_BoysComic_wrap_menu h2{
  font-size: 40px;
  margin-bottom: 17px;
  padding-left: 0px;
}
.mainWrap_BoysComic_wrap_menu p{
  font-size: 33px;
  margin-bottom: 17px;
  padding-left: 17px;
  padding-top: 8px;
}
.boys_item_first{
  list-style-type: none; /* 去掉列表项的点 */
}
.boys_cover_first{
  max-width: 333px;
  max-height: 500px;
  width: auto;
  height: auto;
}
.boys_title_first{
  font-size: 42px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.boys_author_first,.boys_update_first{
  padding-left: 5px;
  font-size: 33px;
  color: #888;
}
.boys_info_other{
  width: 200px;
  height: 300px;
}
.boys_cover_other{
  width: 200px;
  height: 250px;
}
.boys_title_other{
  font-size: 23px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.boys_author_other,.boys_update_other{
  padding-left: 5px;
  font-size: 17px;
  color: #888;
}


.mainWrap_GirlsComic{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 1000px;
  margin: 20px 0;
}
.mainWrap_GirlsComic_wrap_menu{
  display: flex;
  flex-direction: row;
}
.mainWrap_GirlsComic_wrap_menu h2{
  font-size: 40px;
  margin-bottom: 17px;
  padding-left: 0px;
}
.mainWrap_GirlsComic_wrap_menu p{
  font-size: 33px;
  margin-bottom: 17px;
  padding-left: 17px;
  padding-top: 8px;
}
.mainWrap_GirlsComic_content{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  list-style-type: none; /* 去掉列表项的点 */
}
.mainWrap_GirlsComic_content_first{
  width: 26%;
  padding-top: 50px;
}
.main_GirlsComic_content_other{
  display: flex;
  flex-direction: column;
  width: 70%;
}
.main_GirlsComic_content_other_top{
  display: flex;
  flex-direction: row;
  height: 50%;
  width: 100%;
}
.main_GirlsComic_content_other_lower{
  display: flex;
  flex-direction: row;
  height: 50%;
  width: 100%;
}
.girls_item_first{
  list-style-type: none; /* 去掉列表项的点 */
}
.girls_cover_first{
  max-width: 333px;
  max-height: 500px;
  width: auto;
  height: auto;
}
.girls_title_first{
  font-size: 42px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
}
.girls_author_first,.girls_update_first{
  padding-left: 8px;
  font-size: 33px;
  color: #888;
}
.girls_info_other{
  width: 200px;
  height: 300px;
}
.girls_cover_other{
  width: 200px;
  height: 250px;
}
.girls_title_other{
  font-size: 23px;
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  display: -webkit-box; /* 使用 Flexbox 来限制行数 */
  -webkit-line-clamp: 2; /* 限制最多显示两行 */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  line-clamp: 2; /* 标准属性 */
}
.girls_author_other,.girls_update_other{
  padding-left: 8px;
  font-size: 17px;
  color: #888;
}


.category_show_wrap{
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.rank_title,
.update_title{
  font-weight: bold;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  display: -webkit-box; /* 使用 Flexbox 来限制行数 */
  -webkit-line-clamp: 2; /* 限制最多显示两行 */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  line-clamp: 2; /* 标准属性 */
}

.recommend_title,
.boys_title_first,
.boys_title_other,
.girls_title_first,
.girls_title_other {
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  display: -webkit-box; /* 使用 Flexbox 来限制行数 */
  -webkit-line-clamp: 2; /* 限制最多显示两行 */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  line-clamp: 2; /* 标准属性 */
  word-break: break-all; /* 新增：允许在任何字符间断行 */
  line-height: 1.2em;    /* 新增：确保行高合适 */
  max-height: 2.4em;     /* 新增：基于行高的两倍高度限制 */
}

.recommend_author,
.boys_author_other,
.girls_author_other {
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

</style>