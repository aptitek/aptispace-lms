import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Application Shell (Persistent Header & Extensible Navigation)
  layout("routes/_app/_app.tsx", [
    index("routes/home/home.tsx"),
    route("planning", "routes/planning/planning.tsx"),
    route("admin/:tab?", "routes/admin/admin.tsx"),
  ]),

  // Standalone Flow (No primary app shell)
  route("login", "routes/login/login.tsx"),
  route("onboarding", "routes/onboarding/onboarding.tsx"),

  // Public Asset Delivery (R2 Storage CDN)
  route("avatars/*", "routes/avatars/avatars.$.ts"),

  // Auth & Session Endpoints
  route("api/auth/github", "routes/api/auth/github.ts"),
  route("api/auth/github/callback", "routes/api/auth/github.callback.ts"),
  route("api/auth/logout", "routes/api/auth/logout.ts"),
  route("api/session", "routes/api/session.ts"),

  // Domain Resource Endpoints
  route("api/profile", "routes/api/profile/profile.ts"),
  route("api/users", "routes/api/users/users.ts"),
  route("api/users/:id", "routes/api/users/users.$id.ts"),
  route("api/classes", "routes/api/classes/classes.ts"),
  route("api/classes/:id", "routes/api/classes/classes.$id.ts"),
  route(
    "api/calendar/:token.ics",
    "routes/api/calendar/calendar.$token[.]ics.ts",
  ),
  route("api/courses", "routes/api/courses/courses.ts"),
  route("api/courses/:courseId", "routes/api/courses/courses.$id.ts"),
  route("api/avatars/upload", "routes/api/avatars/upload.ts"),
  route("api/errors/report", "routes/api/errors/report.ts"),
  route("api/health", "routes/api/health/health.ts"),

  // Dev & Impersonation Utilities (Strictly RBAC & Env Guarded)
  route("api/dev/impersonate", "routes/api/dev/impersonate.ts"),
  route("api/dev/personas", "routes/api/dev/personas.ts"),
  route("api/dev/database/:action?", "routes/api/dev/database.ts"),
] satisfies RouteConfig;
