import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";

describe("Material Design 3 ESLint Theming Rules", () => {
  const eslint = new ESLint({
    overrideConfig: [
      {
        rules: {
          "m3-theme/no-action-as-container-background": "error",
          "m3-theme/allowed-theme-colors": [
            "error",
            {
              allowed: ["#00ff66", "rgba(0, 0, 0,"],
            },
          ],
          "m3-theme/no-static-role-colors": "error",
          "m3-theme/no-alpha-paper-surface": "error",
          "m3-theme/no-dark-mode-black-shadow": "error",
          "m3-theme/no-hardcoded-box-shadow": "error",
          "m3-theme/no-raw-svg-icons": "error",
          "m3-theme/enforce-rounded-icons": "error",
        },
      },
    ],
  });

  const customAllowedEslint = new ESLint({
    overrideConfig: [
      {
        rules: {
          "m3-theme/no-action-as-container-background": [
            "error",
            {
              allowed: ["fuchsia", "custom-brand-bg"],
            },
          ],
        },
      },
    ],
  });

  describe("m3-theme/no-action-as-container-background (whitelist enforcement)", () => {
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

    it("reports un-whitelisted container backgrounds", async () => {
      const code = `
        import Box from "@mui/material/Box";
        export function Card() {
          return (
            <Box
              sx={{
                backgroundColor: "fuchsia",
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
      expect(violations[0]?.message).toContain(
        "Container background 'fuchsia' is not in the allowed theme whitelist",
      );
    });

    it("permits approved surface containers and CSS variables", async () => {
      const code = `
        import Box from "@mui/material/Box";
        export function Card() {
          return (
            <Box
              sx={{
                backgroundColor: "surfaceContainerLow",
                color: "var(--custom-color)",
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
      expect(violations).toHaveLength(0);
    });

    it("permits custom background tokens when added to the allowed option", async () => {
      const code = `
        import Box from "@mui/material/Box";
        export function Card() {
          return (
            <Box
              sx={{
                backgroundColor: "fuchsia",
              }}
            />
          );
        }
      `;

      const [result] = await customAllowedEslint.lintText(code, {
        filePath: "app/components/molecules/TestCard/TestCard.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-action-as-container-background",
      );
      expect(violations).toHaveLength(0);
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

  describe("m3-theme/allowed-theme-colors", () => {
    it("reports hardcoded raw colors not present in the allowed whitelist", async () => {
      const code = `
        export const BAD_COLOR = "#ff00aa";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/atoms/Badge/Badge.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/allowed-theme-colors",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Hardcoded color '#ff00aa' is not in the allowed color whitelist",
      );
    });

    it("permits colors present in the allowed whitelist, CSS variables, and keywords", async () => {
      const code = `
        export const BRAND = "#00ff66";
        export const SHADOW = "rgba(0, 0, 0, 0.2)";
        export const VAR_COLOR = "var(--color-primary)";
        export const TRANSPARENT = "transparent";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/atoms/Badge/Badge.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/allowed-theme-colors",
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
        filePath:
          "app/components/molecules/ElevatedCard/ElevatedCard.styles.ts",
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

  describe("m3-theme/no-raw-svg-icons", () => {
    it("reports raw <svg> elements in UI components", async () => {
      const code = `
        export function CustomIcon() {
          return (
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          );
        }
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/atoms/TestIcon/TestIcon.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-raw-svg-icons",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Raw <svg> elements for icons are forbidden",
      );
    });

    it("reports custom icon path variables (_ICON_PATH)", async () => {
      const code = `
        export const SEARCH_ICON_PATH = "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/SearchField/SearchField.styles.ts",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-raw-svg-icons",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain(
        "Hardcoding custom SVG icon path glyphs",
      );
    });

    it("permits raw svg in exempt graphic definitions like ShapeDefs", async () => {
      const code = `
        export function ShapeDefs() {
          return (
            <svg style={{ display: "none" }}>
              <defs><clipPath id="shape" /></defs>
            </svg>
          );
        }
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/atoms/Avatar/ShapeDefs.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/no-raw-svg-icons",
      );
      expect(violations).toHaveLength(0);
    });
  });

  describe("m3-theme/enforce-rounded-icons", () => {
    it("reports sharp non-rounded icon imports from @mui/icons-material", async () => {
      const code = `
        import SearchIcon from "@mui/icons-material/Search";
        import CloseIcon from "@mui/icons-material/Close";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/Test/Test.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/enforce-rounded-icons",
      );
      expect(violations).toHaveLength(2);
      expect(violations[0]?.message).toContain("SearchRounded");
      expect(violations[1]?.message).toContain("CloseRounded");
    });

    it("reports filled icons where outline-rounded variant exists", async () => {
      const code = `
        import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/Test/Test.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/enforce-rounded-icons",
      );
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]?.message).toContain("CheckCircleOutlineRounded");
    });

    it("permits rounded unfilled icons and brand icon exceptions", async () => {
      const code = `
        import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
        import GitHubIcon from "@mui/icons-material/GitHub";
        import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
      `;

      const [result] = await eslint.lintText(code, {
        filePath: "app/components/molecules/Test/Test.tsx",
      });

      const violations = result?.messages.filter(
        (m) => m.ruleId === "m3-theme/enforce-rounded-icons",
      );
      expect(violations).toHaveLength(0);
    });
  });
});
