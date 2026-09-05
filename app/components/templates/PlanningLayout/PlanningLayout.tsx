import React from "react";
import { RootContainer } from "./PlanningLayout.styles";
import type { PlanningLayoutProps } from "./PlanningLayout.types";

export function PlanningLayout({
  hero,
  calendar,
  dialogs,
  feedback,
}: PlanningLayoutProps) {
  return (
    <RootContainer>
      {hero}
      {calendar}
      {dialogs}
      {feedback}
    </RootContainer>
  );
}

export default PlanningLayout;
