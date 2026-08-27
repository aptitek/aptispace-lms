import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "../app/tokens/theme";
import "../app/i18n";
import "../app/app.css";

import { ThemeModeProvider } from "../app/utils/themeContext";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeModeProvider>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </ThemeModeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
