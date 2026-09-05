import React from "react";
import Header from "../../organisms/Header/Header";
import Footer from "../../organisms/Footer/Footer";
import { PageRoot, AdminMainWorkspace } from "./AdminLayout.styles";
import type { AdminLayoutProps } from "./AdminLayout.types";

export function AdminLayout({
  user,
  onLogout,
  tabs,
  children,
}: AdminLayoutProps) {
  return (
    <PageRoot>
      <Header
        mode="full"
        user={user}
        onLogout={onLogout}
        data-testid="admin-header"
      />
      <AdminMainWorkspace>
        {tabs}
        {children}
      </AdminMainWorkspace>
      <Footer />
    </PageRoot>
  );
}

export default AdminLayout;
