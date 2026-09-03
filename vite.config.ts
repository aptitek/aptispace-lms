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

function cloudflareDevPlugin() {
  let proxyDispose: (() => Promise<void>) | null = null;
  return {
    name: "cloudflare-dev-proxy",
    async configureServer() {
      try {
        const { getPlatformProxy } = await import("wrangler");
        const proxy = await getPlatformProxy({
          configPath: path.resolve(dirname, "./wrangler.jsonc"),
          persist: true,
        });
        (
          globalThis as unknown as { __CLOUDFLARE_ENV__?: unknown }
        ).__CLOUDFLARE_ENV__ = proxy.env;
        proxyDispose = proxy.dispose;
      } catch (err) {
        console.warn(
          "[cloudflare-dev-proxy] Warning: local Cloudflare proxy not started:",
          err,
        );
      }
    },
    async closeBundle() {
      if (proxyDispose) {
        await proxyDispose();
      }
    },
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    tailwindcss(),
    !isTestOrStorybook && cloudflareDevPlugin(),
    !isTestOrStorybook && reactRouter(),
  ].filter(Boolean),
  server: {
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(dirname, "./app"),
    },
  },
  optimizeDeps: {
    include: [
      "framer-motion",
      "@mui/icons-material/DarkMode",
      "@mui/icons-material/LightMode",
      "@mui/icons-material/Flight",
      "@mui/icons-material/WbSunny",
      "@mui/icons-material/NightlightRound",
      "@mui/icons-material/Language",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/x-data-grid",
    ],
  },
  test: {
    projects: [
      {
        extends: true,
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
