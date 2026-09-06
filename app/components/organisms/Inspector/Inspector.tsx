import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";
import type {
  InspectorProps,
  InspectorHeaderProps,
  InspectorBodyProps,
  InspectorActionsProps,
} from "./Inspector.types";
import {
  InspectorContainer,
  InspectorHeaderBox,
  InspectorBodyBox,
  InspectorActionsBox,
} from "./Inspector.styles";

export function InspectorHeader({
  title,
  onClose,
  closeAriaLabel,
  extra,
  "data-testid": testId = "inspector-header",
}: InspectorHeaderProps) {
  const { t } = useTranslation(["common"]);
  const resolvedAriaLabel =
    closeAriaLabel || t("common:inspector.closeAria", "Close inspector");

  return (
    <InspectorHeaderBox data-testid={testId}>
      {typeof title === "string" ? (
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      ) : (
        title
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {extra}
        {onClose && (
          <IconButton
            onClick={onClose}
            size="small"
            aria-label={resolvedAriaLabel}
            data-testid="inspector-close-btn"
          >
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Box>
    </InspectorHeaderBox>
  );
}

export function InspectorBody({
  children,
  gap = 2.5,
  className,
  style,
  "data-testid": testId = "inspector-body",
}: InspectorBodyProps) {
  return (
    <InspectorBodyBox
      gap={gap}
      className={className}
      style={style}
      data-testid={testId}
    >
      {children}
    </InspectorBodyBox>
  );
}

export function InspectorActions({
  children,
  className,
  style,
  "data-testid": testId = "inspector-actions",
}: InspectorActionsProps) {
  return (
    <InspectorActionsBox
      className={className}
      style={style}
      data-testid={testId}
    >
      {children}
    </InspectorActionsBox>
  );
}

export function Inspector({
  children,
  title,
  onClose,
  closeAriaLabel,
  headerExtra,
  maxHeight = "850px",
  className,
  style,
  "data-testid": testId = "inspector-root",
}: InspectorProps) {
  return (
    <InspectorContainer
      variant="outlined"
      maxHeight={maxHeight}
      className={className}
      style={style}
      data-testid={testId}
    >
      {title && (
        <InspectorHeader
          title={title}
          onClose={onClose}
          closeAriaLabel={closeAriaLabel}
          extra={headerExtra}
        />
      )}
      {children}
    </InspectorContainer>
  );
}

Inspector.Header = InspectorHeader;
Inspector.Body = InspectorBody;
Inspector.Actions = InspectorActions;

export default Inspector;
