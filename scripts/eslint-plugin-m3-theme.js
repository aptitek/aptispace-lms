/**
 * ESLint Plugin: eslint-plugin-m3-theme
 * Enforces Material Design 3 design system architecture, dynamic theme awareness,
 * surface containers, dark mode elevation specifications, rounded unfilled icons,
 * and tokenized motion physics (M3_SPRINGS, M3_MOTION_DURATIONS, M3_MOTION_EASINGS).
 */

import { createContainerBackgroundRule } from "./m3-theme-helpers.js";
import { colorRules } from "./m3-theme-color-rules.js";
import { elevationRules } from "./m3-theme-elevation-rules.js";
import { iconRules } from "./m3-theme-icon-rules.js";
import { motionRules } from "./m3-theme-motion-rules.js";
import { shapeRules } from "./m3-theme-shape-rules.js";
import { spacingRules } from "./m3-theme-spacing-rules.js";
import { stateRules } from "./m3-theme-state-rules.js";
import { typographyRules } from "./m3-theme-typography-rules.js";

export const m3ThemePlugin = {
  meta: { name: "eslint-plugin-m3-theme" },
  rules: {
    "no-action-as-container-background": createContainerBackgroundRule(),
    "allowed-container-background": createContainerBackgroundRule(),
    ...colorRules,
    ...elevationRules,
    ...iconRules,
    ...motionRules,
    ...shapeRules,
    ...spacingRules,
    ...stateRules,
    ...typographyRules,
  },
};

export default m3ThemePlugin;
