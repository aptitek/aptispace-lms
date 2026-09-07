import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

export interface PlanningSidepanelActionProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onOpenExport: () => void;
}

export function PlanningSidepanelAction({
  containerRef,
  onOpenExport,
}: PlanningSidepanelActionProps) {
  const { t } = useTranslation("common");
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const updatePortalTarget = () => {
      const miniCalendar = root.querySelector(".MuiEventCalendar-miniCalendar");
      if (!miniCalendar || !miniCalendar.parentElement) {
        setPortalTarget(null);
        return;
      }

      let mount = root.querySelector<HTMLElement>(
        "#planning-sidepanel-action-mount",
      );
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "planning-sidepanel-action-mount";
        mount.style.width = "100%";
        miniCalendar.after(mount);
      }
      setPortalTarget(mount);
    };

    updatePortalTarget();

    const observer = new MutationObserver(() => {
      updatePortalTarget();
    });

    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const existingMount = root.querySelector(
        "#planning-sidepanel-action-mount",
      );
      if (existingMount) {
        existingMount.remove();
      }
    };
  }, [containerRef]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <Box
      sx={{
        px: 2,
        pb: 1.5,
        pt: 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Button
        variant="outlined"
        size="small"
        fullWidth
        startIcon={<LinkRoundedIcon />}
        onClick={onOpenExport}
        data-testid="planning-sidepanel-export-btn"
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          py: 0.75,
          fontSize: "0.8125rem",
          borderColor: (theme) => alpha(theme.palette.divider, 0.4),
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        {t("planning.subscribeExport", "Subscribe / Export iCal")}
      </Button>
    </Box>,
    portalTarget,
  );
}
