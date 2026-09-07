import React, { forwardRef, useMemo } from "react";
import { TabsContext } from "./TabsContext";
import type { TabsProps } from "./Tabs.types";
import { StyledTabs } from "./Tabs.styles";

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { orientation = "horizontal", variant, children, ...rest },
  ref,
) {
  const contextValue = useMemo(
    () => ({ orientation, variant }),
    [orientation, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <StyledTabs ref={ref} orientation={orientation} {...rest}>
        {children}
      </StyledTabs>
    </TabsContext.Provider>
  );
});

export const VerticalTabs = forwardRef<HTMLDivElement, TabsProps>(
  function VerticalTabs(props, ref) {
    return <Tabs ref={ref} orientation="vertical" {...props} />;
  },
);

export default Tabs;
