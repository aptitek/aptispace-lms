import React, { forwardRef, useContext } from "react";
import Box from "@mui/material/Box";
import { TabsContext } from "./TabsContext";
import type { TabProps, TabVariant, TabsContextValue } from "./Tabs.types";
import {
  StyledTab,
  TabLabelSlot,
  TabBadgeSlot,
  TabIconSlot,
} from "./Tabs.styles";

function resolveVariant(
  variantProp?: TabVariant,
  context?: TabsContextValue | null,
): TabVariant {
  if (variantProp) return variantProp;
  if (context?.variant) return context.variant;
  if (context?.orientation === "vertical") return "vertical";
  return "standard";
}

function renderVerticalLabel(
  label?: React.ReactNode,
  badge?: React.ReactNode,
  extended?: boolean,
) {
  return (
    <>
      {label !== undefined && label !== null && (
        <TabLabelSlot className="MuiTab-labelSlot" $extended={extended}>
          {label}
        </TabLabelSlot>
      )}
      {badge !== undefined && badge !== null && (
        <TabBadgeSlot className="MuiTab-badgeSlot" $extended={extended}>
          {badge}
        </TabBadgeSlot>
      )}
    </>
  );
}

function renderStandardLabel(label?: React.ReactNode, badge?: React.ReactNode) {
  if (!badge) return label;
  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
    >
      <span>{label}</span>
      {badge}
    </Box>
  );
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  {
    variant: variantProp,
    label,
    badge,
    icon,
    extended,
    iconPosition,
    className,
    ...rest
  },
  ref,
) {
  const context = useContext(TabsContext);
  const variant = resolveVariant(variantProp, context);
  const isVertical = variant === "vertical";

  const renderedLabel = isVertical
    ? renderVerticalLabel(label, badge, extended)
    : renderStandardLabel(label, badge);

  const renderedIcon =
    isVertical && icon ? (
      <TabIconSlot className="MuiTab-iconSlot">{icon}</TabIconSlot>
    ) : (
      (icon as React.ReactElement)
    );

  return (
    <StyledTab
      ref={ref}
      $variant={variant}
      icon={renderedIcon}
      iconPosition={isVertical ? "start" : (iconPosition ?? "start")}
      label={renderedLabel}
      className={className}
      {...rest}
    />
  );
});

export const VerticalTab = forwardRef<HTMLDivElement, TabProps>(
  function VerticalTab(props, ref) {
    return <Tab ref={ref} variant="vertical" {...props} />;
  },
);

export default Tab;
