# 07 — Tooling, pnpm & Build Workflow

> **Part of AptiSpace LMS Architecture Guides**  
> **Master Index:** [ARCHITECTURE.md](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/ARCHITECTURE.md)

---

## 1. Package Management: Strict `pnpm` Enforcement

**`pnpm` is strictly mandatory for all package operations across the repository.**

> [!CAUTION]
> **Strict Policy:**
>
> - ✅ **USE:** `pnpm add <pkg>`, `pnpm install`, `pnpm run <script>`
> - ❌ **NEVER USE:** `npm install`, `npm run`, `yarn`, `bun`
>
> Running `npm` or `yarn` creates conflicting lockfiles (`package-lock.json`, `yarn.lock`) and breaks the Wireit caching graph.

---

## 2. Wireit Task Graph & Incremental Caching

The project uses [Wireit](https://github.com/google/wireit) to manage task dependencies, input/output fingerprinting, and parallel execution.

```
                  ┌──────────────────────┐
                  │   pnpm run build     │
                  └──────────┬───────────┘
                             │ (depends on)
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ pnpm run typecheck │ │  pnpm run lint  │ │  pnpm run test  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.1 Essential Scripts

| Command                    | Action                                                                                                        |
| :------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `pnpm run dev`             | Starts the React Router development server with HMR.                                                          |
| `pnpm run storybook`       | Launches Storybook 10 development server on port 6006.                                                        |
| `pnpm run typecheck`       | Executes `react-router typegen` followed by strict `tsc`.                                                     |
| `pnpm run lint`            | Runs ESLint 10 and Prettier across all app code and configs.                                                  |
| `pnpm run test`            | Runs all Vitest tests in Playwright Chromium headless mode.                                                   |
| `pnpm run build-storybook` | Builds static Storybook documentation artifacts.                                                              |
| `pnpm run build`           | Runs full verification pipeline (`typecheck` $\rightarrow$ `lint` $\rightarrow$ `test` $\rightarrow$ bundle). |

---

## 3. Git Workflow & Conventional Commits

- **Husky & Git Hooks:** Husky runs pre-commit verification gates automatically.
- **Commitlint:** All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

Examples:
feat(atoms): create Solarized ExpressiveCard primitive
fix(galaxy): resolve WebGL context leak on unmount
docs(arch): update typography standard to Recursive Casual
test(molecules): add unit tests for SearchBar
```

Allowed Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
