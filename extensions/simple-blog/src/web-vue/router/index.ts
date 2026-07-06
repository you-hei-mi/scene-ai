/**
 * Vue Router 配置
 * @description 定义前台和后台路由
 */

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "BlogIndex",
            component: () => import("../pages/index.vue"),
        },
        {
            path: "/article/:id",
            name: "ArticleDetail",
            component: () => import("../pages/article/[id].vue"),
        },
        {
            path: "/console",
            redirect: "/console/article/list",
        },
        {
            path: "/console/article/list",
            name: "ConsoleArticleList",
            component: () => import("../pages/console/article/list.vue"),
        },
        {
            path: "/console/article/add",
            name: "ConsoleArticleAdd",
            component: () => import("../pages/console/article/add.vue"),
        },
        {
            path: "/console/article/edit",
            name: "ConsoleArticleEdit",
            component: () => import("../pages/console/article/edit.vue"),
        },
        {
            path: "/console/column/list",
            name: "ConsoleColumnList",
            component: () => import("../pages/console/column/list.vue"),
        },
    ],
});

export default router;
