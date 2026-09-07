import React, { forwardRef, useMemo } from "react";
import { VerticalTabsContext } from "./VerticalTabsContext";
import type { VerticalTabsProps } from "./VerticalTabs.types";
import { StyledMuiTabs } from "./VerticalTabs.styles";

export const VerticalTabs = forwardRef<HTMLDivElement, VerticalTabsProps>(
  function VerticalTabs(props, ref) {
    const {
      variant = "default",
      compact,
      extended = false,
      size = 40,
      testId,
      "data-testid": dataTestId,
      children,
      ...rest
    } = props;

    const resolvedVariant = compact ? "compact" : variant;

    const contextValue = useMemo(
      () => ({
        variant: resolvedVariant,
        extended,
        size,
      }),
      [resolvedVariant, extended, size],
    );

    return (
      <VerticalTabsContext.Provider value={contextValue}>
        <StyledMuiTabs
          ref={ref}
          orientation="vertical"
          $variant={resolvedVariant}
          $extended={extended}
          $size={size}
          data-testid={dataTestId || testId || "vertical-tabs"}
          {...rest}
        >
          {children}
        </StyledMuiTabs>
      </VerticalTabsContext.Provider>
    );
  },
);

Object.assign(VerticalTabs, { muiName: "Tabs" });
VerticalTabs.displayName = "VerticalTabs";

export default VerticalTabs;
