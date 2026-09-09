import vitestPlugin from "@vitest/eslint-plugin";
import storybookPlugin from "eslint-plugin-storybook";

export const vitestConfig = {
  files: ["**/*.test.{ts,tsx,js,jsx}", "**/*.spec.{ts,tsx,js,jsx}", "test/**"],
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
    "max-nested-callbacks": "off",
    "no-restricted-syntax": "off",
    "id-denylist": "off",
    "m3-theme/no-static-role-colors": "off",
    "m3-theme/no-alpha-paper-surface": "off",
    "m3-theme/no-action-as-container-background": "off",
    "m3-theme/no-dark-mode-black-shadow": "off",
    "m3-theme/no-hardcoded-box-shadow": "off",
    "m3-theme/no-raw-svg-icons": "off",
    "m3-theme/enforce-rounded-icons": "off",
    "m3-theme/allowed-theme-colors": "off",
    "m3-theme/enforce-motion-tokens": "off",
    "m3-theme/enforce-shape-tokens": "off",
    "m3-theme/enforce-spacing-tokens": "off",
    "m3-theme/enforce-typography-tokens": "off",
    "m3-theme/enforce-elevation-levels": "off",
    "m3-theme/enforce-state-layers": "off",
    "m3-theme/enforce-minimum-touch-target": "off",
    "sonarjs/no-duplicate-string": "off",
    "sonarjs/cognitive-complexity": "off",
    "sonarjs/no-identical-functions": "off",
    "sonarjs/prefer-specific-assertions": "off",
    "sonarjs/no-invariant-returns": "off",
    "sonarjs/no-hardcoded-ip": "off",
    "sonarjs/pseudo-random": "off",
    "sonarjs/no-floating-point-equality": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
  },
};

export function createVitestConfig(plugin = vitestPlugin) {
  return { ...vitestConfig, plugins: { vitest: plugin } };
}

export const storybookConfig = {
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
    "m3-theme/no-action-as-container-background": "off",
    "m3-theme/allowed-theme-colors": "off",
    "m3-theme/enforce-motion-tokens": "off",
    "m3-theme/enforce-shape-tokens": "off",
    "m3-theme/enforce-spacing-tokens": "off",
    "m3-theme/enforce-typography-tokens": "off",
    "m3-theme/enforce-elevation-levels": "off",
    "m3-theme/enforce-state-layers": "off",
    "m3-theme/enforce-minimum-touch-target": "off",
    complexity: "off",
    "sonarjs/no-duplicate-string": "off",
    "sonarjs/cognitive-complexity": "off",
  },
};

export function createStorybookConfig(plugin = storybookPlugin) {
  return { ...storybookConfig, plugins: { storybook: plugin } };
}

export const mockFilesConfig = {
  files: ["**/*.mock.{ts,tsx,js,jsx}", "**/mock.{ts,tsx,js,jsx}"],
  rules: {
    "sonarjs/no-hardcoded-ip": "off",
    "sonarjs/no-duplicate-string": "off",
    "sonarjs/pseudo-random": "off",
  },
};

export const playwrightConfig = {
  files: ["playwright/**/*.{ts,tsx,js,jsx}"],
  rules: {
    "sonarjs/no-fixed-wait-in-tests": "off",
    "vitest/expect-expect": "off",
  },
};

export const componentTestExtensionConfig = {
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
};

export const scriptFilesConfig = {
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
};

export const stylesFilesConfig = {
  files: ["**/*.styles.ts", "app/tokens/**"],
  rules: {
    "sonarjs/no-duplicate-string": "off",
    "sonarjs/no-nested-conditional": "off",
  },
};

export const testOverridesConfigs = [
  vitestConfig,
  mockFilesConfig,
  playwrightConfig,
  componentTestExtensionConfig,
  storybookConfig,
  scriptFilesConfig,
  stylesFilesConfig,
];
