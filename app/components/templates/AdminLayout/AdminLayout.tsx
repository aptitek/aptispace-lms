import React from "react";
import { PageRoot, AdminMainWorkspace } from "./AdminLayout.styles";
import type { AdminLayoutProps } from "./AdminLayout.types";

export function AdminLayout({ tabs, children }: AdminLayoutProps) {
  return (
    <PageRoot data-testid="admin-layout-root">
      <AdminMainWorkspace>
        {tabs}
        {children}
      </AdminMainWorkspace>
    </PageRoot>
  );
}

export default AdminLayout;
