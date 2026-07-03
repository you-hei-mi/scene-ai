import { defineRouteOption } from "@buildingai/web-core";
import { lazy, Suspense, type LazyExoticComponent, type ComponentType } from "react";

import packageJson from "./../../package.json";
import BlogIndexPage from "./pages/index";

const ArticleDetailPage = lazy(() => import("./pages/article/[id]"));
const ArticleAddPage = lazy(() => import("./pages/console/article/add"));
const ArticleEditPage = lazy(() => import("./pages/console/article/edit"));
const ArticleListPage = lazy(() => import("./pages/console/article/list"));
const ColumnListPage = lazy(() => import("./pages/console/column/list"));

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
        {
            index: true,
            element: <BlogIndexPage />,
        },
        {
            path: "article/:id",
            element: lazyRouteElement(ArticleDetailPage),
        },
    ],
    consoleMenus: [
        {
            title: "文章管理",
            path: "/",
            icon: "file-text",
        },
        {
            title: "栏目管理",
            path: "/column/list",
            icon: "columns-3",
        },
    ],
    consoleRoutes: [
        {
            index: true,
            element: lazyRouteElement(ArticleListPage),
        },
        {
            path: "article/add",
            element: lazyRouteElement(ArticleAddPage),
        },
        {
            path: "article/edit",
            element: lazyRouteElement(ArticleEditPage),
        },
        {
            path: "column/list",
            element: lazyRouteElement(ColumnListPage),
        },
    ],
});
