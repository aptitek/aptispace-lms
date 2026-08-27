import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "../app/tokens/theme";
import "../app/app.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
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
