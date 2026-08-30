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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
