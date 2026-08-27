# 01 — System Architecture & Technology Stack

> **Part of AptiSpace LMS Architecture Guides**  
> **Master Index:** [ARCHITECTURE.md](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/ARCHITECTURE.md)

---

## 1. System Vision & Overview

**AptiSpace LMS** is a next-generation Learning Management System featuring a friendly, casual, yet sleek and subtly futuristic aesthetic. It pairs cutting-edge 3D WebGL visuals with a rigorous, type-safe full-stack foundation designed for speed, accessibility, and high developer velocity.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                                     │
│  React 19 • React Router 8 (SSR / Edge) • Vite 8 • Storybook 10 • Tailwind CSS v4      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                             DESIGN & THEME ENGINE (MUI 3)                              │
│  MUI v9 Core (@mui/material/styles) • Emotion • Solarized Theme System (createTheme)  │
│  Recursive Casual Typography (Variable Font: CASL=1, CRSV=1)                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                             3D & GRAPHICS RENDERING LAYER                              │
│  OGL (GLSL Shaders) • Three.js • React Three Fiber • Drei • DeckFX (Holographics)      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                 DATA & EDGE RUNTIME                                    │
│  Cloudflare Workers / Pages • D1 SQLite Database • Drizzle ORM Type-Safe Queries       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                           QUALITY ASSURANCE & BUILD PIPELINE                           │
│  pnpm • Wireit Task Graph • Vitest 4 (Playwright Browser) • ESLint 10 • Husky         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Technology Stack

| Layer                    | Technology                      | Version                  | Purpose                                                                                 |
| :----------------------- | :------------------------------ | :----------------------- | :-------------------------------------------------------------------------------------- |
| **Package Manager**      | `pnpm`                          | $\ge 9.x$                | **Mandatory.** Fast, deterministic, disk-efficient dependency management.               |
| **Runtime & Framework**  | React + React Router            | React 19, React Router 8 | Server-Side Rendering (SSR), edge routing, nested layouts, data loaders/actions.        |
| **Theme & Components**   | MUI Material + Emotion          | MUI v9 (`@mui/material`) | Material UI 3 Expressive design tokens, `createTheme`, theme-aware `styled` primitives. |
| **Styling Utilities**    | Tailwind CSS                    | v4 (`@tailwindcss/vite`) | CSS-first configuration, rapid utility styling, layout helpers.                         |
| **3D & Shaders**         | OGL + Three.js                  | OGL 1.0, Three.js 0.185  | High-performance WebGL cosmos simulations, particle systems, holographic deck effects.  |
| **Build & Task Caching** | Vite + Wireit                   | Vite 8, Wireit 0.14      | Instant HMR, deterministic build graph, output fingerprinting.                          |
| **Database & ORM**       | Cloudflare D1 + Drizzle ORM     | Drizzle Kit              | Type-safe serverless SQL persistence at the edge.                                       |
| **Testing & Visuals**    | Vitest + Playwright + Storybook | Vitest 4, Storybook 10   | Headless browser testing (Chromium), component-driven workbench, a11y testing.          |

---

## 3. Directory Layout

```
aptispace-lms-04/
├── app/
│   ├── components/          # Atomic Design component library
│   │   ├── atoms/           # Pure UI primitives (Galaxy, Button, Input, Card)
│   │   ├── molecules/       # Single-purpose atom combinations (SearchBar, MetricBadge)
│   │   ├── organisms/       # Feature widgets (Header, CourseCardGrid, LessonPlayer)
│   │   └── templates/       # Layout skeletons & slot structures (DashboardLayout)
│   ├── routes/              # React Router v8 route modules & page endpoints
│   ├── tokens/              # Solarized design tokens & theme definitions
│   ├── utils/               # Pure mathematical, formatting, and color utilities
│   ├── root.tsx             # HTML shell, ThemeProvider, ErrorBoundary
│   ├── routes.ts            # Route configuration table
│   └── app.css              # Global styles & Tailwind v4 theme directives
├── docs/                    # Modular architectural documentation
├── stories/                 # Storybook component stories & visual showcases
├── test/                    # Unit, integration, and E2E browser tests
├── .agents/                 # AI Agent rules & specialized capability skills
├── .storybook/              # Storybook configuration & preview decorators
├── eslint.config.js         # Strict boundary, complexity, and lint enforcement
├── vite.config.ts           # Vite, Vitest, and Storybook test plugin configuration
└── package.json             # Project dependencies and Wireit build scripts
```

---

## 4. Architectural Invariants

1. **Edge-Ready & SSR Compatible:** All code within `app/` must be SSR-safe. Client-only WebGL APIs (`window`, `gl`, `canvas`) must be guarded in `useEffect` or dynamic browser checks.
2. **Deterministic Task Execution:** All build, test, lint, and typecheck workflows must run through `pnpm` and `wireit`.
3. **Strict Separation of Concerns:** Route modules (`app/routes/`) handle data fetching and page orchestration; visual layout and UI are delegated to Atomic Design components.
