# LMS Cloudflare Stack — Curated Skill Collection

> **79 skills** selected from agentic-awesome-skills for building a Learning Management System (LMS) on Cloudflare with React, TypeScript, Atomic Design, and DRY · TDD · KISS · SRP principles.

Each subfolder contains symlinks pointing to the canonical skill sources at `../../skills/<id>/`.

---

## Folder Structure

### 01-software-principles/ — DRY · TDD · KISS · SRP

- `clean-code-guard` — Reviews code for DRY, SOLID, KISS, YAGNI violations
- `tdd` — Test-first development workflow
- `code-showcase-testing-patterns` — Jest patterns, mocking, factory functions, TDD flow
- `testing-patterns` — Unit test patterns, mocking strategies
- `code-refactoring-refactor-clean` — Refactor with SOLID & clean code principles
- `code-simplification` — Identify and remove unnecessary complexity
- `code-simplifier` — Simplify code structure and expressions
- `code-polish` — Final polish pass before PR/merge
- `kaizen` — Continuous incremental improvement cycles
- `complexity-cuts` — Detect and reduce accidental complexity
- `composition-patterns` — Favour composition over inheritance
- `code-review-and-quality` — PR review standards and quality gates
- `code-review-excellence` — Elevated code review practice
- `code-reviewer` — Structured code review execution

### 02-atomic-design-system/ — Atomic Design & Token Design

- `design-system` — Design system creation and governance
- `radix-ui-design-system` — Accessible headless component library patterns
- `shadcn` — shadcn/ui component management and patterns
- `rayden-code` — React code with Rayden UI components and tokens
- `rayden-use` — Rayden UI via Figma MCP with design token enforcement
- `product-design` — Product-level visual systems and UX flows
- `anti-ui-slop` — Prevent generic, low-quality UI patterns
- `design-taste-frontend` — High-agency frontend with calibrated design taste
- `high-end-visual-design` — Premium visual design execution
- `design-spells` — Design token spells and composition recipes
- `design-md` — Design documentation and system specs

### 03-react/ — React

- `fp-react` — fp-ts patterns with React hooks, state, forms
- `fp-ts-react` — Functional React with fp-ts integration
- `code-showcase-react-ui-patterns` — Loading states, error handling, data fetching UI
- `cc-skill-frontend-patterns` — React/Next.js patterns and state management
- `markstream-react` — markstream-react renderer in React 18+/Next.js
- `frontend-optimistic-mutations` — Optimistic UI mutations and rollback patterns
- `frontend-api-integration-patterns` — Typed API integration patterns
- `frontend-data-contracts` — Strong frontend-backend data contracts

### 04-typescript/ — TypeScript

- `fp-ts-pragmatic` — Practical fp-ts functional programming (80/20 approach)
- `fp-refactor` — Refactor imperative TypeScript to fp-ts patterns
- `javascript-typescript-typescript-scaffold` — Production-ready TypeScript project scaffolding
- `mcp-tool-developer` — Build MCP servers and tools with TypeScript
- `vitest-skill` — Vitest testing in TypeScript with Vite-native speed
- `drizzle-orm-expert` — Drizzle ORM schema design, migrations, serverless DBs

### 05-web-frontend/ — Web & Frontend

- `frontend-dev-guidelines` — Senior frontend engineering standards
- `frontend-architecture` — Frontend architectural patterns and decisions
- `frontend-developer` — Full frontend development skill
- `frontend-ui-engineering` — Production UI engineering patterns
- `frontend-seo` — Framework-agnostic SEO system for React
- `frontend-lighthouse` — Lighthouse performance and quality auditing
- `frontend-observability` — Frontend monitoring and error tracking
- `accessibility-compliance-accessibility-audit` — Comprehensive accessibility audit
- `screen-reader-testing` — Screen reader testing for web apps
- `i18n-localization` — Internationalization and localization
- `fixing-accessibility` — Fix accessibility issues
- `fixing-metadata` — Fix HTML metadata and SEO tags
- `fixing-motion-performance` — Fix animation and motion performance issues

### 06-cloudflare/ — Cloudflare Hosting

- `cloudflare-workers-expert` — Full Cloudflare Workers expert (KV, D1, R2, Pages, AI)
- `cloudflare-security-audit` — Security audit for Cloudflare-hosted codebases
- `hono` — Hono web framework for Cloudflare Workers & edge runtimes

### 07-testing/ — Testing

- `awt-e2e-testing` — AI-powered E2E web testing with Playwright
- `e2e-testing` — End-to-end testing patterns
- `e2e-testing-patterns` — Structured E2E test patterns
- `jest-skill` — Jest test suite patterns
- `cypress-skill` — Cypress E2E testing
- `javascript-testing-patterns` — JS/TS testing patterns and best practices
- `brooks-test` — Test quality analysis dimension
- `brooks-lint` — Lint analysis dimension
- `brooks-review` — Code review dimension
- `brooks-audit` — Full codebase audit

### 08-architecture/ — Architecture & API Design

- `architecture` — Software architecture guidance
- `architecture-patterns` — Common architectural patterns
- `architecture-decision-records` — Create and maintain ADRs
- `api-design-principles` — RESTful and API design principles
- `api-and-interface-design` — Stable API and module boundaries
- `domain-driven-design` — DDD strategic and tactical patterns
- `ddd-tactical-patterns` — Entities, value objects, aggregates, repositories

### 09-auth-database/ — Auth & Database

- `auth-implementation-patterns` — Auth implementation patterns and best practices
- `clerk-auth` — Clerk auth middleware, organizations, webhooks
- `supabase` — Supabase database, auth, edge functions
- `neon-postgres` — Neon Serverless Postgres setup and connections
- `drizzle-migration-conflict` — Resolve Drizzle migration conflicts

### 10-lms-specific/ — LMS Specific

- `moodle-external-api-development` — Custom external APIs for Moodle LMS
- `lesson-generator` — AI-powered lesson and curriculum generation
- `i18n-localization` — Multilingual content for LMS learners

---

## Coverage Map

| Concern                    | Folder                             |
| -------------------------- | ---------------------------------- |
| DRY / KISS / SRP           | 01-software-principles             |
| TDD                        | 01-software-principles, 07-testing |
| Atomic Design              | 02-atomic-design-system            |
| Design Tokens              | 02-atomic-design-system            |
| React                      | 03-react                           |
| TypeScript                 | 04-typescript                      |
| Web / Accessibility / i18n | 05-web-frontend                    |
| Cloudflare Workers         | 06-cloudflare                      |
| E2E & Unit Testing         | 07-testing                         |
| Architecture & DDD         | 08-architecture                    |
| Auth & Database            | 09-auth-database                   |
| LMS Content                | 10-lms-specific                    |
