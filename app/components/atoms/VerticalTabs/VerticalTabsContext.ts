import { createContext } from "react";
import type { VerticalTabsContextValue } from "./VerticalTabs.types";

export const VerticalTabsContext =
  createContext<VerticalTabsContextValue | null>(null);
