import { createRouter, createWebHistory } from 'vue-router';
// import { nextTick } from 'vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue'),
        meta: {
            title: '主页'
        }
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('../views/search.vue'),
        meta: {
            title: '搜索'
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.afterEach((to) => {
    if (to.name === 'home') {
        document.title = "浪漫庄园物价网";
    }
});

export default router;
