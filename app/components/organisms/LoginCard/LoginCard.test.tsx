import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import LoginCard from "./LoginCard";
import * as authUtils from "~/utils/auth";

const mockNotifyError = vi.fn();

vi.mock("~/utils/statusCenterContext", () => ({
  useStatusCenter: () => ({
    notifyError: mockNotifyError,
  }),
}));

vi.mock("~/utils/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof authUtils>();
  return {
    ...actual,
    loginWithGitHub: vi.fn().mockResolvedValue(undefined),
    loginAsAccount: vi.fn().mockResolvedValue({
      id: "dev-student-1",
      name: "Alex Mercer",
      role: "student",
      email: "alex.mercer@aptispace.com",
    }),
    fetchAccountsFromDb: vi.fn().mockResolvedValue([
      {
        id: "dev-student-1",
        name: "Alex Mercer",
        role: "student",
        email: "alex.mercer@aptispace.com",
      },
    ]),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("LoginCard Organism", () => {
  it("renders LoginCard with GitHub button and security note", () => {
    renderWithProviders(<LoginCard showDevTool={false} />);

    // GitHub login button
    const githubBtn = screen.getByRole("button", {
      name: /continue with github|github/i,
    });
    expect(githubBtn).toBeDefined();

    // Logo should be present
    expect(screen.getByAltText(/AptiSpace Icon/i)).toBeDefined();
  });

  it("handles GitHub login click successfully", async () => {
    renderWithProviders(<LoginCard showDevTool={false} />);

    const githubBtn = screen.getByRole("button", {
      name: /continue with github|github/i,
    });
    fireEvent.click(githubBtn);

    expect(authUtils.loginWithGitHub).toHaveBeenCalledTimes(1);
  });

  it("handles GitHub login error and triggers notifyError", async () => {
    vi.mocked(authUtils.loginWithGitHub).mockRejectedValueOnce(
      new Error("Network Auth Failure"),
    );

    renderWithProviders(<LoginCard showDevTool={false} />);

    const githubBtn = screen.getByRole("button", {
      name: /continue with github|github/i,
    });
    fireEvent.click(githubBtn);

    await waitFor(() => {
      expect(mockNotifyError).toHaveBeenCalled();
    });
  });

  it("renders DevImpersonator when showDevTool is true and logs in as account", async () => {
    const onSuccess = vi.fn();

    renderWithProviders(<LoginCard showDevTool={true} onSuccess={onSuccess} />);

    // Check that DevImpersonator container is rendered
    const devRoot = screen.getByTestId("dev-impersonator");
    expect(devRoot).toBeDefined();

    // Wait for dev account card to appear
    const card = await screen.findByTestId("account-card-dev-student-1");
    fireEvent.click(card);

    await waitFor(() => {
      expect(authUtils.loginAsAccount).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
