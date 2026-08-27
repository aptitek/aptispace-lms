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
  return (
    <AuthLayout>
      <LoginCard />
    </AuthLayout>
  );
}
