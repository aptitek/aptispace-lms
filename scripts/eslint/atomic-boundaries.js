export const boundariesSettings = {
  "boundaries/include": ["app/**/*"],
  "boundaries/elements": [
    { type: "atoms", pattern: "atoms/*", base: "app/components" },
    { type: "molecules", pattern: "molecules/*", base: "app/components" },
    { type: "organisms", pattern: "organisms/*", base: "app/components" },
    { type: "templates", pattern: "templates/*", base: "app/components" },
    { type: "pages", pattern: "routes/**", base: "app" },
    { type: "tokens", pattern: "tokens/*", base: "app" },
    {
      type: "shared",
      pattern: "{utils,i18n,config,services,db}/*",
      base: "app",
    },
  ],
};

export const boundariesRule = [
  "error",
  {
    default: "disallow",
    policies: [
      {
        from: { element: { type: "tokens" } },
        allow: [{ to: { element: { type: ["tokens", "shared"] } } }],
      },
      {
        from: { element: { type: "atoms" } },
        allow: [{ to: { element: { type: ["atoms", "tokens", "shared"] } } }],
      },
      {
        from: { element: { type: "molecules" } },
        allow: [
          {
            to: {
              element: {
                type: ["molecules", "atoms", "tokens", "shared"],
              },
            },
          },
        ],
      },
      {
        from: { element: { type: "organisms" } },
        allow: [
          {
            to: {
              element: {
                type: ["organisms", "molecules", "atoms", "tokens", "shared"],
              },
            },
          },
        ],
      },
      {
        from: { element: { type: "templates" } },
        allow: [
          {
            to: {
              element: {
                type: [
                  "templates",
                  "organisms",
                  "molecules",
                  "atoms",
                  "tokens",
                  "shared",
                ],
              },
            },
          },
        ],
      },
      {
        from: { element: { type: "pages" } },
        allow: [
          {
            to: {
              element: {
                type: [
                  "pages",
                  "templates",
                  "organisms",
                  "molecules",
                  "atoms",
                  "tokens",
                  "shared",
                ],
              },
            },
          },
        ],
      },
      {
        from: { element: { type: "shared" } },
        allow: [{ to: { element: { type: ["shared", "tokens"] } } }],
      },
    ],
  },
];

export const atomicHierarchyConfigs = [
  {
    files: ["app/tokens/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/components/**",
                "../components/**",
                "../../components/**",
                "~/components/**",
                "**/routes/**",
                "~/routes/**",
              ],
              message:
                "Atomic Design Violation: Tier 0 Tokens cannot import from Components or Routes.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/atoms/**", "stories/atoms/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/molecules/**",
                "**/organisms/**",
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../molecules/**",
                "../organisms/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/molecules/**",
                "~/components/organisms/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Atoms cannot import from Molecules, Organisms, Templates, or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/molecules/**", "stories/molecules/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/organisms/**",
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../organisms/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/organisms/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Molecules cannot import from Organisms, Templates, or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/organisms/**", "stories/organisms/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/templates/**",
                "**/routes/**",
                "**/pages/**",
                "../templates/**",
                "../../routes/**",
                "../../pages/**",
                "~/components/templates/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Organisms cannot import from Templates or Pages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["app/components/templates/**", "stories/templates/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/routes/**",
                "**/pages/**",
                "../../routes/**",
                "../../pages/**",
                "~/routes/**",
                "~/pages/**",
              ],
              message:
                "Atomic Design Violation: Templates cannot import from Pages/Routes.",
            },
          ],
        },
      ],
    },
  },
];
