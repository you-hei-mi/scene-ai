import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

import packageJson from "./../../package.json";
import { defineRouteOption } from "./lib/route-option";
import HomePage from "./pages/home";

const CanvasListPage = lazy(() => import("./pages/canvas-list"));
const CanvasPage = lazy(() => import("./pages/canvas-page"));
const AssetManagerPage = lazy(() => import("./pages/asset-manager"));
const PromptLibraryPage = lazy(() => import("./pages/prompt-library"));
const ApiSettingsPage = lazy(() => import("./pages/api-settings"));
const ComfyuiSettingsPage = lazy(() => import("./pages/comfyui-settings"));
const WorkflowPage = lazy(() => import("./pages/workflows"));
const TaskPage = lazy(() => import("./pages/tasks"));
const ConsoleOverviewPage = lazy(() => import("./pages/console/overview"));

function lazyRouteElement(Component: LazyExoticComponent<ComponentType>) {
    return (
        <Suspense fallback={null}>
            <Component />
        </Suspense>
    );
}

export const routeOption = defineRouteOption({
    base: `extension/${packageJson.name}`,
    identifier: packageJson.name,
    routes: [
        { index: true, element: <HomePage /> },
        { path: "canvas-list", element: lazyRouteElement(CanvasListPage) },
        { path: "canvas/:id", element: lazyRouteElement(CanvasPage) },
        { path: "smart-canvas/:id", element: lazyRouteElement(CanvasPage) },
        { path: "asset-manager", element: lazyRouteElement(AssetManagerPage) },
        { path: "prompt-library", element: lazyRouteElement(PromptLibraryPage) },
        { path: "api-settings", element: lazyRouteElement(ApiSettingsPage) },
        { path: "comfyui-settings", element: lazyRouteElement(ComfyuiSettingsPage) },
        { path: "workflows", element: lazyRouteElement(WorkflowPage) },
        { path: "tasks", element: lazyRouteElement(TaskPage) },
    ],
    consoleMenus: [
        { title: "总览", path: "/", icon: "layout-dashboard" },
        { title: "画布", path: "/canvas-list", icon: "workflow" },
        { title: "资产", path: "/asset-manager", icon: "image" },
        { title: "提示词", path: "/prompt-library", icon: "message-square" },
        { title: "任务", path: "/tasks", icon: "list-checks" },
    ],
    consoleRoutes: [{ index: true, element: lazyRouteElement(ConsoleOverviewPage) }],
});
