import React from "react";
import { styled } from "@mui/material/styles";
import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Header from "~/components/organisms/Header/Header";
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
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
}));

const AppShellMain = styled("main")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxSizing: "border-box",
});

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  const handleLogout = () => {
    void logout();
  };

  return (
    <AppShellRoot data-testid="app-shell-root">
      <Header
        mode="full"
        user={user}
        onLogout={handleLogout}
        data-testid="app-shell-header"
      />
      <AppShellMain>
        <Outlet context={{ user }} />
      </AppShellMain>
      <Footer />
    </AppShellRoot>
  );
}
