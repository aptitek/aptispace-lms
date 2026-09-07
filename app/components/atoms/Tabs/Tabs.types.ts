import type { ReactNode } from "react";
import type { TabsProps as MuiTabsProps } from "@mui/material/Tabs";
import type { TabProps as MuiTabProps } from "@mui/material/Tab";

export type TabVariant = "standard" | "vertical";

export interface TabsContextValue {
  orientation: "horizontal" | "vertical";
  variant?: TabVariant;
}

export interface TabsProps extends Omit<
  MuiTabsProps,
  "orientation" | "variant"
> {
  orientation?: "horizontal" | "vertical";
  variant?: TabVariant;
}

export interface TabProps extends Omit<MuiTabProps, "icon"> {
  variant?: TabVariant;
  icon?: ReactNode;
  badge?: ReactNode;
  extended?: boolean;
}
