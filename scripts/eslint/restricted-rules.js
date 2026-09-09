export const forbidElementsRule = [
  "error",
  {
    forbid: [
      {
        element: "button",
        message:
          "Use <Button>, <IconButton>, or <HoldButton> from @mui/material or atoms instead.",
      },
      {
        element: "input",
        message: "Use <TextField> from @mui/material or <EmailField> instead.",
      },
      {
        element: "select",
        message:
          "Use <Select> or <TextField select> from @mui/material instead.",
      },
      {
        element: "textarea",
        message: "Use <TextField multiline> from @mui/material instead.",
      },
      {
        element: "img",
        message: 'Use <Box component="img"> or <Avatar> instead.',
      },
      {
        element: "a",
        message: 'Use React Router\'s <Link> or <Button href="..."> instead.',
      },
    ],
  },
];

export const restrictedImportsRule = [
  "error",
  {
    paths: [
      {
        name: "@mui/material",
        importNames: ["styled"],
        message:
          "Please import `styled` from `@mui/material/styles` to enforce theme-aware primitives.",
      },
      {
        name: "@emotion/styled",
        message:
          "Please use `styled` from `@mui/material/styles` to ensure direct access to MUI theme tokens.",
      },
      {
        name: "@tailwindcss/vite",
        message:
          "Tailwind CSS has been completely removed in favor of Material Design 3 tokens.",
      },
      {
        name: "tailwindcss",
        message:
          "Tailwind CSS has been completely removed in favor of Material Design 3 tokens.",
      },
      {
        name: "~/components/molecules/PhysicCard",
        message:
          "Misspelling: 'PhysicCard' is deprecated. Import 'PhysicsCard' from '~/components/molecules/PhysicsCard' instead.",
      },
      {
        name: "~/components/molecules/MapSheet",
        message:
          "Atomic Design violation: MapSheet is an Organism. Import from '~/components/organisms/MapCard' instead.",
      },
      {
        name: "~/components/molecules/MapCard",
        message:
          "Atomic Design violation: MapCard is an Organism. Import from '~/components/organisms/MapCard' instead.",
      },
      {
        name: "~/components/molecules/TimeSheet",
        message:
          "Atomic Design violation: TimeSheet is an Organism. Import from '~/components/organisms/ClockCard' instead.",
      },
      {
        name: "~/components/molecules/ClockCard",
        message:
          "Atomic Design violation: ClockCard is an Organism. Import from '~/components/organisms/ClockCard' instead.",
      },
      {
        name: "~/components/molecules/CalendarSheet",
        message:
          "Atomic Design violation: CalendarSheet is an Organism. Import from '~/components/organisms/CalendarCard' instead.",
      },
      {
        name: "~/components/molecules/CalendarCard",
        message:
          "Atomic Design violation: CalendarCard is an Organism. Import from '~/components/organisms/CalendarCard' instead.",
      },
      {
        name: "~/components/atoms/Avatar/shapes",
        message:
          "Decoupling violation: Shapes mathematical engine lives in Tier 0 tokens. Import from '~/tokens/shapes' instead.",
      },
    ],
    patterns: [
      {
        group: ["@mui/material/internal_*"],
        message: "Do not import private/internal MUI APIs.",
      },
      {
        group: [
          "**/molecules/PhysicCard**",
          "../molecules/PhysicCard**",
          "../../molecules/PhysicCard**",
        ],
        message:
          "Misspelling: 'PhysicCard' is deprecated. Import 'PhysicsCard' from '~/components/molecules/PhysicsCard' instead.",
      },
      {
        group: [
          "**/molecules/MapSheet**",
          "**/molecules/MapCard**",
          "**/molecules/TimeSheet**",
          "**/molecules/ClockCard**",
          "**/molecules/CalendarSheet**",
          "**/molecules/CalendarCard**",
          "../molecules/MapSheet**",
          "../molecules/MapCard**",
          "../molecules/TimeSheet**",
          "../molecules/ClockCard**",
          "../molecules/CalendarSheet**",
          "../molecules/CalendarCard**",
          "../../molecules/MapSheet**",
          "../../molecules/MapCard**",
          "../../molecules/TimeSheet**",
          "../../molecules/ClockCard**",
          "../../molecules/CalendarSheet**",
          "../../molecules/CalendarCard**",
        ],
        message:
          "Atomic Design violation: MapCard, ClockCard, and CalendarCard are Organisms. Import them from '~/components/organisms/*' instead.",
      },
      {
        group: [
          "**/atoms/Avatar/shapes**",
          "../atoms/Avatar/shapes**",
          "../../atoms/Avatar/shapes**",
        ],
        message:
          "Decoupling violation: Shapes mathematical engine lives in Tier 0 tokens. Import from '~/tokens/shapes' instead.",
      },
    ],
  },
];

export const restrictedSyntaxRule = [
  "error",
  {
    selector:
      "JSXAttribute[name.name='style'] > JSXExpressionContainer > ObjectExpression",
    message:
      "Raw inline `style={{ ... }}` is forbidden. Use MUI `styled()` primitives or theme-aware `sx` design tokens.",
  },
  {
    selector:
      "JSXAttribute[name.name='className'] > Literal[value=/(!size-|flex-col|items-center|justify-between)/]",
    message:
      "Tailwind utility syntax is forbidden in className. Use MUI styled() primitives, theme-aware sx, or MD3 component tokens.",
  },
  {
    selector: "JSXAttribute[name.name='isNestedInShell']",
    message:
      "Dead prop 'isNestedInShell' is forbidden. Shell layout is handled exclusively via Template tier layouts.",
  },
  {
    selector:
      "MemberExpression[object.property.name='palette'][property.name='mode']",
    message:
      "Do not read `theme.palette.mode` directly. Use CSS variables or MUI's `theme.applyStyles('dark', ...)` to avoid hydration mismatches and inline conditionals.",
  },
  {
    selector: "MemberExpression[object.name='SOLARIZED_BASE']",
    message:
      "Do not access `SOLARIZED_BASE` directly. Use CSS variables or theme-level semantic tokens instead of low-level color primitives.",
  },
  {
    selector: "Identifier[name=/^(ROLE_COLORS|DEFAULT_ROLE_COLORS)$/]",
    message:
      "Static `ROLE_COLORS` is forbidden in UI code. Use `theme.palette.roles` from the MUI theme to support dynamic theming and debug modes.",
  },
];
