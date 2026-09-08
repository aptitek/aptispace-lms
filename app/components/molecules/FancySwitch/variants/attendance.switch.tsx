import React, { forwardRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import FancySwitch from "../FancySwitch";
import type {
  AttendanceSwitchProps,
  AttendanceMode,
} from "../FancySwitch.types";
import {
  MapPinDrop,
  RemoteHomeGlyph,
  HoloNetworkSilhouette,
  PeekingPedestrianCompanion,
} from "../FancySwitch.glyphs";

function resolveIsInPerson(
  checked: boolean | undefined,
  mode: AttendanceMode | undefined,
): boolean {
  if (checked !== undefined) return checked;
  if (mode !== undefined) return mode === "in-person";
  return true;
}

export const AttendanceSwitch = forwardRef<
  HTMLButtonElement,
  AttendanceSwitchProps
>((props, ref) => {
  const {
    mode,
    checked,
    onChangeMode,
    onChange,
    onToggle,
    size = "medium",
    disabled = false,
    className = "",
    "data-testid": dataTestId = "attendance-switch",
    ...restProps
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("common");
  const isInPerson = resolveIsInPerson(checked, mode);

  const ariaLabel = isInPerson
    ? t("attendance.switchToRemote", "Switch to Remote mode")
    : t("attendance.switchToInPerson", "Switch to In-person mode");

  const tooltipTitle = isInPerson
    ? t("attendance.inPerson", "In-Person (Click for Remote)")
    : t("attendance.remote", "Remote (Click for In-Person)");

  const handleToggle = (nextChecked: boolean) => {
    const nextMode: AttendanceMode = nextChecked ? "in-person" : "remote";
    onChangeMode?.(nextMode);
    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  };

  return (
    <FancySwitch
      ref={ref}
      checked={isInPerson}
      onChange={handleToggle}
      size={size}
      disabled={disabled}
      ariaLabel={ariaLabel}
      tooltipTitle={tooltipTitle}
      className={className}
      data-testid={dataTestId}
      data-mode={isInPerson ? "in-person" : "remote"}
      bimodal={true}
      toggleDurationMs={380}
      customThumbColor={() =>
        isInPerson
          ? theme.palette.success.main
          : theme.palette.info.main || theme.palette.primary.main
      }
      thumbContent={({ cfg }) => (
        <AnimatePresence mode="wait" initial={false}>
          {isInPerson ? (
            <MapPinDrop size={cfg.thumbIconSize + 4} />
          ) : (
            <RemoteHomeGlyph size={cfg.thumbIconSize + 3} />
          )}
        </AnimatePresence>
      )}
      peekingElement={({
        isHovered,
        isToggling,
        toggleDirection,
        cfg,
        disabled: isDis,
      }) => (
        <PeekingPedestrianCompanion
          cfg={cfg}
          isInPerson={isInPerson}
          isHovered={isHovered && !isDis}
          isWalking={isToggling}
          walkDirection={toggleDirection}
        />
      )}
      backgroundDecorations={({ cfg, isHovered }) => (
        <HoloNetworkSilhouette
          cfg={cfg}
          isInPerson={isInPerson}
          isHovered={isHovered && !disabled}
        />
      )}
      {...restProps}
    />
  );
});

AttendanceSwitch.displayName = "AttendanceSwitch";
