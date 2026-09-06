import React from "react";
import { styled } from "@mui/material/styles";
import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Sidebar from "~/components/organisms/Sidebar/Sidebar";
import Footer from "~/components/organisms/Footer/Footer";
import { authGuard } from "~/utils/session.server";
import { logout, resolveActiveUser } from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth || !auth.user || !isUserProfileComplete(auth.user)) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/onboarding" },
    });
  }
  const activeUser = resolveActiveUser(auth.user, auth.session);
  return { user: activeUser };
}

const AppShellRoot = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  position: "relative",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
}));

const AppShellMain = styled("main")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: `calc(100% - ${theme.spacing(9)})`,
  marginLeft: theme.spacing(9),
  minHeight: "100vh",
  boxSizing: "border-box",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    width: `calc(100% - ${theme.spacing(9)})`,
    marginLeft: theme.spacing(9),
  },
}));

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  const handleLogout = () => {
    void logout();
  };

  return (
    <AppShellRoot data-testid="app-shell-root">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        data-testid="app-shell-sidebar"
      />
      <AppShellMain data-testid="app-shell-main">
        <Outlet context={{ user }} />
      </AppShellMain>
      <Footer data-testid="app-shell-footer" />
    </AppShellRoot>
  );
}
