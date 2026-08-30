import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import LoginCard from "~/components/organisms/LoginCard/LoginCard";
import { getSession } from "~/utils/session.server";
import { getDatabaseFromContext } from "~/db";
import {
  getUserWithAffiliations,
  isUserProfileComplete,
} from "~/services/userService";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session) {
    const db = getDatabaseFromContext(context);
    const user =
      db && session.userId
        ? await getUserWithAffiliations(db, session.userId)
        : null;
    if (!user || !isUserProfileComplete(user)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/onboarding" },
      });
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }
  return null;
}

export function meta() {
  return [
    { title: "AptiSpace LMS • Gateway Login" },
    {
      name: "description",
      content:
        "Authenticate into AptiSpace LMS to access courses, labs, and interactive space flight simulations.",
    },
  ];
}

export default function LoginPage() {
  const { t } = useTranslation("meta");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = t("home.title");
    }
  }, [t]);

  const handleLoginSuccess = () => {
    window.location.href = "/";
  };

  return (
    <AuthLayout>
      <LoginCard onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
