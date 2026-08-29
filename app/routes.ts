import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("onboarding", "routes/onboarding.tsx"),
  route("api/auth", "routes/api.auth.ts"),
  route("api/auth/github", "routes/api.auth.github.ts"),
  route("api/auth/github/callback", "routes/api.auth.github.callback.ts"),
  route("api/auth/impersonate", "routes/api.auth.impersonate.ts"),
  route("api/auth/logout", "routes/api.auth.logout.ts"),
  route("api/courses", "routes/api.courses.ts"),
  route("api/avatar/upload", "routes/api.avatar.upload.ts"),
] satisfies RouteConfig;
