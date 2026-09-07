import React, { forwardRef, useContext } from "react";
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import { VerticalTabsContext } from "./VerticalTabsContext";
import type {
  VerticalTabProps,
  VerticalTabVariant,
  VerticalTabsContextValue,
} from "./VerticalTabs.types";
import {
  StyledMuiTab,
  TabLabelText,
  TabBadgeSlot,
} from "./VerticalTabs.styles";

const TAB_PROPS_OMIT_KEYS = new Set([
  "variant",
  "compact",
  "extended",
  "size",
  "badge",
  "tooltip",
  "icon",
  "label",
  "testId",
  "data-testid",
]);

function getRestTabProps(props: VerticalTabProps) {
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!TAB_PROPS_OMIT_KEYS.has(key)) {
      rest[key] = value;
    }
  }
  return rest;
}

function resolveTabVariant(
  variant?: VerticalTabVariant,
  compact?: boolean,
  contextVariant?: VerticalTabVariant,
): VerticalTabVariant {
  if (compact) return "compact";
  if (variant) return variant;
  return contextVariant || "default";
}

function resolveSize(size?: number, contextSize?: number): number {
  if (size !== undefined) return size;
  return contextSize ?? 40;
}

function resolveExtended(
  extended?: boolean,
  contextExtended?: boolean,
): boolean {
  if (extended !== undefined) return extended;
  return contextExtended ?? false;
}

function resolveLabels(label?: React.ReactNode, tooltip?: React.ReactNode) {
  return {
    ariaLabel: typeof label === "string" ? label : undefined,
    tooltipContent: tooltip ?? label,
  };
}

function resolveVerticalTabConfig(
  props: VerticalTabProps,
  context: VerticalTabsContextValue | null,
) {
  const resolvedVariant = resolveTabVariant(
    props.variant,
    props.compact,
    context?.variant,
  );
  const resolvedExtended = resolveExtended(props.extended, context?.extended);
  const resolvedSize = resolveSize(props.size, context?.size);
  const testId = props["data-testid"] || props.testId;
  const { ariaLabel, tooltipContent } = resolveLabels(
    props.label,
    props.tooltip,
  );

  return {
    resolvedVariant,
    isCompact: resolvedVariant === "compact",
    resolvedExtended,
    resolvedSize,
    testId,
    ariaLabel,
    tooltipContent,
  };
}

function renderTabLabel(label?: React.ReactNode, badge?: React.ReactNode) {
  if (!label && !badge) return undefined;
  return (
    <>
      {label && <TabLabelText>{label}</TabLabelText>}
      {badge && <TabBadgeSlot>{badge}</TabBadgeSlot>}
    </>
  );
}

export const VerticalTab = forwardRef<HTMLDivElement, VerticalTabProps>(
  function VerticalTab(props, ref) {
    const context = useContext(VerticalTabsContext);
    const config = resolveVerticalTabConfig(props, context);
    const domProps = getRestTabProps(props);

    if (config.isCompact && !config.resolvedExtended) {
      return (
        <Tooltip
          title={config.tooltipContent}
          placement="right"
          arrow
          disableInteractive
        >
          <StyledMuiTab
            ref={ref}
            $variant="compact"
            $extended={false}
            $size={config.resolvedSize}
            icon={props.icon}
            aria-label={config.ariaLabel}
            data-testid={config.testId}
            {...domProps}
          />
        </Tooltip>
      );
    }

    return (
      <StyledMuiTab
        ref={ref}
        $variant={config.resolvedVariant}
        $extended={config.resolvedExtended}
        $size={config.resolvedSize}
        icon={props.icon}
        label={renderTabLabel(props.label, props.badge)}
        aria-label={config.ariaLabel}
        data-testid={config.testId}
        {...domProps}
      />
    );
  },
);

Object.assign(VerticalTab, { muiName: "Tab" });
VerticalTab.displayName = "VerticalTab";

export default VerticalTab;
