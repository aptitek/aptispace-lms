import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Outlet,
  useLoaderData,
  useRevalidator,
  type LoaderFunctionArgs,
} from "react-router";
import Sidebar from "~/components/organisms/Sidebar/Sidebar";
import { authGuard } from "~/utils/session.server";
import { logout, resolveActiveUser, type AuthUser } from "~/utils/auth";
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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(user);
  const revalidator = useRevalidator();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleUserUpdated = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app:user-updated", { detail: updatedUser }),
      );
    }
    void revalidator.revalidate();
  };

  const currentUserId = currentUser?.id;
  useEffect(() => {
    if (!currentUserId) return;
    const handleGlobalUserUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<
        Partial<AuthUser> & { id: string }
      >;
      if (customEvent.detail && customEvent.detail.id === currentUserId) {
        setCurrentUser((prev) =>
          prev ? { ...prev, ...customEvent.detail } : prev,
        );
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("app:user-updated", handleGlobalUserUpdated);
      return () => {
        window.removeEventListener("app:user-updated", handleGlobalUserUpdated);
      };
    }
  }, [currentUserId]);

  const handleLogout = () => {
    void logout();
  };

  return (
    <AppShellRoot data-testid="app-shell-root">
      <Sidebar
        user={currentUser}
        onLogout={handleLogout}
        onUserUpdated={handleUserUpdated}
        data-testid="app-shell-sidebar"
      />
      <AppShellMain data-testid="app-shell-main">
        <Outlet
          context={{ user: currentUser, onUserUpdated: handleUserUpdated }}
        />
      </AppShellMain>
    </AppShellRoot>
  );
}
