import AuthGuard from "@buildingai/ui/components/auth/auth-guard";
import GlobalError from "@buildingai/ui/components/exception/global-error";
import NotFoundPage from "@buildingai/ui/components/exception/not-found-page";
import MainLayout from "@buildingai/ui/layouts/main/index";
import DefaultLayout from "@buildingai/ui/layouts/styles/default/index";
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { createBrowserRouter } from "react-router-dom";

import DynamicHomePage from "../pages";

const AgentsIndexPage = lazy(() => import("@/pages/agents"));
const AgentChatPage = lazy(() => import("@/pages/agents/detail/chat"));
const AgentConfigurationPage = lazy(() => import("@/pages/agents/detail/configuration"));
const AgentLogsPage = lazy(() => import("@/pages/agents/detail/logs"));
const AgentMonitoringPage = lazy(() => import("@/pages/agents/detail/monitoring"));
const AgentPublishPage = lazy(() => import("@/pages/agents/detail/publish"));
const PublishChatPage = lazy(() => import("@/pages/agents/site-chat"));
const AgentsWorkspacePage = lazy(() => import("@/pages/agents/workspace"));
const AppsIndexPage = lazy(() => import("@/pages/apps"));
const DatasetsIndexPage = lazy(() => import("@/pages/datasets"));
const DatasetsLayout = lazy(() => import("@/pages/datasets/_layouts"));
const DatasetsDetailPage = lazy(() => import("@/pages/datasets/detail"));
const InstallPage = lazy(() => import("@/pages/install"));
const ConsoleLayout = lazy(() => import("../layouts/console"));
const AppIframePage = lazy(() => import("../pages/apps/[identifier]"));
const ChatPage = lazy(() => import("../pages/chat"));
const LoginPage = lazy(() =>
  import("../pages/login").then((module) => ({ default: module.LoginPage })),
);
const OAuthCallbackPage = lazy(() =>
  import("../pages/login/oauth-callback").then((module) => ({ default: module.OAuthCallbackPage })),
);
const AlipayReturnPage = lazy(() => import("../pages/payment/alipay-return"));

function lazyRouteElement(Component: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        path: "/login",
        element: lazyRouteElement(LoginPage),
      },
      {
        path: "/login/oauth-callback",
        element: lazyRouteElement(OAuthCallbackPage),
      },
      {
        path: "/install",
        element: lazyRouteElement(InstallPage),
      },
      {
        path: "/payment/alipay-return",
        element: lazyRouteElement(AlipayReturnPage),
      },
      {
        path: "/agents/:id/configuration",
        element: lazyRouteElement(AgentConfigurationPage),
      },
      {
        path: "/agents/:id/publish",
        element: lazyRouteElement(AgentPublishPage),
      },
      {
        path: "/agents/:id/logs",
        element: lazyRouteElement(AgentLogsPage),
      },
      {
        path: "/agents/:id/monitoring",
        element: lazyRouteElement(AgentMonitoringPage),
      },
      {
        path: "/agents/:id/chat",
        element: lazyRouteElement(AgentChatPage),
      },
      {
        path: "/agents/:id/c/:uuid",
        element: lazyRouteElement(AgentChatPage),
      },
      {
        path: "/agents/:agentId/:accessToken/c/:conversationId",
        element: lazyRouteElement(PublishChatPage),
      },
      {
        path: "/agents/:agentId/:accessToken",
        element: lazyRouteElement(PublishChatPage),
      },
      {
        element: <DefaultLayout />,
        errorElement: (
          <DefaultLayout>
            <GlobalError />
          </DefaultLayout>
        ),
        children: [
          {
            element: <DynamicHomePage />,
            children: [
              {
                index: true,
                element: lazyRouteElement(ChatPage),
              },
              {
                path: "/c/:id",
                element: lazyRouteElement(ChatPage),
              },
            ],
          },
          {
            path: "/chat",
            element: lazyRouteElement(ChatPage),
          },
          {
            path: "/chat/:id",
            element: lazyRouteElement(ChatPage),
          },
          {
            path: "/apps",
            element: lazyRouteElement(AppsIndexPage),
          },
          {
            path: "/apps/:identifier/*",
            element: <AuthGuard>{lazyRouteElement(AppIframePage)}</AuthGuard>,
          },
          {
            path: "/agents",
            element: lazyRouteElement(AgentsIndexPage),
          },
          {
            path: "/datasets",
            element: lazyRouteElement(DatasetsLayout),
            children: [
              {
                index: true,
                element: lazyRouteElement(DatasetsIndexPage),
              },

              {
                path: "/datasets/:id",
                element: <AuthGuard>{lazyRouteElement(DatasetsDetailPage)}</AuthGuard>,
              },
            ],
          },
          {
            path: "/agents/workspace",
            element: lazyRouteElement(AgentsWorkspacePage),
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },

      {
        element: <AuthGuard />,
        children: [
          {
            path: "/console/*",
            element: lazyRouteElement(ConsoleLayout),
            errorElement: (
              <Suspense fallback={null}>
                <ConsoleLayout>
                  <GlobalError />
                </ConsoleLayout>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
