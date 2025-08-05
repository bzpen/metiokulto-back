import { DevtoolsProvider } from "@providers/devtools";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { CustomTitle } from "@components/CustomTitle";
import "@refinedev/antd/dist/reset.css";
import "@styles/global.css";

export const metadata: Metadata = {
  title: "Metiokulto 管理后台",
  description: "Metiokulto 数据管理系统",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Suspense>
          <GitHubBanner />
          <RefineKbarProvider>
            <ConfigProvider locale={zhCN}>
              <DevtoolsProvider>
                <Refine
                  routerProvider={routerProvider}
                  authProvider={authProviderClient}
                  dataProvider={dataProvider}
                  notificationProvider={useNotificationProvider}
                  resources={[
                    {
                      name: "tb_product",
                      list: "/products",
                      create: "/products/create",
                      edit: "/products/edit/:id",
                      meta: {
                        label: "产品管理",
                        icon: "🛍️",
                      },
                    },
                    {
                      name: "tb_user",
                      list: "/users",
                      meta: {
                        label: "用户管理",
                        icon: "👥",
                      },
                    },
                    {
                      name: "user_leave",
                      list: "/messages",
                      meta: {
                        label: "用户留言",
                        icon: "💬",
                      },
                    },
                    {
                      name: "tb_eclub",
                      list: "/eclub",
                      meta: {
                        label: "E-Club订阅",
                        icon: "📧",
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "ymgn2m-qNghqO-o0RdMf",
                  }}
                >
                  <ThemedLayoutV2 Title={CustomTitle}>
                    {children}
                  </ThemedLayoutV2>
                  <RefineKbar />
                </Refine>
              </DevtoolsProvider>
            </ConfigProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
