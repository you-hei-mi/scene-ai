import { createRouter, createWebHistory } from "vue-router";

import packageJson from "../../../package.json";
import HomePage from "../pages/home.vue";

const router = createRouter({
    history: createWebHistory(`/extension/${packageJson.name}`),
    routes: [
        { path: "/", name: "home", component: HomePage },
        {
            path: "/canvas-list",
            name: "canvas-list",
            component: () => import("../pages/canvas-list.vue"),
        },
        {
            path: "/canvas/:id",
            name: "canvas",
            component: () => import("../pages/canvas-page.vue"),
        },
        {
            path: "/smart-canvas/:id",
            name: "smart-canvas",
            component: () => import("../pages/canvas-page.vue"),
        },
        {
            path: "/asset-manager",
            name: "asset-manager",
            component: () => import("../pages/asset-manager.vue"),
        },
        {
            path: "/prompt-library",
            name: "prompt-library",
            component: () => import("../pages/prompt-library.vue"),
        },
        {
            path: "/api-settings",
            name: "api-settings",
            component: () => import("../pages/api-settings.vue"),
        },
        {
            path: "/comfyui-settings",
            name: "comfyui-settings",
            component: () => import("../pages/comfyui-settings.vue"),
        },
        {
            path: "/workflows",
            name: "workflows",
            component: () => import("../pages/workflows.vue"),
        },
        {
            path: "/tasks",
            name: "tasks",
            component: () => import("../pages/tasks.vue"),
        },
        {
            path: "/console",
            name: "console",
            component: () => import("../pages/console/overview.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("../pages/home.vue"),
        },
    ],
});

// 与父框架同步导航状态
let isParentNavigating = false;

router.afterEach((to) => {
    if (window.parent === window) return;
    if (isParentNavigating) {
        isParentNavigating = false;
        return;
    }

    window.parent.postMessage(
        {
            type: "extension-navigate",
            path: to.path,
            search: window.location.search,
            hash: window.location.hash,
        },
        "*",
    );
});

window.addEventListener("message", (event) => {
    if (event.data?.type !== "parent-navigate") return;
    if (window.parent === window) return;

    const path = event.data.path ?? "/";
    const search = event.data.search ?? "";
    const hash = event.data.hash ?? "";
    const target = `${path}${search}${hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (target !== current) {
        isParentNavigating = true;
        router.replace(target);
    }
});

export default router;
