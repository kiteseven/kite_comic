
import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from "../components/HomePage_compoents/HomePageView.vue";
import MainWrap from "../components/HomePage_compoents/MainWrap.vue";
import ComicView from "../components/ComicView_compoents/ComicView.vue";
import ComicReaderView from "../components/ComicView_compoents/ComicReaderView.vue";
import ShareRedirect from "../components/ShareRedirect.vue";


const routes =[
    {
        path: '/',
        component: HomePageView,
        children:[
            {
                path: '',
                component: MainWrap,
            }
        ]
    },
    {
        path: '/comic/:slug/:comicId?',
        name: 'ComicView',
        component: ComicView,
        props: route => ({
            slug: route.params.slug,
            comicId: route.query.v
        })
    },
    {
        path: '/comic/:slug/chapters/:chapterNumber',
        name: 'ComicReader',
        component:ComicReaderView,
        props: route => ({
            slug: route.params.slug,
            chapterNumber: route.params.chapterNumber,
            comicId: route.query.v
        })
    },
    {
        name: "refresh",
        path: `/refresh`,
        component : import('../components/refresh.vue') ,
    },
    {
        path: '/shared',
        name: 'ShareRedirect',
        component: ShareRedirect
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router