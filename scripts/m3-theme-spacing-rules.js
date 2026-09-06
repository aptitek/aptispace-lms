/**
 * Material Design 3 ESLint Rules: Spacing, Dimensions & Line Thickness (Strokes)
 *
 * Enforces:
 * 1. M3 8dp baseline grid and granular half-step tokens across padding, margin, and gap.
 * 2. DesignForDucks Spacing Friendship semantic scale (Inseparable -> Strangers).
 * 3. M3 Line thickness / stroke scale (hairline, thin, medium, thick, heavy, expressive).
 */

const APPROVED_SPACING_PIXELS = new Set([
  0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120, 160,
]);

const APPROVED_MUI_MULTIPLIERS = new Set([
  0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 15,
  20,
]);

const SVG_SHAPE_TAGS = new Set([
  "path",
  "circle",
  "line",
  "polyline",
  "polygon",
  "rect",
  "ellipse",
]);

const APPROVED_STROKE_WIDTHS = new Set([0, 0.5, 1, 1.5, 2, 3, 4, 6]);

const APPROVED_KEYWORDS = new Set([
  "0",
  "auto",
  "none",
  "inherit",
  "initial",
  "unset",
  "100%",
  "100vh",
  "100vw",
  "max-content",
  "min-content",
  "fit-content",
]);

const SPACING_PROPERTIES = new Set([
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingInline",
  "paddingInlineStart",
  "paddingInlineEnd",
  "paddingBlock",
  "paddingBlockStart",
  "paddingBlockEnd",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "padding-inline",
  "padding-inline-start",
  "padding-inline-end",
  "padding-block",
  "padding-block-start",
  "padding-block-end",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginInline",
  "marginInlineStart",
  "marginInlineEnd",
  "marginBlock",
  "marginBlockStart",
  "marginBlockEnd",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "margin-inline",
  "margin-inline-start",
  "margin-inline-end",
  "margin-block",
  "margin-block-start",
  "margin-block-end",
  "gap",
  "rowGap",
  "columnGap",
  "row-gap",
  "column-gap",
  "top",
  "bottom",
  "left",
  "right",
  "inset",
]);

const STROKE_PROPERTIES = new Set([
  "borderWidth",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "border-width",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "strokeWidth",
  "stroke-width",
]);

const SCALE_ENTRIES = [
  { name: "none", val: 0 },
  { name: "hairline", val: 2 },
  { name: "micro", val: 4 },
  { name: "compactHalf", val: 6 },
  { name: "compact", val: 8 },
  { name: "mediumHalf", val: 10 },
  { name: "medium", val: 12 },
  { name: "standard", val: 16 },
  { name: "largeHalf", val: 20 },
  { name: "large", val: 24 },
  { name: "extraLarge", val: 32 },
  { name: "sectionHalf", val: 40 },
  { name: "extraExtraLarge", val: 48 },
  { name: "hugeHalf", val: 56 },
  { name: "huge", val: 64 },
  { name: "massive", val: 80 },
  { name: "macro", val: 96 },
  { name: "giant", val: 120 },
  { name: "jumbo", val: 160 },
];

