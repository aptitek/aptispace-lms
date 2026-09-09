import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import FancySwitch from "../FancySwitch";
import type {
  BadgeAccessSwitchProps,
  AccessStatus,
} from "../FancySwitch.types";
import {
  LockSecureGlyph,
  PeekingBadgeCompanion,
  HoloAccessScanner,
  BadgeScanRippleEffect,
} from "../FancySwitch.glyphs";

function resolveIsUnlocked(
  checked: boolean | undefined,
  status: AccessStatus | undefined,
): boolean {
  if (checked !== undefined) return checked;
  if (status !== undefined) return status === "unlocked";
  return false;
}

export const BadgeAccessSwitch = forwardRef<
  HTMLButtonElement,
  BadgeAccessSwitchProps
>((props, ref) => {
  const {
    status,
    checked,
    onChangeStatus,
    onChange,
    onToggle,
    size = "medium",
    disabled = false,
    className = "",
    "data-testid": dataTestId = "badge-access-switch",
    ...restProps
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("common");
  const isUnlocked = resolveIsUnlocked(checked, status);

  const ariaLabel = isUnlocked
    ? t("badgeAccess.lockDoor", "Badge Access: Unlocked (Click to lock door)")
    : t(
        "badgeAccess.unlockDoor",
        "Badge Access: Locked (Click to present badge & open door)",
      );

  const tooltipTitle = isUnlocked
    ? t("badgeAccess.accessGranted", "Access Granted (Click to lock)")
    : t("badgeAccess.accessLocked", "Access Locked (Click to scan badge)");

  const handleToggle = (nextChecked: boolean) => {
    const nextStatus: AccessStatus = nextChecked ? "unlocked" : "locked";
    onChangeStatus?.(nextStatus);
    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  };

  return (
    <FancySwitch
      ref={ref}
      checked={isUnlocked}
      onChange={handleToggle}
      size={size}
      disabled={disabled}
      ariaLabel={ariaLabel}
      tooltipTitle={tooltipTitle}
      className={className}
      data-testid={dataTestId}
      data-status={isUnlocked ? "unlocked" : "locked"}
      bimodal={true}
      toggleDurationMs={420}
      customThumbColor={() =>
        isUnlocked ? theme.palette.success.main : theme.palette.grey[800]
      }
      customThumbShadow={() =>
        isUnlocked
          ? `0 0 14px ${theme.palette.success.main}, 0 2px 6px rgba(0, 0, 0, 0.3)`
          : "0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
      }
      thumbContent={({ cfg }) => (
        <LockSecureGlyph isUnlocked={isUnlocked} size={cfg.thumbIconSize + 2} />
      )}
      peekingElement={({
        isHovered,
        isToggling,
        toggleDirection,
        cfg,
        disabled: isDis,
      }) => (
        <PeekingBadgeCompanion
          cfg={cfg}
          isUnlocked={isUnlocked}
          isHovered={isHovered && !isDis}
          isScanning={isToggling}
          scanDirection={toggleDirection}
        />
      )}
      backgroundDecorations={({ cfg, isHovered }) => (
        <HoloAccessScanner
          cfg={cfg}
          isUnlocked={isUnlocked}
          isHovered={isHovered && !disabled}
        />
      )}
      overlayDecorations={({ cfg, isToggling }) =>
        isToggling ? (
          <BadgeScanRippleEffect cfg={cfg} isUnlocked={isUnlocked} />
        ) : null
      }
      {...restProps}
    />
  );
});

BadgeAccessSwitch.displayName = "BadgeAccessSwitch";
