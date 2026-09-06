import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";

describe("Material Design 3 ESLint Theming Rules", () => {
  const eslint = new ESLint({
    overrideConfig: [
      {
        rules: {
          "m3-theme/no-action-as-container-background": "error",
          "m3-theme/no-static-role-colors": "error",
          "m3-theme/no-alpha-paper-surface": "error",
          "m3-theme/no-dark-mode-black-shadow": "error",
          "m3-theme/no-hardcoded-box-shadow": "error",
        },
      },
    ],
  });

  describe("m3-theme/no-action-as-container-background", () => {
    it("reports static action tokens used as container backgrounds", async () => {
      const code = `
        import Box from "@mui/material/Box";
        export function Card() {
          return (
            <Box
              sx={{
                p: 2,
                backgroundColor: "action.hover",
              }}
            />
          );
        }
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/TestCard/TestCard.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-action-as-container-background",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain("Action token 'action.hover'");
    });

    it("permits action tokens inside interactive pseudo-classes (&:hover)", async () => {
      const code = `
        import Box from "@mui/material/Box";
        export function ButtonWrapper() {
          return (
            <Box
              sx={{
                p: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          );
        }
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/TestButton/TestButton.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-action-as-container-background",
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe("m3-theme/no-static-role-colors", () => {
    it("reports direct usage of static ROLE_COLORS in UI components", async () => {
      const code = `
        import { ROLE_COLORS } from "~/tokens/namedColors";
        export function RoleBadge() {
          return <span style={{ color: ROLE_COLORS.admin }} />;
        }
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/atoms/TestBadge/TestBadge.tsx",
      });

      const violations = result?.messages.filter(
        (m) =>
          m.ruleId === "m3-theme/no-static-role-colors" ||
          m.ruleId === "no-restricted-syntax",
      );
      expect(violations.length).toBeGreaterThan(0);
    });
  });

  describe("m3-theme/no-alpha-paper-surface", () => {
    it("reports alpha(theme.palette.background.paper) without backdropFilter", async () => {
      const code = `
        import { styled, alpha } from "@mui/material/styles";
        export const Card = styled("div")(({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.4),
          padding: 16,
        }));
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/Card/Card.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-alpha-paper-surface",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Arbitrary opacity on background.paper/default is forbidden",
      );
    });

    it("permits alpha(theme.palette.background.paper) when backdropFilter is present", async () => {
      const code = `
        import { styled, alpha } from "@mui/material/styles";
        export const GlassPanel = styled("div")(({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(12px)",
          padding: 16,
        }));
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/GlassPanel/GlassPanel.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-alpha-paper-surface",
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe("m3-theme/no-dark-mode-black-shadow", () => {
    it("reports black drop-shadows inside theme.applyStyles('dark')", async () => {
      const code = `
        import { styled } from "@mui/material/styles";
        export const ElevatedCard = styled("div")(({ theme }) => ({
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          ...theme.applyStyles("dark", {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
          }),
        }));
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/ElevatedCard/ElevatedCard.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-dark-mode-black-shadow",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Dark mode elevation violation: Black drop-shadows are forbidden in dark mode",
      );
    });

    it("permits perimeter highlight rings in dark mode", async () => {
      const code = `
        import { styled } from "@mui/material/styles";
        export const HighlightCard = styled("div")(({ theme }) => ({
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          ...theme.applyStyles("dark", {
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.15)",
          }),
        }));
      `;

      const [result] = await eslint.lintText(code, {
        filePath:
          "app/components/molecules/HighlightCard/HighlightCard.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-dark-mode-black-shadow",
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe("m3-theme/no-hardcoded-box-shadow", () => {
    it("reports hardcoded raw rgba shadow strings in components", async () => {
      const code = `
        import { styled } from "@mui/material/styles";
        export const HardcodedShadowCard = styled("div")({
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        });
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/Card/Card.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-hardcoded-box-shadow",
      );
      expect(violations.length).toBeGreaterThan(0);
    });
  });
});