function getClosestSpacingHint(num) {
  if (typeof num !== "number" || isNaN(num)) return "";
  let closest = SCALE_ENTRIES[0];
  let minDiff = Math.abs(num - closest.val);
  for (const entry of SCALE_ENTRIES) {
    const diff = Math.abs(num - entry.val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }
  return ` (closest: 'M3_SPACINGS.${closest.name}' [${closest.val}px])`;
}

export const spacingRules = {
  "enforce-spacing-tokens": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Enforce Material Design 3 Spacing Grid, DesignForDucks Friendship tokens, and Stroke line thickness. Disallow untokenized magic numbers and arbitrary pixel values in padding, margin, gap, and borderWidth.",
      },
      schema: [
        {
          type: "object",
          properties: {
            allowed: { type: "array", items: { type: "string" } },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        noUnapprovedSpacing:
          "Non-standard spacing value '{{value}}' detected{{suggestionHint}}. Use Material Design 3 spacing tokens from '~/tokens/spacing' (e.g. 'M3_SPACINGS.standard' [16px], 'M3_SPACING_FRIENDSHIPS.friends' [16px]) or standard MUI spacing multipliers (e.g. 1, 1.5, 2, 3, 4).",
        noUnapprovedStroke:
          "Non-standard stroke width '{{value}}' detected. Use Material Design 3 stroke tokens from '~/tokens/spacing' (e.g. 'M3_STROKES.thin' [1px], 'M3_STROKES.medium' [2px], 'M3_STROKES.thick' [3px]).",
      },
    },
    create(context) {
      const options = context.options?.[0] || {};
      const allowedList = new Set(options.allowed || []);
      const filename = context.filename || "";

      const isTokenOrTest =
        filename.includes("tokens/spacing") ||
        filename.includes("tokens/theme") ||
        filename.includes(".test.") ||
        filename.includes(".spec.");

      function isAllowed(val) {
        if (val === undefined || val === null) return false;
        const str = String(val).trim();
        return (
          allowedList.has(str) ||
          Array.from(allowedList).some((pat) => pat && str.includes(pat))
        );
      }

      function checkStrokeValue(valNode, reportNode) {
        if (!valNode) return;
        if (valNode.type === "Literal") {
          const raw = valNode.value;
          if (typeof raw === "number") {
            if (APPROVED_STROKE_WIDTHS.has(raw) || isAllowed(raw)) return;
            context.report({
              node: reportNode,
              messageId: "noUnapprovedStroke",
              data: { value: String(raw) },
            });
            return;
          }
          if (typeof raw === "string") {
            const cleanStr = raw.replace(/\s*!important\s*$/i, "").trim();
            if (
              cleanStr.startsWith("var(--") ||
              APPROVED_KEYWORDS.has(cleanStr) ||
              isAllowed(raw) ||
              isAllowed(cleanStr)
            ) {
              return;
            }
            const pxMatch = /^(\d+(?:\.\d+)?)px$/i.exec(cleanStr);
            if (pxMatch && APPROVED_STROKE_WIDTHS.has(parseFloat(pxMatch[1]))) {
              return;
            }
            context.report({
              node: reportNode,
              messageId: "noUnapprovedStroke",
              data: { value: raw },
            });
          }
        }
      }

      function checkSpacingValue(valNode, reportNode) {
        if (!valNode) return;

        if (valNode.type === "Literal" && typeof valNode.value === "number") {
          const num = valNode.value;
          const absNum = Math.abs(num);
          const isMultiplier = APPROVED_MUI_MULTIPLIERS.has(absNum);
          const isPixel = APPROVED_SPACING_PIXELS.has(absNum);
          if (isMultiplier || isPixel || isAllowed(num)) return;

          context.report({
            node: reportNode,
            messageId: "noUnapprovedSpacing",
            data: {
              value: String(num),
              suggestionHint: getClosestSpacingHint(absNum),
            },
          });
          return;
        }

        if (valNode.type === "Literal" && typeof valNode.value === "string") {
          const rawStr = valNode.value.trim().toLowerCase();
          const cleanStr = rawStr.replace(/\s*!important\s*$/i, "").trim();

          if (
            cleanStr.startsWith("var(--") ||
            cleanStr.startsWith("calc(") ||
            APPROVED_KEYWORDS.has(cleanStr) ||
            isAllowed(rawStr) ||
            isAllowed(cleanStr)
          ) {
            return;
          }

          // Single pixel string (e.g. 11px, 13px, -2px, -4px)
          const pxMatch = /^-?(\d+(?:\.\d+)?)px$/i.exec(cleanStr);
          if (pxMatch) {
            const num = parseFloat(pxMatch[1]);
            if (APPROVED_SPACING_PIXELS.has(num)) return;
            context.report({
              node: reportNode,
              messageId: "noUnapprovedSpacing",
              data: {
                value: rawStr,
                suggestionHint: getClosestSpacingHint(num),
              },
            });
            return;
          }

          // Multi-value shorthand (e.g. "8px 16px", "12px 24px", "4px 8px 12px 16px")
          const parts = cleanStr.split(/\s+/).filter(Boolean);
          if (parts.length >= 2 && parts.length <= 4) {
            const allApproved = parts.every((p) => {
              if (APPROVED_KEYWORDS.has(p) || p.startsWith("var(--"))
                return true;
              const m = /^(\d+(?:\.\d+)?)px$/i.exec(p);
              return m ? APPROVED_SPACING_PIXELS.has(parseFloat(m[1])) : false;
            });
            if (allApproved) return;

            context.report({
              node: reportNode,
              messageId: "noUnapprovedSpacing",
              data: {
                value: rawStr,
                suggestionHint: "",
              },
            });
            return;
          }

          if (/\d+px/i.test(cleanStr)) {
            const numMatch = /\d+/i.exec(cleanStr);
            const num = numMatch ? parseInt(numMatch[0], 10) : NaN;
            context.report({
              node: reportNode,
              messageId: "noUnapprovedSpacing",
              data: {
                value: rawStr,
                suggestionHint: getClosestSpacingHint(num),
              },
            });
          }
          return;
        }

        if (valNode.type === "TemplateLiteral") {
          checkTemplateLiteral(valNode, reportNode);
        }
      }

      function checkTemplateLiteral(valNode, reportNode) {
        for (const quasi of valNode.quasis || []) {
          const rawStr = quasi.value?.raw?.trim().toLowerCase();
          if (!rawStr) continue;
          const matches = rawStr.match(/\b\d+px\b/gi) || [];
          for (const m of matches) {
            const num = parseFloat(m);
            const isApproved = APPROVED_SPACING_PIXELS.has(num);
            if (!isApproved && !isAllowed(m) && !isAllowed(num)) {
              context.report({
                node: reportNode,
                messageId: "noUnapprovedSpacing",
                data: {
                  value: m,
                  suggestionHint: getClosestSpacingHint(num),
                },
              });
            }
          }
        }
      }

      return {
        Property(node) {
          if (isTokenOrTest) return;
          const key = node.key?.name || node.key?.value;
          if (SPACING_PROPERTIES.has(key)) {
            checkSpacingValue(node.value, node);
          } else if (STROKE_PROPERTIES.has(key)) {
            checkStrokeValue(node.value, node);
          }
        },

        JSXAttribute(node) {
          if (isTokenOrTest) return;
          const name = node.name?.name;
          if (SPACING_PROPERTIES.has(name)) {
            const val = node.value?.expression || node.value;
            checkSpacingValue(val, node);
          } else if (STROKE_PROPERTIES.has(name)) {
            const parentTagName = node.parent?.name?.name?.toLowerCase();
            if (SVG_SHAPE_TAGS.has(parentTagName)) return;
            const val = node.value?.expression || node.value;
            checkStrokeValue(val, node);
          }
        },
      };
    },
  },
};
