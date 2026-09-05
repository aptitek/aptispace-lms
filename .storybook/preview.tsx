import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "../app/tokens/theme";
import "../app/i18n";
import "../app/app.css";

import { ThemeModeProvider } from "../app/utils/themeContext";
import { StatusCenterProvider } from "../app/utils/statusCenterContext";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeModeProvider>
        <StatusCenterProvider>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Story />
          </ThemeProvider>
        </StatusCenterProvider>
      </ThemeModeProvider>
    ),
  ],

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Enforce WCAG 2.1 AA color contrast
            id: "color-contrast",
            enabled: true,
          },
          {
            // Enforce valid ARIA roles
            id: "aria-roles",
            enabled: true,
          },
          {
            // Enforce valid ARIA attributes
            id: "aria-valid-attr",
            enabled: true,
          },
          {
            // Enforce valid ARIA values
            id: "aria-valid-attr-value",
            enabled: true,
          },
          {
            // Enforce required ARIA attributes
            id: "aria-required-attr",
            enabled: true,
          },
          {
            // Enforce required children for ARIA roles
            id: "aria-required-children",
            enabled: true,
          },
          {
            // Enforce required parent for ARIA roles
            id: "aria-required-parent",
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
