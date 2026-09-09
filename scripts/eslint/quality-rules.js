export const qualityConfig = {
  files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  rules: {
    // --- File Size & Clean Code (Hard 500 lines limit) ---
    "max-lines": [
      "error",
      {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    // --- TypeScript Strictness ---
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],

    // --- Single Responsibility Principle (SRP) & Clean Code ---
    complexity: ["error", 10],
    "max-depth": ["error", 4],
    "max-params": ["error", 4],
    "max-nested-callbacks": ["error", 3],
    "id-denylist": [
      "error",
      "data",
      "data2",
      "temp",
      "tmp",
      "item",
      "obj",
      "val",
      "res",
      "req",
      "cb",
      "el",
      "elem",
      "foo",
      "bar",
      "info",
      "manager",
      "helper",
      "isNestedInShell",
      "physicCard",
      "PhysicCard",
    ],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-duplicate-imports": "error",
  },
};
