import sonarjs from "eslint-plugin-sonarjs";

export const sonarConfig = {
  ...sonarjs.configs.recommended,
  files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  rules: {
    ...sonarjs.configs.recommended.rules,
    "sonarjs/cognitive-complexity": ["error", 20],
    "sonarjs/no-duplicate-string": ["warn", { threshold: 10 }],
    "sonarjs/no-identical-functions": "warn",
    "sonarjs/no-nested-conditional": "off",
    "sonarjs/pseudo-random": "off",
    "sonarjs/use-type-alias": "off",
    "sonarjs/redundant-type-aliases": "error",
    "sonarjs/no-hardcoded-ip": "warn",
    "sonarjs/super-linear-regex": "off",
    "sonarjs/regex-complexity": "off",
  },
};
