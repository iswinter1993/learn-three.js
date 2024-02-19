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
    {
        path: '/second',
        name: 'second',
        meta: {
        title: 'second',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/second.vue')
    },
    {
        path: '/load3dAnimateModel',
        name: 'load3dAnimateModel',
        meta: {
        title: 'load 3d Animation Model',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/load3dAnimateModel.vue')
    },
    {
        path: '/shader',
        name: 'shader',
        meta: {
        title: 'shader',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/shader.vue')
    },
    {
        path: '/cannon',
        name: 'cannon',
        meta: {
        title: 'cannon',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/cannon-demo.vue')
    },
    {
        path: '/threeclick',
        name: 'threeclick',
        meta: {
        title: 'threeclick',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/threejs-click.vue')
    },
    {
        path: '/3jscannonjsclick',
        name: '3jscannonjsclick',
        meta: {
        title: '3js-cannonjs-click',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/3js-cannonjs-click.vue')
    },
    {
        path: '/SubdivideAPlane',
        name: 'Subdivide A Plane Into Even Squares',
        meta: {
        title: 'Subdivide A Plane Into Even Squares',
        keepAlive: false,
        requireAuth: true
        },
        component: () => import('@/pages/subdividePlane.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;