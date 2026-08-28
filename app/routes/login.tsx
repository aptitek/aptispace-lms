import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, type LoaderFunctionArgs } from "react-router";
import AuthLayout from "~/components/templates/AuthLayout/AuthLayout";
import LoginCard from "~/components/organisms/LoginCard/LoginCard";
import { getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session) {
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
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = t("home.title");
    }
  }, [t]);

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <AuthLayout>
      <LoginCard onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
