
import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from "../components/HomePage_components/HomePageView.vue";
import MainWrap from "../components/HomePage_components/MainWrap.vue";
import ComicView from "../components/ComicView_components/ComicView.vue";
import ComicReaderView from "../components/ComicView_components/ComicReaderView.vue";
import ShareRedirect from "../components/ShareRedirect.vue";
import PersonalPageView from "@/components/PersonalView_components/PersonalPageView.vue";
import PersonalComicUploadView from "@/components/PersonalView_components/PersonalComicUploadView.vue";
import PersonalSetting from "@/components/PersonalView_components/PersonalSetting.vue";
import PersonalComicCreateView from "@/components/PersonalView_components/PersonalComicCreateView.vue";
import CategoryView from "@/components/HomePage_components/CategoryView.vue";
import PersonalComicManageView from "@/components/PersonalView_components/PersonalComicManageView.vue";
import adminView from "@/components/AdminView_components/AdminView.vue";
import AdminHomePreviewView from "@/components/AdminView_components/AdminHomePreviewView.vue";
import AdminComicManageView from "@/components/AdminView_components/AdminComicManageView.vue";
import SearchView from "@/components/HomePage_components/SearchView.vue";
import ComicManageView from "@/components/ComicView_components/ComicManageView.vue";
import ComicUploadChapterView from "@/components/ComicView_components/ComicUploadChapterView.vue";


const routes =[
    {
        path: '/',
        component: HomePageView,
        children:[
            {
                path: '',
                component: MainWrap,
            },
            {
                path: '/category',
                component: CategoryView
            },
            {
                path: '/search',
                name: 'search',
                component: SearchView,
                props: route => ({
                    query: route.query,
                })
            },
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
        path: '/comic/:slug/:comicId?/comicManage',
        name: 'ComicManage',
        component: ComicManageView,
        props: route => ({
            slug: route.params.slug,
            comicId: route.query.v
        }),
    },
    {
        path: "/personal",
        name: 'personalView',
        component: PersonalPageView,
        children: [
            {
                path: 'uploadComic',
                name: 'uploadComic',
                component: PersonalComicUploadView
            },
            {
                path: 'personalSettings',
                name: PersonalSetting,
                component: PersonalSetting
            },
            {
                path: "createComic",
                name: 'createComic',
                component: PersonalComicCreateView
            },
            {
                path: "manageComic",
                name: 'manageComic',
                component: PersonalComicManageView
            }
        ]

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
    },
    {
        name: 'admin',
        path: '/admin',
        component: adminView,
        children: [
            {
                path: '',
                component: AdminHomePreviewView,
            },
            {
                path: 'manageComic',
                component: AdminComicManageView
            },
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router