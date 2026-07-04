declare module "@buildingai/web-core" {
    import type { RouteObject } from "react-router-dom";

    export interface ExtensionRouteOption {
        base: string;
        identifier: string;
        routes: RouteObject[];
        consoleMenus?: Array<{
            title: string;
            path: string;
            icon?: string;
        }>;
        consoleRoutes?: RouteObject[];
    }

    export function defineRouteOption(option: ExtensionRouteOption): unknown;
}

declare module "@buildingai/ui/layouts/extension/root/index" {
    import type { ReactNode } from "react";

    export function RootLayout({ children }: { children: ReactNode }): JSX.Element;
}

declare module "@buildingai/i18n" {
    import type { ReactNode } from "react";

    export function I18nProvider({
        children,
        messages,
        defaultLocale,
    }: {
        children: ReactNode;
        messages: Record<string, unknown>;
        defaultLocale: string;
    }): JSX.Element;
}
