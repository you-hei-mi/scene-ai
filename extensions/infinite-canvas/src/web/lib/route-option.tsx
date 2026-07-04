import { useEffect, useRef } from "react";
import {
    createBrowserRouter,
    Link,
    Outlet,
    type RouteObject,
    useLocation,
    useNavigate,
} from "react-router-dom";

type ConsoleMenu = {
    title: string;
    path: string;
    icon?: string;
};

type RouteOption = {
    base: string;
    identifier: string;
    routes: RouteObject[];
    consoleMenus?: ConsoleMenu[];
    consoleRoutes?: RouteObject[];
};

function ParentFrameSync() {
    const location = useLocation();
    const navigate = useNavigate();
    const isParentNavigatingRef = useRef(false);

    useEffect(() => {
        if (window.parent === window) return;
        if (isParentNavigatingRef.current) {
            isParentNavigatingRef.current = false;
            return;
        }

        window.parent.postMessage(
            {
                type: "extension-navigate",
                path: location.pathname,
                search: location.search,
                hash: location.hash,
            },
            "*",
        );
    }, [location.hash, location.pathname, location.search]);

    useEffect(() => {
        if (window.parent === window) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type !== "parent-navigate") return;

            const path = event.data.path ?? "/";
            const search = event.data.search ?? "";
            const hash = event.data.hash ?? "";
            const target = `${path}${search}${hash}`;
            const current = `${location.pathname}${location.search}${location.hash}`;

            if (target !== current) {
                isParentNavigatingRef.current = true;
                navigate(target, { replace: true });
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [location.hash, location.pathname, location.search, navigate]);

    return <Outlet />;
}

function ConsoleLayout({ menus, identifier }: { menus: ConsoleMenu[]; identifier: string }) {
    return (
        <div className="ic-console-shell">
            <aside className="ic-console-sidebar">
                <strong>{identifier}</strong>
                <nav>
                    {menus.map((menu) => (
                        <Link key={menu.path} to={`/console${menu.path === "/" ? "" : menu.path}`}>
                            {menu.title}
                        </Link>
                    ))}
                </nav>
            </aside>
            <section className="ic-console-content">
                <Outlet />
            </section>
        </div>
    );
}

function NotFoundPage() {
    const location = useLocation();

    useEffect(() => {
        if (window.parent === window) return;
        window.parent.postMessage(
            {
                type: "extension-not-found",
                path: location.pathname,
                search: location.search,
                hash: location.hash,
            },
            "*",
        );
    }, [location.hash, location.pathname, location.search]);

    return (
        <main className="ic-page">
            <p className="ic-muted">页面不存在。</p>
            <Link className="ic-primary-link" to="/">
                返回首页
            </Link>
        </main>
    );
}

export function defineRouteOption(option: RouteOption) {
    const { routes, consoleRoutes = [], consoleMenus = [], identifier } = option;

    return createBrowserRouter(
        [
            {
                element: <ParentFrameSync />,
                children: [
                    ...routes,
                    {
                        path: "/console/*",
                        element: <ConsoleLayout menus={consoleMenus} identifier={identifier} />,
                        children: consoleRoutes,
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                ],
            },
        ],
        {
            basename: option.base,
        },
    );
}
