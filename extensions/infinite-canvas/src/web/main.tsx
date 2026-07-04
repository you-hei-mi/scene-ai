import "./styles/index.css";

import { I18nProvider } from "@buildingai/i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { RootLayout } from "./components/root-layout";
import { defaultLocale, messages } from "./locales";
import { routeOption } from "./routes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <I18nProvider messages={messages} defaultLocale={defaultLocale}>
            <RootLayout>
                <RouterProvider router={routeOption} />
            </RootLayout>
        </I18nProvider>
    </StrictMode>,
);
