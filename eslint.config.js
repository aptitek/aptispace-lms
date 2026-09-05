import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import boundariesPlugin from "eslint-plugin-boundaries";
import vitestPlugin from "@vitest/eslint-plugin";
import storybookPlugin from "eslint-plugin-storybook";
import cssPlugin from "@eslint/css";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import sonarjs from "eslint-plugin-sonarjs";

const HEX_COLOR_PATTERN = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const RAW_COLOR_FN_PATTERN = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\(/i;

const cssTokensPlugin = {
  meta: {
    name: "eslint-plugin-css-tokens",
  },
  rules: {
    "no-raw-colors": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow raw #hex or rgba()/rgb() colors in CSS files that are not base tokens.",
          recommended: true,
        },
        messages: {
          noRawHex:
            "Hardcoded hex color '{{value}}' detected in CSS. Use design tokens (e.g. var(--color-*)) instead.",
          noRawColorFn:
            "Hardcoded '{{func}}()' color detected in CSS. Use design tokens (e.g. var(--color-*)) instead.",
        },
      },
      create(context) {
        return {
          Hash(node) {
            context.report({
              loc: node.loc,
              messageId: "noRawHex",
              data: { value: `#${node.value}` },
            });
          },
          Function(node) {
            if (/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch)$/i.test(node.name)) {
              context.report({
                loc: node.loc,
                messageId: "noRawColorFn",
                data: { func: node.name },
              });
            }
          },
          Declaration(node) {
            if (node.value && node.value.type === "Raw") {
              const rawVal = node.value.value || "";
              const hexMatch = HEX_COLOR_PATTERN.exec(rawVal);
              if (hexMatch) {
                context.report({
                  loc: node.loc,
                  messageId: "noRawHex",
                  data: { value: hexMatch[0] },
                });
              }
              const fnMatch = RAW_COLOR_FN_PATTERN.exec(rawVal);
              if (fnMatch) {
                context.report({
                  loc: node.loc,
                  messageId: "noRawColorFn",
                  data: { func: fnMatch[1] },
                });
              }
            }
          },
        };
      },
    },
    "no-universal-transition": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow broad transitions on universal wildcard selectors (*, ::before, ::after).",
          recommended: true,
        },
        messages: {
          noUniversalTransition:
            "Universal wildcard transition detected on '*' or '::before/::after'. Broad transitions cause severe browser paint thrashing. Scope transitions to explicit component classes.",
        },
      },
      create(context) {
        return {
          Rule(node) {
            const hasWildcard = node.prelude?.children?.some((sel) => {
              return sel.children?.some(
                (child) =>
                  (child.type === "TypeSelector" && child.name === "*") ||
                  (child.type === "PseudoElementSelector" &&
                    (child.name === "before" || child.name === "after")),
              );
            });
            if (hasWildcard) {
              const hasTransition = node.block?.children?.some(
                (decl) =>
                  decl.type === "Declaration" &&
                  typeof decl.property === "string" &&
                  decl.property.startsWith("transition"),
              );
              if (hasTransition) {
                context.report({
                  loc: node.loc,
                  messageId: "noUniversalTransition",
                });
              }
            }
          },
        };
      },
    },
    "no-tailwind-directives": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow deprecated Tailwind CSS directives (@theme, @layer, and @import 'tailwindcss').",
          recommended: true,
        },
        messages: {
          noTailwindAtRule:
            "Tailwind directive '@{{name}}' detected. Tailwind has been uninstalled in favor of Material Design 3 tokens and styled primitives.",
          noTailwindImport:
            "Tailwind import '@import \"tailwindcss\"' detected. Tailwind has been uninstalled in favor of Material Design 3 tokens.",
        },
      },
      create(context) {
        return {
          Atrule(node) {
            if (node.name === "theme" || node.name === "layer") {
              context.report({
                loc: node.loc,
                messageId: "noTailwindAtRule",
                data: { name: node.name },
              });
            } else if (node.name === "import") {
              const isTailwind = node.prelude?.children?.some(
                (child) =>
                  (typeof child.value === "string" &&
                    child.value.includes("tailwind")) ||
                  (typeof child.name === "string" &&
                    child.name.includes("tailwind")),
              );
              if (isTailwind) {
                context.report({
                  loc: node.loc,
                  messageId: "noTailwindImport",
                });
              }
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  // 1. Global Ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/.react-router/**",
      "**/storybook-static/**",
      "**/.wireit/**",
      "**/.agents/**",
      "**/dist/**",
      "**/public/**",
      "**/*.d.ts",
      "debug-storybook.log",
      "**/coverage/**",
      "**/.scannerwork/**",
    ],
  },

  // 2. Base JS & TS Recommended Configuration (scoped to JS/TS files)
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  })),

  // 2b. SonarQube Rules & Quality Gate
  {
    ...sonarjs.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/no-duplicate-string": ["warn", { threshold: 10 }],
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/use-type-alias": "off",
      "sonarjs/redundant-type-aliases": "error",
      "sonarjs/no-hardcoded-ip": "warn",
      "sonarjs/super-linear-regex": "off",
      "sonarjs/regex-complexity": "off",
    },
  },

  // 3. Global Language Options & Settings
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "boundaries/include": ["app/**/*"],
      "boundaries/elements": [
        { type: "atoms", pattern: "atoms/*", base: "app/components" },
        { type: "molecules", pattern: "molecules/*", base: "app/components" },
        { type: "organisms", pattern: "organisms/*", base: "app/components" },
        { type: "templates", pattern: "templates/*", base: "app/components" },
        { type: "pages", pattern: "routes/*", base: "app" },
        { type: "tokens", pattern: "tokens/*", base: "app" },
        {
          type: "shared",
          pattern: "{utils,i18n,config,services,db}/*",
          base: "app",
        },
      ],
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      boundaries: boundariesPlugin,
    },
    rules: {
      // --- File Size & Clean Code (Hard 500 lines limit) ---
      "max-lines": [
        "error",
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // --- React & JSX Best Practices (React 19) ---
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/self-closing-comp": "error",
      "react/no-array-index-key": "warn",

      // Enforce MUI/Expressive components over native ones
      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "button",
              message:
                "Use <Button>, <IconButton>, or <HoldButton> from @mui/material or atoms instead.",
            },
            {
              element: "input",
              message:
                "Use <TextField> from @mui/material or <EmailField> instead.",
            },
            {
              element: "select",
              message:
                "Use <Select> or <TextField select> from @mui/material instead.",
            },
            {
              element: "textarea",
              message: "Use <TextField multiline> from @mui/material instead.",
            },
            {
              element: "img",
              message: 'Use <Box component="img"> or <Avatar> instead.',
            },
            {
              element: "a",
              message:
                'Use React Router\'s <Link> or <Button href="..."> instead.',
            },
          ],
        },
      ],

      // --- React Hooks ---
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // --- JSX Accessibility (a11y) - WCAG 2.1 AA Enforced ---
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/tabindex-no-positive": "error",

      // --- TypeScript Strictness ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      // --- Single Responsibility Principle (SRP) & Clean Code ---
      complexity: ["error", 10], // McCabe cyclomatic complexity limit <= 10
      "max-depth": ["error", 4], // Nesting depth <= 4
      "max-params": ["error", 4], // Function parameters <= 4 (DTO/config object)
      "max-nested-callbacks": ["error", 3],
      "id-denylist": [
        "error",
        "data",
        "data2",
        "temp",
        "tmp",
        "item",
        "obj",
        "val",
        "res",
        "req",
        "cb",
        "el",
        "elem",
        "foo",
        "bar",
        "info",
        "manager",
        "helper",
        "isNestedInShell",
        "physicCard",
        "PhysicCard",
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",

      // --- Design Tokens & MUI Theme / Styled Primitives Enforcement ---
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@mui/material",
              importNames: ["styled"],
              message:
                "Please import `styled` from `@mui/material/styles` to enforce theme-aware primitives.",
            },
            {
              name: "@emotion/styled",
              message:
                "Please use `styled` from `@mui/material/styles` to ensure direct access to MUI theme tokens.",
            },
            {
              name: "@tailwindcss/vite",
              message:
                "Tailwind CSS has been completely removed in favor of Material Design 3 tokens.",
            },
            {
              name: "tailwindcss",
              message:
                "Tailwind CSS has been completely removed in favor of Material Design 3 tokens.",
            },
            {
              name: "~/components/molecules/PhysicCard",
              message:
                "Misspelling: 'PhysicCard' is deprecated. Import 'PhysicsCard' from '~/components/molecules/PhysicsCard' instead.",
            },
            {
              name: "~/components/molecules/MapSheet",
              message:
                "Atomic Design violation: MapSheet is an Organism. Import from '~/components/organisms/MapSheet' instead.",
            },
            {
              name: "~/components/molecules/TimeSheet",
              message:
                "Atomic Design violation: TimeSheet is an Organism. Import from '~/components/organisms/TimeSheet' instead.",
            },
            {
              name: "~/components/molecules/CalendarSheet",
              message:
                "Atomic Design violation: CalendarSheet is an Organism. Import from '~/components/organisms/CalendarSheet' instead.",
            },
            {
              name: "~/components/atoms/Avatar/shapes",
              message:
                "Decoupling violation: Shapes mathematical engine lives in Tier 0 tokens. Import from '~/tokens/shapes' instead.",
            },
          ],
          patterns: [
            {
              group: ["@mui/material/internal_*"],
              message: "Do not import private/internal MUI APIs.",
            },
            {
              group: [
                "**/molecules/PhysicCard**",
                "../molecules/PhysicCard**",
                "../../molecules/PhysicCard**",
              ],
              message:
                "Misspelling: 'PhysicCard' is deprecated. Import 'PhysicsCard' from '~/components/molecules/PhysicsCard' instead.",
            },
            {
              group: [
                "**/molecules/MapSheet**",
                "**/molecules/TimeSheet**",
                "**/molecules/CalendarSheet**",
                "../molecules/MapSheet**",
                "../molecules/TimeSheet**",
                "../molecules/CalendarSheet**",
                "../../molecules/MapSheet**",
                "../../molecules/TimeSheet**",
                "../../molecules/CalendarSheet**",
              ],
              message:
                "Atomic Design violation: MapSheet, TimeSheet, and CalendarSheet are Organisms. Import them from '~/components/organisms/*' instead.",
            },
            {
              group: [
                "**/atoms/Avatar/shapes**",
                "../atoms/Avatar/shapes**",
                "../../atoms/Avatar/shapes**",
              ],
              message:
                "Decoupling violation: Shapes mathematical engine lives in Tier 0 tokens. Import from '~/tokens/shapes' instead.",
            },
          ],
        },
      ],

      // Enforce design tokens: Disallow hardcoded hex/rgb/hsl color literals in JSX attributes and styled objects
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='style'] > JSXExpressionContainer > ObjectExpression",
          message:
            "Raw inline `style={{ ... }}` is forbidden. Use MUI `styled()` primitives or theme-aware `sx` design tokens.",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] > Literal[value=/(!size-|flex-col|items-center|justify-between)/]",
          message:
            "Tailwind utility syntax is forbidden in className. Use MUI styled() primitives, theme-aware sx, or MD3 component tokens.",
        },
        {
          selector: "JSXAttribute[name.name='isNestedInShell']",
          message:
            "Dead prop 'isNestedInShell' is forbidden. Shell layout is handled exclusively via Template tier layouts.",
        },
        {
          selector:
            "MemberExpression[object.property.name='palette'][property.name='mode']",
          message:
            "Do not read `theme.palette.mode` directly. Use CSS variables or MUI's `theme.applyStyles('dark', ...)` to avoid hydration mismatches and inline conditionals.",
        },
        {
          selector: "MemberExpression[object.name='SOLARIZED_BASE']",
          message:
            "Do not access `SOLARIZED_BASE` directly. Use CSS variables or theme-level semantic tokens instead of low-level color primitives.",
        },
        {
          selector:
            "Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            "Hardcoded hex color literal detected. Use MUI theme semantic tokens or CSS variables instead.",
        },
        {
          selector:
            "TemplateElement[value.raw=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            "Hardcoded hex color in template string detected. Use MUI theme semantic tokens or CSS variables instead.",
        },
        {
          selector:
            "Literal[value=/^(rgb|hsl)a?\\(/]:not([value=/rgba\\(0,\\s*0,\\s*0,/])",
          message:
            "Hardcoded rgb/hsl color literal detected. Use MUI theme semantic tokens or CSS variables instead.",
        },
        {
          selector:
            "TemplateElement[value.raw=/^(rgb|hsl)a?\\(/]:not([value.raw=/rgba\\(0,\\s*0,\\s*0,/])",
          message:
            "Hardcoded rgb/hsl color in template string detected. Use MUI theme semantic tokens or CSS variables instead.",
        },
      ],

      // --- Atomic Design Architecture Boundaries (v7 syntax) ---
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "tokens" } },
              allow: [{ to: { element: { type: ["tokens", "shared"] } } }],
            },
            {
              from: { element: { type: "atoms" } },
              allow: [
                { to: { element: { type: ["atoms", "tokens", "shared"] } } },
              ],
            },
            {
              from: { element: { type: "molecules" } },
              allow: [
                {
                  to: {
                    element: {
                      type: ["molecules", "atoms", "tokens", "shared"],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "organisms" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "organisms",
                        "molecules",
                        "atoms",
                        "tokens",
                        "shared",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "templates" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "templates",
                        "organisms",
                        "molecules",
                        "atoms",
                        "tokens",
                        "shared",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "pages" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "pages",
                        "templates",
                        "organisms",
                        "molecules",
                        "atoms",
                        "tokens",
                        "shared",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "shared" } },
              allow: [{ to: { element: { type: ["shared", "tokens"] } } }],
            },
          ],
        },
      ],
    },
  },

  // 4. Atomic Design Hierarchy Layer Guards
  {
    files: ["app/tokens/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/components/**",
                "../components/**",
                "../../components/**",
                "~/components/**",
                "**/routes/**",
                "~/routes/**",
              ],
              message:
                "Atomic Design Violation: Tier 0 Tokens cannot import from Components or Routes.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/atoms/**", "stories/atoms/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/molecules/**",
                "**/organisms/**",
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../molecules/**",
                "../organisms/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/molecules/**",
                "~/components/organisms/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Atoms cannot import from Molecules, Organisms, Templates, or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/molecules/**", "stories/molecules/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/organisms/**",
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../organisms/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/organisms/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Molecules cannot import from Organisms, Templates, or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/organisms/**", "stories/organisms/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Organisms cannot import from Templates or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/templates/**", "stories/templates/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/routes/**",
                "**/pages/**",
                "../../routes/**",
                "../../pages/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Templates cannot import from Pages/Routes.",
            },
          ],
        },
      ],
    },
  },

  // 5. Tokens Definition Overrides (literal color values allowed in low-level theme definitions)
  {
    files: ["app/tokens/**"],
    rules: {
      "no-restricted-syntax": "off",
      "id-denylist": "off",
    },
  },

  // 6. Test-Driven Development (TDD) Rules for Vitest
  {
    files: [
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "test/**",
    ],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "warn",
      "vitest/expect-expect": "error",
      "vitest/no-identical-title": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/no-conditional-expect": "error",
      complexity: "off",
      "max-lines-per-function": "off",
      "no-restricted-syntax": "off",
      "id-denylist": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-identical-functions": "off",
      "sonarjs/prefer-specific-assertions": "off",
      "sonarjs/no-invariant-returns": "off",
      "sonarjs/no-hardcoded-ip": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/no-floating-point-equality": "off",
    },
  },

  // 6b. Mock Data Files
  {
    files: ["**/*.mock.{ts,tsx,js,jsx}", "**/mock.{ts,tsx,js,jsx}"],
    rules: {
      "sonarjs/no-hardcoded-ip": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/pseudo-random": "off",
    },
  },

  // 6c. React Component Test File Enforcement (.test.tsx mandatory for components to enforce DOM mounting)
  {
    files: ["app/components/**/*.test.ts", "app/components/**/*.spec.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "TDD Violation: Component tests in app/components/ must use the .test.tsx extension and mount components with @testing-library/react.",
        },
      ],
    },
  },

  // 7. Storybook Stories & Component Demos Configuration
  {
    files: [
      "**/*.stories.{ts,tsx,js,jsx}",
      "**/*.stories.mdx",
      ".storybook/**",
      "stories/**",
    ],
    plugins: {
      storybook: storybookPlugin,
    },
    rules: {
      ...storybookPlugin.configs.recommended.rules,
      "no-restricted-syntax": "off",
      complexity: "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/cognitive-complexity": "off",
    },
  },

  // 8. Config & Script Files
  {
    files: ["*.config.{ts,js,mjs}", "scripts/**", "vitest.shims.d.ts"],
    rules: {
      "no-console": "off",
      "no-restricted-syntax": "off",
      complexity: "off",
      "id-denylist": "off",
      "max-lines": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/cognitive-complexity": "off",
    },
  },

  // 8b. Component Styles & Theme Tokens (CSS-in-JS)
  {
    files: ["**/*.styles.ts", "app/tokens/**"],
    rules: {
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-nested-conditional": "off",
    },
  },

  // 9. CSS Linting & Design Token Enforcement
  {
    files: ["**/*.css"],
    language: "css/css",
    plugins: {
      css: cssPlugin,
      "css-tokens": cssTokensPlugin,
    },
    rules: {
      "css-tokens/no-raw-colors": "error",
      "css-tokens/no-universal-transition": "error",
      "css-tokens/no-tailwind-directives": "error",
    },
  },

  // 10. CSS Base Tokens Overrides (allowed in token/theme definition files)
  {
    files: [
      "app/tokens/**",
      "**/tokens/**",
      "**/*token*.css",
      "**/*theme*.css",
    ],
    rules: {
      "css-tokens/no-raw-colors": "off",
    },
  },

  // 11. Prettier configuration
  prettierConfig,
);
