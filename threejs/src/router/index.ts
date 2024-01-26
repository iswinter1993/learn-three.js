import { createRouter,createWebHistory, RouteRecordRaw } from "vue-router";
const routes = [
    {
        path: '/',
        name: 'Index',
        meta: {
        title: '首页',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/index.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;