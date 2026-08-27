# 05 — Engineering Principles & Clean Code

> **Part of AptiSpace LMS Architecture Guides**  
> **Master Index:** [ARCHITECTURE.md](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/ARCHITECTURE.md)

---

## 1. Core Engineering Principles

Every piece of code in AptiSpace LMS must adhere to foundational software craft principles:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  SRP   • Single Responsibility: Each component/function does ONE thing.   │
│  DRY   • Don't Repeat Yourself: Abstract shared logic into tokens/utils.   │
│  KISS  • Keep It Simple, Stupid: Avoid over-engineering & nested layers.   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SRP (Single Responsibility Principle)

- **Components:** A component must either handle presentation (pure UI rendering) or data orchestration (page loader/actions). Never mix heavy data fetching logic directly inside visual atoms or molecules.
- **Custom Hooks:** Extract complex state machines, timer loops, and WebGL lifecycle bindings into dedicated hooks (e.g. `useGalaxyRenderer`, `useHolographicTilt`).
- **Files:** One primary component per file. Auxiliary styled roots and sub-interfaces belong in the same file only if tightly coupled.

---

## 3. DRY (Don't Repeat Yourself)

- **Color & Spacing:** Never repeat arbitrary style numbers or hex values. All visual metrics flow from `theme.palette` and `theme.spacing`.
- **Atomic Reuse:** If a UI pattern (e.g. badge with icon) appears across multiple organisms, promote it to a `molecule`.
- **Parsing & Math:** Shared geometry calculations and color parsers live in `app/utils/`.

---

## 4. KISS (Keep It Simple, Stupid)

- Prefer straightforward, composable React hooks and standard TypeScript types over excessive generic metaprogramming or complex inheritance hierarchies.
- Avoid premature optimization. Write clean, readable code first, then profile with DevTools.

---

## 5. Hard Lint & Complexity Thresholds

These thresholds are enforced by ESLint in [eslint.config.js](file:///home/aptitek/50-59_Code/51_Websites/aptispace-lms-04/eslint.config.js):

| Metric | Limit | Rule Name | Rationale |
| :--- | :--- | :--- | :--- |
| **Max File Length** | **500 lines** | `max-lines` | Keeps modules bite-sized, readable, and focused. |
| **Cyclomatic Complexity** | $\le \mathbf{10}$ | `complexity` | Forces decomposition of complex branching and loops. |
| **Max Nesting Depth** | $\le \mathbf{4}$ | `max-depth` | Prevents deep callback and block nesting pyramids. |
| **Max Parameters** | $\le \mathbf{4}$ | `max-params` | Functions with $>4$ parameters must use a typed Options/DTO object. |
| **Max Callbacks** | $\le \mathbf{3}$ | `max-nested-callbacks` | Eliminates callback hell. |

---

## 6. Prohibited Generic Identifiers

To ensure descriptive, self-documenting code, ESLint strictly prohibits vague variable names via `id-denylist`:

> [!CAUTION]
> **Prohibited Identifiers (`id-denylist`):**
> `data`, `data2`, `temp`, `item`, `obj`, `val`, `foo`, `bar`, `info`, `manager`, `helper`

```typescript
// ❌ WRONG (Triggers ESLint Error)
const data = await fetchCourses();
items.map((item) => renderItem(item));

// ✅ CORRECT (Descriptive & Clear)
const courseCatalog = await fetchCourses();
courseCatalog.map((course) => renderCourseCard(course));
```
