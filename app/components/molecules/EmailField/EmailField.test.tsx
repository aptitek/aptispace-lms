import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { appTheme } from "~/tokens/theme";
import EmailField from "./EmailField";

afterEach(cleanup);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={appTheme}>{ui}</ThemeProvider>
    </I18nextProvider>,
  );
}

describe("EmailField Molecule", () => {
  it("exports EmailField properly", () => {
    expect(EmailField).toBeDefined();
    expect(EmailField.displayName).toBe("EmailField");
  });

  it("renders with default domain and accepts typing", () => {
    const onEmailChange = vi.fn();
    const onChange = vi.fn();

    renderWithProviders(
      <EmailField
        domain="@aptispace.com"
        placeholder="username"
        onEmailChange={onEmailChange}
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText("username") as HTMLInputElement;
    expect(input).toBeDefined();
    expect(screen.getByText("aptispace.com")).toBeDefined();

    fireEvent.change(input, { target: { value: "john.doe" } });
    expect(input.value).toBe("john.doe");
    expect(onEmailChange).toHaveBeenCalledWith(
      "john.doe@aptispace.com",
      "john.doe",
    );
    expect(onChange).toHaveBeenCalledWith("john.doe@aptispace.com");
  });

  it("strips domain from input if user pastes full email with @", () => {
    const onEmailChange = vi.fn();

    renderWithProviders(
      <EmailField
        domain="aptitek.io"
        placeholder="username"
        onEmailChange={onEmailChange}
      />,
    );

    const input = screen.getByPlaceholderText("username") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "alice.martin@aptitek.io" } });

    expect(input.value).toBe("alice.martin");
    expect(onEmailChange).toHaveBeenCalledWith(
      "alice.martin@aptitek.io",
      "alice.martin",
    );
  });

  it("handles clearing the field using the clear button", () => {
    const onEmailChange = vi.fn();

    renderWithProviders(
      <EmailField
        defaultValue="bob.sponge"
        domain="aptispace.com"
        showClearButton={true}
        onEmailChange={onEmailChange}
      />,
    );

    const clearButton = screen.getByLabelText("Clear prefix");
    expect(clearButton).toBeDefined();

    fireEvent.click(clearButton);
    expect(onEmailChange).toHaveBeenCalledWith("", "");
  });

  it("renders controlled value correctly", () => {
    const { rerender } = renderWithProviders(
      <EmailField value="first.val" domain="aptispace.com" />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("first.val");

    rerender(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme}>
          <EmailField value="updated.val" domain="aptispace.com" />
        </ThemeProvider>
      </I18nextProvider>,
    );

    expect(input.value).toBe("updated.val");
  });

  it("supports errorText and helperText props", () => {
    renderWithProviders(
      <EmailField
        error={true}
        errorText="Invalid username format"
        domain="aptispace.com"
      />,
    );

    expect(screen.getByText("Invalid username format")).toBeDefined();
  });

  it("supports disabled state", () => {
    renderWithProviders(
      <EmailField
        disabled={true}
        defaultValue="locked.user"
        domain="aptispace.com"
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
