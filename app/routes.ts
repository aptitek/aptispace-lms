import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Core Application Routes
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("onboarding", "routes/onboarding.tsx"),

  // Admin Section with canonical tab navigation (/admin, /admin/users, /admin/cohorts, /admin/mission-center, /admin/courses)
  route("admin/:tab?", "routes/admin.tsx"),

  // Public Asset Delivery (R2 Storage CDN)
  route("avatars/*", "routes/avatars.$.ts"),

  // Auth & Session Endpoints
  route("api/auth/github", "routes/api.auth.github.ts"),
  route("api/auth/github/callback", "routes/api.auth.github.callback.ts"),
  route("api/auth/logout", "routes/api.auth.logout.ts"),
  route("api/session", "routes/api.session.ts"),

  // Domain Resource Endpoints
  route("api/profile", "routes/api.profile.ts"),
  route("api/users", "routes/api.users.ts"),
  route("api/users/:id", "routes/api.users.$id.ts"),
  route("api/courses", "routes/api.courses.ts"),
  route("api/courses/:courseId", "routes/api.courses.$id.ts"),
  route("api/avatars/upload", "routes/api.avatars.upload.ts"),
  route("api/errors/report", "routes/api.errors.report.ts"),
  route("api/health", "routes/api.health.ts"),

  // Dev & Impersonation Utilities (Strictly RBAC & Env Guarded)
  route("api/dev/impersonate", "routes/api.dev.impersonate.ts"),
  route("api/dev/personas", "routes/api.dev.personas.ts"),
  route("api/dev/database/:action?", "routes/api.dev.database.ts"),
] satisfies RouteConfig;
