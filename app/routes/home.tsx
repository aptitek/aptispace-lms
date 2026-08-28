import { styled } from "@mui/material/styles";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import HeaderBar from "~/components/organisms/HeaderBar/HeaderBar";
import Footer from "~/components/organisms/Footer/Footer";
import OrbitalMissionCard from "~/components/organisms/OrbitalMissionCard/OrbitalMissionCard";
import { authGuard, type SessionPayload } from "~/utils/session.server";
import { logout, type AuthUser } from "~/utils/auth";
import type { getUserWithAffiliations } from "~/services/userService";
import type { Route } from "./+types/home";

type DbUser =
  Awaited<ReturnType<typeof getUserWithAffiliations>> | null | undefined;

function mapDbUserToAuthUser(
  user: NonNullable<DbUser>,
  session?: SessionPayload | null,
): AuthUser {
  const primaryAffiliation = user.affiliations[0];
  const displayName = user.displayName ?? `${user.firstName} ${user.lastName}`;
  return {
    id: user.id,
    name: displayName,
    email: primaryAffiliation?.email ?? "",
    role: primaryAffiliation?.role ?? session?.role ?? "student",
    impersonating: session?.impersonating,
  };
}

function resolveActiveUser(
  user: DbUser,
  session?: SessionPayload | null,
): AuthUser | null {
  if (user) {
    return mapDbUserToAuthUser(user, session);
  }

  if (session) {
    return {
      id: session.userId,
      name: "Cadet User",
      email: "user@aptispace.io",
      role: session.role,
      impersonating: session.impersonating,
    };
  }

  return null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  const activeUser = resolveActiveUser(auth?.user, auth?.session);
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
      <HeaderBar
        mode="full"
        user={loaderData.user}
        onLogout={handleLogout}
        data-testid="main-headerbar"
      />

      <MainWorkspace>
        <OrbitalMissionCard data-testid="main-orbital-mission-card" />
      </MainWorkspace>

      <Footer />
    </PageRoot>
  );
}
