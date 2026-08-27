/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname = import.meta.dirname;
const isTestOrStorybook =
  Boolean(process.env.VITEST) ||
  process.argv.some(
    (arg) => arg.includes("storybook") || arg.includes("vitest"),
  ) ||
  Boolean(
    process.env.npm_lifecycle_event?.includes("storybook") ||
    process.env.npm_lifecycle_event?.includes("test"),
  );

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tailwindcss(), !isTestOrStorybook && reactRouter()].filter(Boolean),
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["app/**/*.{test,spec}.{ts,tsx}"],
          environment: "node",
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          include: ["stories/**/*.stories.{ts,tsx}"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
