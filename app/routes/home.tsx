import { styled } from "@mui/material/styles";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import Header from "~/components/organisms/Header/Header";
import Footer from "~/components/organisms/Footer/Footer";
import { authGuard } from "~/utils/session.server";
import { logout, resolveActiveUser } from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";
import type { Route } from "./+types/home";

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

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "AptiSpace LMS • Orbital Command Bridge" },
    {
      name: "description",
      content:
        "AptiSpace LMS Main Command Bridge. Access active course modules, telemetry simulations, and assessments.",
    },
  ];
}

const PageRoot = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxSizing: "border-box",
}));

const MainWorkspace = styled("main")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6, 3),
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 2),
  },
}));

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();

  const handleLogout = () => {
    void logout();
  };

  return (
    <PageRoot>
      <Header
        mode="full"
        user={loaderData.user}
        onLogout={handleLogout}
        data-testid="main-header"
      />

      <MainWorkspace />

      <Footer />
    </PageRoot>
  );
}
