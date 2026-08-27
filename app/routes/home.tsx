import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/home";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import LoginCard from "~/components/organisms/LoginCard/LoginCard";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "AptiSpace LMS • Orbital Gateway Login" },
    {
      name: "description",
      content:
        "Welcome to AptiSpace LMS. Secure single sign-on via GitHub to access courses and simulations.",
    },
  ];
}

export default function Home() {
  const { t } = useTranslation("meta");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = t("home.title");
    }
  }, [t]);

  return (
    <AuthLayout>
      <LoginCard />
    </AuthLayout>
  );
}
