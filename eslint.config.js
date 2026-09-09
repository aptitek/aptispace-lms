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
import m3ThemePlugin from "./scripts/eslint-plugin-m3-theme.js";

import { cssTokensPlugin } from "./scripts/eslint/css-tokens-plugin.js";
import {
  forbidElementsRule,
  restrictedImportsRule,
  restrictedSyntaxRule,
} from "./scripts/eslint/restricted-rules.js";
import {
  boundariesSettings,
  boundariesRule,
  atomicHierarchyConfigs,
} from "./scripts/eslint/atomic-boundaries.js";
import {
  m3ThemeRules,
  tokensOverridesConfig,
} from "./scripts/eslint/m3-theme-config.js";
import {
  createVitestConfig,
  createStorybookConfig,
  createCssConfigs,
  mockFilesConfig,
  playwrightConfig,
  componentTestExtensionConfig,
  scriptFilesConfig,
  stylesFilesConfig,
} from "./scripts/eslint/test-overrides.js";

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
      "**/test-results/**",
      "**/playwright-report/**",
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

  // 2c. JSX Accessibility (a11y) Recommended Configuration
  {
    ...jsxA11yPlugin.flatConfigs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },

  // 3. Global Language Options, React, A11y & Project Architecture Settings
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
      ...boundariesSettings,
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      boundaries: boundariesPlugin,
      "m3-theme": m3ThemePlugin,
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
      "react/forbid-elements": forbidElementsRule,

      // --- React Hooks ---
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // --- JSX Accessibility (a11y) - WCAG 2.1 AA Enforced ---
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
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
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "error",
      "jsx-a11y/mouse-events-have-key-events": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/control-has-associated-label": [
        "warn",
        {
          ignoreElements: [
            "audio",
            "canvas",
            "embed",
            "input",
            "textarea",
            "tr",
            "video",
          ],
          ignoreRoles: [
            "grid",
            "listbox",
            "menu",
            "menubar",
            "radiogroup",
            "row",
            "tablist",
            "toolbar",
            "tree",
            "treegrid",
          ],
          includeRoles: [
            "button",
            "link",
            "checkbox",
            "menuitem",
            "menuitemcheckbox",
            "menuitemradio",
            "option",
            "radio",
            "switch",
            "tab",
          ],
        },
      ],
      "jsx-a11y/no-autofocus": [
        "warn",
        {
          ignoreNonDOM: true,
        },
      ],

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
      complexity: ["error", 10],
      "max-depth": ["error", 4],
      "max-params": ["error", 4],
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

      // --- Material Design 3 Theming Rules ---
      ...m3ThemeRules,

      // --- Design Tokens & Restrictions ---
      "no-restricted-imports": restrictedImportsRule,
      "no-restricted-syntax": restrictedSyntaxRule,

      // --- Atomic Design Architecture Boundaries ---
      "boundaries/dependencies": boundariesRule,
    },
  },

  // 4. Atomic Design Hierarchy Layer Guards
  ...atomicHierarchyConfigs,

  // 5. Tokens Definition Overrides
  tokensOverridesConfig,

  // 6. Test-Driven Development (TDD) Rules for Vitest
  createVitestConfig(vitestPlugin),

  // 6b. Mock Data Files
  mockFilesConfig,

  // 6c. Playwright E2E Tests
  playwrightConfig,

  // 6d. React Component Test File Enforcement
  componentTestExtensionConfig,

  // 7. Storybook Stories & Component Demos Configuration
  createStorybookConfig(storybookPlugin),

  // 8. Config & Script Files
  scriptFilesConfig,

  // 8b. Component Styles & Theme Tokens (CSS-in-JS)
  stylesFilesConfig,

  // 9. CSS Linting & Design Token Enforcement
  ...createCssConfigs(cssPlugin, cssTokensPlugin),

  // 10. Prettier configuration
  prettierConfig,
);
