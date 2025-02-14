"use client";
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { MenuProps } from "antd";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  function getItem(
    label: React.ReactNode,
    key: string,
    href: string,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: (
        <Link href={href} style={{ color: "white" }}>
          {label}
        </Link>
      ),
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Dashboard", "/", "/", <PieChartOutlined />),
    getItem("Products", "/products/list", "/products", <FileOutlined />),
    getItem("Users", "/users", "#", <UserOutlined />, [
      getItem("Users", "/users/list", "/users"),
    ]),
  ];

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body style={{ margin: 0 }}>
          <Layout style={{ minHeight: "100vh" }}>
            {/* Header */}
            <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
              <div className="logo" style={{ color: "white", fontSize: 20 }}>
                My Application
              </div>
            </Header>

            <Layout style={{ marginTop: 64 }}>
              {/* Sidebar */}
              <Sider
                width={200}
                style={{
                  position: "fixed",
                  background: "#001529",
                  height: "100vh",
                }}
              >
                <Menu
                  theme="dark"
                  mode="inline"
                  selectedKeys={[pathname]}
                  items={items}
                />
              </Sider>

              {/* Content */}
              <Layout style={{ marginLeft: 200, padding: "0 24px 24px" }}>
                <Content
                  style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: "#fff",
                    marginTop: 16,
                    overflow: "auto",
                  }}
                >
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </body>
      </html>
    </QueryClientProvider>
  );
};

export default LayoutComponent;
