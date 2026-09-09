import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

import { globalIgnores } from "./scripts/eslint/global-ignores.js";
import { sonarConfig } from "./scripts/eslint/sonar-config.js";
import { reactConfig } from "./scripts/eslint/react-config.js";
import { a11yConfig } from "./scripts/eslint/a11y-config.js";
import { qualityConfig } from "./scripts/eslint/quality-rules.js";
import {
  boundariesConfig,
  atomicHierarchyConfigs,
} from "./scripts/eslint/atomic-boundaries.js";
import {
  m3Config,
  tokensOverridesConfig,
} from "./scripts/eslint/m3-theme-config.js";
import { testOverridesConfigs } from "./scripts/eslint/test-overrides.js";
import { cssConfigs } from "./scripts/eslint/css-config.js";

export default tseslint.config(
  // 1. Global Ignores
  globalIgnores,

  // 2. Base JS & TS Recommended Configuration
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  })),

  // 3. Language Options & Global Environments
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
  },

  // 4. Quality Gates, SonarQube & Accessibility
  sonarConfig,
  reactConfig,
  a11yConfig,
  qualityConfig,

  // 5. Architectural Boundaries & Layer Guards
  boundariesConfig,
  ...atomicHierarchyConfigs,

  // 6. Material Design 3 Theming & Token Overrides
  m3Config,
  tokensOverridesConfig,

  // 7. Testing, Storybook, Scripts & Mocks Overrides
  ...testOverridesConfigs,

  // 8. CSS Token Enforcement & Prettier
  ...cssConfigs,
  prettierConfig,
);
