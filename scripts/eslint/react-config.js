import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { forbidElementsRule } from "./restricted-rules.js";

export const reactConfig = {
  files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  rules: {
    // --- React & JSX Best Practices (React 19) ---
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
    "react/jsx-no-target-blank": "error",
    "react/jsx-key": ["error", { checkFragmentShorthand: true }],
    "react/self-closing-comp": "error",
    "react/no-array-index-key": "warn",
    "react/forbid-elements": forbidElementsRule,

    // --- React Hooks ---
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
