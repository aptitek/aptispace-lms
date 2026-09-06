import { describe, it, expect } from "vitest";
import { ESLint } from "eslint";

const spacingEslint = new ESLint({
  overrideConfig: [
    {
      rules: {
        "m3-theme/enforce-spacing-tokens": "error",
      },
    },
  ],
});

const spacingAllowedEslint = new ESLint({
  overrideConfig: [
    {
      rules: {
        "m3-theme/enforce-spacing-tokens": [
          "error",
          { allowed: ["11px", "77"] },
        ],
      },
    },
  ],
});

describe("m3-theme/enforce-spacing-tokens", () => {
  it("reports violations on non-standard numeric and string padding, margin, and gap", async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return (
    <Box sx={{ p: 11, gap: "13px" }}>
      <div style={{ margin: "35px" }} />
    </Box>
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: "app/components/molecules/TestCard/TestCard.tsx",
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === "m3-theme/enforce-spacing-tokens",
    );
    expect(violations).toHaveLength(3);
    expect(violations[0]?.message).toContain("Non-standard spacing value '11'");
    expect(violations[0]?.message).toContain("M3_SPACINGS.medium");
    expect(violations[1]?.message).toContain(
      "Non-standard spacing value '13px'",
    );
    expect(violations[2]?.message).toContain(
      "Non-standard spacing value '35px'",
    );
  });

  it("reports violations on non-standard stroke widths", async () => {
    const code = `import Box from "@mui/material/Box";
export function Card() {
  return <Box sx={{ borderWidth: 7 }}><div style={{ borderWidth: "5px" }} /></Box>;
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: "app/components/molecules/TestCard/TestCard.tsx",
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === "m3-theme/enforce-spacing-tokens",
    );
    expect(violations).toHaveLength(2);
    expect(violations[0]?.message).toContain("Non-standard stroke width '7'");
    expect(violations[1]?.message).toContain("Non-standard stroke width '5px'");
  });

  it("permits standard M3 spacing numbers, MUI multipliers, and CSS custom properties", async () => {
    const code = `import Box from "@mui/material/Box";
import { M3_SPACINGS, M3_SPACING_FRIENDSHIPS } from "~/tokens/spacing";
export function Card() {
  return (
    <Box
      sx={{
        p: 2,
        gap: 1.5,
        m: "16px",
        paddingTop: M3_SPACINGS.large,
        paddingBottom: M3_SPACING_FRIENDSHIPS.bestFriends,
        margin: "8px 16px",
        rowGap: "var(--md-sys-spacing-standard)",
      }}
    />
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: "app/components/molecules/TestCard/TestCard.tsx",
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === "m3-theme/enforce-spacing-tokens",
    );
    expect(violations).toHaveLength(0);
  });

  it("permits standard M3 stroke widths and border styles", async () => {
    const code = `import Box from "@mui/material/Box";
import { M3_STROKES } from "~/tokens/spacing";
export function Card() {
  return (
    <Box
      sx={{
        borderWidth: M3_STROKES.thin,
        borderTopWidth: 2,
        borderBottomWidth: "0.5px",
        borderRightWidth: "var(--md-sys-stroke-medium)",
      }}
    />
  );
}`;
    const [result] = await spacingEslint.lintText(code, {
      filePath: "app/components/molecules/TestCard/TestCard.tsx",
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === "m3-theme/enforce-spacing-tokens",
    );
    expect(violations).toHaveLength(0);
  });

  it("permits custom spacing when added to the allowed whitelist option", async () => {
    const code = `export function Card() {
  return <div style={{ padding: "11px", margin: 77 }} />;
}`;
    const [result] = await spacingAllowedEslint.lintText(code, {
      filePath: "app/components/molecules/TestCard/TestCard.tsx",
    });
    const violations = result?.messages.filter(
      (m) => m.ruleId === "m3-theme/enforce-spacing-tokens",
    );
    expect(violations).toHaveLength(0);
  });
});
