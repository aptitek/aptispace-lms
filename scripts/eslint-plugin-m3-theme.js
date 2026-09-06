/**
 * ESLint Plugin: eslint-plugin-m3-theme
 * Enforces Material Design 3 design system architecture, dynamic theme awareness,
 * surface containers, and dark mode elevation specifications.
 */

function isInteractiveContext(node) {
  let current = node.parent;
  while (current) {
    if (current.type === "Property") {
      const key = current.key.name || current.key.value;
      if (typeof key === "string" && isInteractiveKey(key)) {
        return true;
      }
    } else if (current.type === "VariableDeclarator" && current.id?.name) {
      if (/Ripple|StateLayer/i.test(current.id.name)) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

function isInteractiveKey(key) {
  return (
    key.startsWith("&:") ||
    key.startsWith("&.") ||
    key.startsWith("&[") ||
    key.includes(":hover") ||
    key.includes(":focus") ||
    key.includes(":active") ||
    key.includes(".Mui-selected") ||
    key.includes(".Mui-disabled") ||
    key.includes(".Mui-focusVisible") ||
    /^(hover|focus|active|disabled|selected)$/.test(key)
  );
}

function extractActionToken(node) {
  if (!node) return null;
  if (
    node.type === "Literal" &&
    typeof node.value === "string" &&
    /^action\.(hover|selected|disabledBackground|focus)$/.test(node.value)
  ) {
    return node.value;
  }
  if (
    node.type === "MemberExpression" &&
    node.property?.name &&
    /^(hover|selected|disabledBackground|focus)$/.test(node.property.name)
  ) {
    if (node.object?.property?.name === "action") {
      return `action.${node.property.name}`;
    }
  }
  if (
    node.type === "CallExpression" &&
    node.callee?.name === "alpha" &&
    node.arguments?.[0]
  ) {
    return extractActionToken(node.arguments[0]);
  }
  if (node.type === "LogicalExpression") {
    return extractActionToken(node.right) || extractActionToken(node.left);
  }
  if (node.type === "ArrowFunctionExpression" && node.body) {
    return extractActionToken(node.body);
  }
  return null;
}

function hasBackdropFilter(objectNode) {
  if (!objectNode || objectNode.type !== "ObjectExpression") return false;
  return objectNode.properties.some((prop) => {
    if (prop.type === "Property") {
      const name = prop.key?.name || prop.key?.value;
      return name === "backdropFilter" || name === "WebkitBackdropFilter";
    }
    return false;
  });
}

function isAlphaPaperCall(node) {
  if (!node) return false;
  if (node.type === "CallExpression" && node.callee?.name === "alpha") {
    const firstArg = node.arguments?.[0];
    if (
      firstArg?.type === "MemberExpression" &&
      firstArg.property &&
      /^(paper|default)$/.test(firstArg.property.name)
    ) {
      return true;
    }
  }
  if (node.type === "ArrowFunctionExpression" && node.body) {
    return isAlphaPaperCall(node.body);
  }
  return false;
}

function isInsideApplyStylesDark(node) {
  let current = node.parent;
  while (current) {
    if (
      current.type === "CallExpression" &&
      current.callee?.property?.name === "applyStyles" &&
      current.arguments?.[0]?.value === "dark"
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export const m3ThemePlugin = {
  meta: {
    name: "eslint-plugin-m3-theme",
  },
  rules: {
    "no-action-as-container-background": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow using action overlay tokens (action.hover, action.selected, etc.) as container backgrounds.",
        },
        messages: {
          noActionBackground:
            "Action token '{{token}}' is an interactive state overlay, not a surface container. Use Material Design 3 surface containers (e.g. 'theme.palette.surfaceContainer', 'surfaceContainerLow', 'surfaceContainerHigh') instead.",
        },
      },
      create(context) {
        return {
          Property(node) {
            const key = node.key?.name || node.key?.value;
            if (key !== "backgroundColor" && key !== "bgcolor") return;
            if (isInteractiveContext(node)) return;

            const token = extractActionToken(node.value);
            if (token) {
              context.report({
                node,
                messageId: "noActionBackground",
                data: { token },
              });
            }
          },
          JSXAttribute(node) {
            const name = node.name?.name;
            if (name !== "bgcolor" && name !== "backgroundColor") return;
            const token =
              extractActionToken(node.value) ||
              extractActionToken(node.value?.expression);
            if (token) {
              context.report({
                node,
                messageId: "noActionBackground",
                data: { token },
              });
            }
          },
        };
      },
    },

    "no-static-role-colors": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow direct references to static ROLE_COLORS. Use dynamic theme.palette.roles.",
        },
        messages: {
          noStaticRoleColors:
            "Static '{{name}}' is forbidden in UI components. Use 'theme.palette.roles' from the MUI theme to ensure full compatibility with dynamic theming and debug theme switching.",
        },
      },
      create(context) {
        return {
          ImportSpecifier(node) {
            if (
              node.imported?.name === "ROLE_COLORS" ||
              node.imported?.name === "DEFAULT_ROLE_COLORS"
            ) {
              context.report({
                node,
                messageId: "noStaticRoleColors",
                data: { name: node.imported.name },
              });
            }
          },
          Identifier(node) {
            if (
              node.name === "ROLE_COLORS" ||
              node.name === "DEFAULT_ROLE_COLORS"
            ) {
              const parentType = node.parent?.type;
              if (
                parentType !== "ImportSpecifier" &&
                parentType !== "ExportSpecifier" &&
                parentType !== "TSInterfaceDeclaration" &&
                parentType !== "TSTypeAliasDeclaration"
              ) {
                context.report({
                  node,
                  messageId: "noStaticRoleColors",
                  data: { name: node.name },
                });
              }
            }
          },
        };
      },
    },

    "no-alpha-paper-surface": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow arbitrary alpha on background.paper/default without a backdropFilter.",
        },
        messages: {
          noAlphaPaper:
            "Arbitrary opacity on background.paper/default is forbidden for container surfaces. Use Material Design 3 surface container tokens ('theme.palette.surfaceContainerLow', 'surfaceContainer', etc.) instead.",
        },
      },
      create(context) {
        return {
          Property(node) {
            const key = node.key?.name || node.key?.value;
            if (key !== "backgroundColor" && key !== "bgcolor") return;
            if (!isAlphaPaperCall(node.value)) return;

            const parentObject =
              node.parent?.type === "ObjectExpression" ? node.parent : null;
            if (parentObject && !hasBackdropFilter(parentObject)) {
              context.report({
                node,
                messageId: "noAlphaPaper",
              });
            }
          },
        };
      },
    },

    "no-dark-mode-black-shadow": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow black drop-shadows in dark mode. Elevation in dark theme uses surface containers or perimeter highlight rings.",
        },
        messages: {
          noDarkBlackShadow:
            "Dark mode elevation violation: Black drop-shadows are forbidden in dark mode. Use surface container elevation tones or perimeter highlight rings ('0 0 0 1px ...') per Material Design 3 elevation spec.",
        },
      },
      create(context) {
        return {
          Property(node) {
            const key = node.key?.name || node.key?.value;
            if (key !== "boxShadow" && key !== "filter") return;
            if (!isInsideApplyStylesDark(node)) return;

            const rawVal = context.sourceCode
              ? context.sourceCode.getText(node.value)
              : "";
            if (
              /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/i.test(rawVal) ||
              /common\.black/i.test(rawVal)
            ) {
              context.report({
                node,
                messageId: "noDarkBlackShadow",
              });
            }
          },
        };
      },
    },

    "no-hardcoded-box-shadow": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Disallow raw shadow strings in component styles. Use theme.shadows[...] instead.",
        },
        messages: {
          noHardcodedShadow:
            "Hardcoded boxShadow string detected. Use '(theme) => theme.shadows[1]' or semantic elevation tokens to support proper dark-mode elevation.",
        },
      },
      create(context) {
        return {
          Property(node) {
            const key = node.key?.name || node.key?.value;
            if (key !== "boxShadow") return;
            if (
              node.value?.type === "Literal" &&
              typeof node.value.value === "string" &&
              /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/i.test(node.value.value)
            ) {
              context.report({
                node,
                messageId: "noHardcodedShadow",
              });
            }
          },
        };
      },
    },
  },
};

export default m3ThemePlugin;
