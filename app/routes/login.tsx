import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import LoginCard from "~/components/organisms/LoginCard/LoginCard";
import { authGuard } from "~/utils/session.server";
import { isUserProfileComplete } from "~/services/userService";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context, { allowAnonymous: true });
  if (auth && auth.session) {
    if (!auth.user || !isUserProfileComplete(auth.user)) {
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
