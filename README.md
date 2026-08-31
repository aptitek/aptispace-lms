# AptiSpace LMS

> **Next-Generation Learning Management System for Aerospace Academies & Flight Engineering**

AptiSpace LMS is a modern, high-performance web platform designed for aerospace training institutions. It combines an ISO/IEC 7810 ID-1 biometric smart card onboarding experience, Material Design 3 (M3) Expressive visual system with Solarized color harmonics, real-time Cloudflare D1/R2 infrastructure, and interactive WebGL simulations.

---

## ✨ Features

- 🛰️ **ISO/IEC 7810 ID-1 Smart Card Onboarding**:
  - Interactive 3D holographic foil rendering (rainbow/prismatic variants)
  - ICAO 9303 Doc 9303 compliant Machine Readable Zone (MRZ TD-1 format)
  - Mathematical Guilloche security wave patterns seeded by institution ID
  - Client-side biometric avatar editing with shape mask presets
- 🎨 **Material Design 3 Expressive & Solarized Palette**:
  - Tailored Solarized dark and light themes with calibrated contrast ratios
  - Custom _Zenith_ celestial day/night theme switch with smooth horizon animations
  - Custom _Meridian_ flight-trajectory language switch (English ↔ French) with animated flag pucks
  - Expressive M3 corner shape catalog (rounded, cut, scalloped, petal)
- 🔒 **Enterprise-Grade Identity & RBAC**:
  - GitHub OAuth 2.0 authentication integration via Octokit
  - Role-Based Access Control (`admin`, `instructor`, `student` / `cadet`)
  - Integrated Dev Impersonator toolbar for role & persona simulation in development
  - Cryptographically validated session cookies and strict email domain enforcement
- ☁️ **Edge-Ready Serverless Stack**:
  - Cloudflare Workers runtime powered by React Router v8 full-stack SSR
  - Cloudflare D1 distributed SQLite database with Drizzle ORM
  - Cloudflare R2 object storage for compressed WebP avatar asset hosting
- 🧪 **Component-Driven Quality Architecture**:
  - Storybook 10 design system catalog with automated accessibility (a11y) checks
  - Fast Vitest test suite with browser-based component execution via Playwright

---

## 🛠️ Technology Stack

| Domain                   | Technologies                                                                                                                                                                               |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**            | [React 19](https://react.dev/), [React Router v8](https://reactrouter.com/), [Vite 8](https://vitejs.dev/)                                                                                 |
| **UI & Styling**         | [MUI v9](https://mui.com/), [Emotion](https://emotion.sh/), [TailwindCSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)                                    |
| **3D & Graphics**        | [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [OGL](https://github.com/oframe/ogl), [DeckFX](https://github.com/)                                      |
| **Database & ORM**       | [Cloudflare D1](https://developers.cloudflare.com/d1/), [Drizzle ORM](https://orm.drizzle.team/), [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)                                |
| **Edge Infrastructure**  | [Cloudflare Workers](https://workers.cloudflare.com/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [Wrangler](https://developers.cloudflare.com/workers/wrangler/)             |
| **Internationalization** | [i18next](https://www.i18next.com/), [react-i18next](https://react.i18next.com/) (EN, FR)                                                                                                  |
| **Testing & Tooling**    | [Vitest](https://vitest.dev/), [Storybook 10](https://storybook.js.org/), [Playwright](https://playwright.dev/), [Wireit](https://github.com/google/wireit), [ESLint](https://eslint.org/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v22.0.0` or later
- **Package Manager**: `pnpm` (`v9.0.0`+) or `npm`
- **Cloudflare Wrangler CLI**: (included in devDependencies)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aptitek/aptispace-lms.git
cd aptispace-lms
pnpm install
```

### Local Database Setup

Initialize the local Cloudflare D1 database, apply migrations, and populate initial seed data:

```bash
pnpm db:setup:local
```

> **Note**: This automatically executes `db:generate`, `db:migrate:local`, and `db:seed:local` via Wireit task orchestration.

### Starting the Development Server

Run the development server with HMR:

```bash
pnpm dev
```

The application will be accessible at: `http://localhost:5173`.

---

## 📖 Available Scripts

| Command                 | Description                                                               |
| :---------------------- | :------------------------------------------------------------------------ |
| `pnpm dev`              | Starts the React Router development server with local D1 database binding |
| `pnpm build`            | Builds the production bundle (SSR server & static assets)                 |
| `pnpm start`            | Runs the production build locally via `@react-router/serve`               |
| `pnpm storybook`        | Starts the Storybook component explorer on `http://localhost:6006`        |
| `pnpm build-storybook`  | Compiles static Storybook documentation                                   |
| `pnpm test`             | Runs the entire Vitest suite (unit tests and Storybook browser tests)     |
| `pnpm test:watch`       | Runs Vitest in interactive watch mode                                     |
| `pnpm typecheck`        | Validates TypeScript types and generates React Router route types         |
| `pnpm lint`             | Runs ESLint and Prettier formatting checks                                |
| `pnpm db:generate`      | Generates SQL migrations from Drizzle schema definitions                  |
| `pnpm db:migrate:local` | Applies pending migrations to the local D1 database                       |
| `pnpm db:seed:local`    | Seeds default institutions, cohorts, and personas                         |
| `pnpm db:reset:local`   | Resets and reseeds the local D1 database                                  |
| `pnpm deploy`           | Deploys the application and assets to Cloudflare Workers                  |

---

## 📂 Project Structure

```text
aptispace-lms/
├── app/
│   ├── components/
│   │   ├── atoms/          # Primitive components (Avatar, Logo, Toggles, Guilloche, Galaxy)
│   │   ├── molecules/      # Composite UI (EditableAvatar, EmailField, IdCard, DevImpersonator)
│   │   ├── organisms/      # Feature blocks (Header, Footer, LoginCard, OnboardingCard, StatusCenter)
│   │   └── templates/      # Page layouts (AuthLayout)
│   ├── config/             # Application configs, school data, admin allowances
│   ├── db/                 # Drizzle ORM schema, relations, and database client
│   ├── i18n/               # Translation resources (en/fr) and i18n initialization
│   ├── routes/             # React Router route modules and server actions/loaders
│   ├── services/           # Business logic (users, schools, avatar storage)
│   ├── tokens/             # Design tokens, Solarized palette, typography, motion curves
│   └── utils/              # Session handling, security, status center context
├── drizzle/                # D1 SQL migration snapshots
├── scripts/                # Database seed, reset, and utility scripts
├── stories/                # Storybook component stories and visual specifications
└── wrangler.jsonc          # Cloudflare Workers, D1, and R2 resource definitions
```

---

## 📄 License

Proprietary © Aptitek. All rights reserved.
