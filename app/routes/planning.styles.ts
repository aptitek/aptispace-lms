import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";

export const RootContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: theme.spacing(4, 3),
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
    gap: theme.spacing(2),
  },
}));

export const HeroCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3, 3.5),
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  backdropFilter: "blur(16px)",
  boxShadow: "0 12px 32px -10px rgba(0, 0, 0, 0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2.5),
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    boxShadow: "0 16px 40px -12px rgba(0, 0, 0, 0.35)",
  }),
}));

export const DEVICES_ICON_PATH =
  "M4 7c0-.55.45-1 1-1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v11h-.5c-.83 0-1.5.67-1.5 1.5S.67 20 1.5 20H14v-3H4zm19 1h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1m-1 9h-4v-7h4z";

export const LOCATION_ICON_PATH =
  "M12 2c-4.2 0-8 3.22-8 8.2 0 3.18 2.45 6.92 7.34 11.23.38.33.95.33 1.33 0C17.55 17.12 20 13.38 20 10.2 20 5.22 16.2 2 12 2m0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2";

export function createSvgDataUri(path: string, fill = "#ffffff"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}"><path d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const CalendarFrame = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";
  return {
    position: "relative",
    borderRadius: "24px",
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
    backdropFilter: "blur(16px)",
    boxShadow: "0 16px 40px -12px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    minHeight: "720px",
    "& .MuiEventCalendar-root": {
      borderRadius: "24px",
      border: "none",
    },
    "& .MuiEventCalendar-headerToolbarSidePanelToggle svg, & .MuiEventCalendar-preferencesMenuButton svg":
      {
        pointerEvents: "none",
      },
    "& .MuiEventCalendar-headerToolbar": {
      position: "relative",
      zIndex: 10,
      overflow: "visible !important",
    },
    "& .MuiEventCalendar-headerToolbarActions": {
      position: "relative",
      overflow: "visible !important",
    },
    "& .MuiEventCalendar-preferencesMenu": {
      position: "relative",
      overflow: "visible !important",
    },
    "& .MuiEventCalendar-preferencesMenuList": {
      position: "absolute !important",
      inset: "auto !important",
      top: "100% !important",
      right: "0 !important",
      left: "auto !important",
      bottom: "auto !important",
      width: "0 !important",
      height: "0 !important",
      overflow: "visible !important",
      zIndex: 1300,
    },
    "& .MuiEventCalendar-preferencesMenuList .MuiBackdrop-root": {
      position: "fixed !important",
      top: "-100vh !important",
      left: "-100vw !important",
      width: "300vw !important",
      height: "300vh !important",
    },
    "& .MuiEventCalendar-preferencesMenuList .MuiPopover-paper": {
      position: "absolute !important",
      top: "8px !important",
      right: "0 !important",
      left: "auto !important",
      bottom: "auto !important",
      transform: "none !important",
      margin: "0 !important",
      maxHeight: "none !important",
      maxWidth: "none !important",
      height: "auto !important",
      borderRadius: "16px",
      boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.3)",
    },
    // Enforce Theme Colors & Depth for Events & Badges
    "& .event-remote, & .event-in-person": {
      transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
    },
    "& .MuiEventCalendar-agendaViewEventListItem .event-remote, & .MuiEventCalendar-agendaViewEventListItem .event-in-person":
      {
        position: "relative",
      },
    "& .MuiEventCalendar-timeGridEvent": {
      borderRadius: "8px !important",
      boxShadow: isDark
        ? `0 4px 16px -2px ${alpha(theme.palette.common.black, 0.5)}, 0 1px 4px 0 ${alpha(theme.palette.common.black, 0.35)} !important`
        : `0 3px 12px -2px ${alpha(theme.palette.common.black, 0.14)}, 0 1px 4px 0 ${alpha(theme.palette.common.black, 0.08)} !important`,
      backdropFilter: "blur(8px)",
      overflow: "hidden !important",
      transition: "transform 0.18s ease, box-shadow 0.18s ease !important",
      "&:hover": {
        transform: "translateY(-1px) scale(1.008)",
        boxShadow: isDark
          ? `0 10px 28px -4px ${alpha(theme.palette.common.black, 0.7)}, 0 3px 8px 0 ${alpha(theme.palette.common.black, 0.45)} !important`
          : `0 8px 24px -4px ${alpha(theme.palette.common.black, 0.22)}, 0 2px 6px 0 ${alpha(theme.palette.common.black, 0.12)} !important`,
        zIndex: 5,
      },
    },
    "& .MuiEventCalendar-timeGridEvent::before": {
      top: "0 !important",
      bottom: "0 !important",
      left: "0 !important",
      width: "8px !important",
      borderRadius: "0 !important",
      boxShadow: isDark
        ? `1px 0 0 0 ${alpha(theme.palette.common.black, 0.35)} !important`
        : `1px 0 0 0 ${alpha(theme.palette.common.black, 0.18)} !important`,
    },
    "& .MuiEventCalendar-timeGridEvent[data-under-hour='true']::before, & .MuiEventCalendar-timeGridEvent[data-under-fifteen-minutes='true']::before":
      {
        top: "0 !important",
        bottom: "0 !important",
        left: "0 !important",
        width: "8px !important",
        borderRadius: "0 !important",
      },
    "& .event-remote, & [data-palette='blue']": {
      "--event-main": theme.palette.primary.main,
      "--event-surface-bold": theme.palette.primary.main,
      "--event-surface-bold-hover": theme.palette.primary.dark,
      "--event-on-surface-bold": theme.palette.primary.contrastText,
      "--event-surface-subtle": alpha(theme.palette.primary.main, 0.12),
      "--event-surface-subtle-hover": alpha(theme.palette.primary.main, 0.2),
      "--event-surface-accent": theme.palette.primary.main,
      "--event-on-surface-subtle-primary": theme.palette.primary.dark,
      "--event-on-surface-subtle-secondary": alpha(
        theme.palette.primary.dark,
        0.75,
      ),
      "--event-surface-selected": alpha(theme.palette.primary.main, 0.28),
      "--event-surface-selected-hover": alpha(theme.palette.primary.main, 0.36),
      "--event-on-surface-selected": theme.palette.primary.dark,
      backgroundColor: "var(--event-surface-subtle)",
      backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
    },
    "& .event-in-person, & [data-palette='green']": {
      "--event-main": theme.palette.success.main,
      "--event-surface-bold": theme.palette.success.main,
      "--event-surface-bold-hover": theme.palette.success.dark,
      "--event-on-surface-bold": theme.palette.success.contrastText,
      "--event-surface-subtle": alpha(theme.palette.success.main, 0.12),
      "--event-surface-subtle-hover": alpha(theme.palette.success.main, 0.2),
      "--event-surface-accent": theme.palette.success.main,
      "--event-on-surface-subtle-primary": theme.palette.success.dark,
      "--event-on-surface-subtle-secondary": alpha(
        theme.palette.success.dark,
        0.75,
      ),
      "--event-surface-selected": alpha(theme.palette.success.main, 0.28),
      "--event-surface-selected-hover": alpha(theme.palette.success.main, 0.36),
      "--event-on-surface-selected": theme.palette.success.dark,
      backgroundColor: "var(--event-surface-subtle)",
      backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette.success.main, 0.28)}`,
    },
    "& .event-remote .MuiEventCalendar-timeGridEventTitle, & .event-remote .MuiEventCalendar-dayGridEventTitle, & .event-remote .MuiEventCalendar-eventItemTitle, & [data-palette='blue'] .MuiEventCalendar-timeGridEventTitle, & [data-palette='blue'] .MuiEventCalendar-dayGridEventTitle, & [data-palette='blue'] .MuiEventCalendar-eventItemTitle":
      {
        fontWeight: 700,
        fontSize: "0.75rem",
        lineHeight: 1.25,
        color: "var(--event-on-surface-subtle-primary)",
        letterSpacing: "-0.01em",
      },
    "& .event-in-person .MuiEventCalendar-timeGridEventTitle, & .event-in-person .MuiEventCalendar-dayGridEventTitle, & .event-in-person .MuiEventCalendar-eventItemTitle, & [data-palette='green'] .MuiEventCalendar-timeGridEventTitle, & [data-palette='green'] .MuiEventCalendar-dayGridEventTitle, & [data-palette='green'] .MuiEventCalendar-eventItemTitle":
      {
        fontWeight: 700,
        fontSize: "0.75rem",
        lineHeight: 1.25,
        color: "var(--event-on-surface-subtle-primary)",
        letterSpacing: "-0.01em",
      },
    "& .MuiEventCalendar-timeGridEventTitle": {
      paddingRight: "20px !important",
      wordBreak: "break-word",
      lineHeight: "1.25 !important",
      fontSize: "0.75rem !important",
    },
    "& .event-remote .MuiEventCalendar-timeGridEventTime, & .event-remote .MuiEventCalendar-dayGridEventTime, & .event-remote .MuiEventCalendar-eventItemTime, & [data-palette='blue'] .MuiEventCalendar-timeGridEventTime, & [data-palette='blue'] .MuiEventCalendar-dayGridEventTime, & [data-palette='blue'] .MuiEventCalendar-eventItemTime":
      {
        fontWeight: 600,
        fontSize: "0.6875rem !important",
        lineHeight: "1.2 !important",
        letterSpacing: "-0.015em",
        color: "var(--event-on-surface-subtle-secondary)",
        marginTop: "2px",
      },
    "& .event-in-person .MuiEventCalendar-timeGridEventTime, & .event-in-person .MuiEventCalendar-dayGridEventTime, & .event-in-person .MuiEventCalendar-eventItemTime, & [data-palette='green'] .MuiEventCalendar-timeGridEventTime, & [data-palette='green'] .MuiEventCalendar-dayGridEventTime, & [data-palette='green'] .MuiEventCalendar-eventItemTime":
      {
        fontWeight: 600,
        fontSize: "0.6875rem !important",
        lineHeight: "1.2 !important",
        letterSpacing: "-0.015em",
        color: "var(--event-on-surface-subtle-secondary)",
        marginTop: "2px",
      },
    "& .MuiEventCalendar-timeGridEventTime": {
      display: "-webkit-box !important",
      WebkitLineClamp: "2 !important",
      WebkitBoxOrient: "vertical !important",
      overflow: "hidden",
      whiteSpace: "normal !important",
      wordBreak: "normal !important",
      flexShrink: "0 !important",
    },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-remote, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='blue']":
      {
        backgroundColor: "var(--event-surface-bold)",
        border: "none",
      },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-in-person, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='green']":
      {
        backgroundColor: "var(--event-surface-bold)",
        border: "none",
      },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-remote .MuiEventCalendar-dayGridEventTitle, & .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-remote .MuiEventCalendar-dayGridEventTime, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='blue'] .MuiEventCalendar-dayGridEventTitle, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='blue'] .MuiEventCalendar-dayGridEventTime":
      {
        color: "var(--event-on-surface-bold) !important",
      },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-in-person .MuiEventCalendar-dayGridEventTitle, & .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-in-person .MuiEventCalendar-dayGridEventTime, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='green'] .MuiEventCalendar-dayGridEventTitle, & .MuiEventCalendar-dayGridEvent[data-variant='filled'][data-palette='green'] .MuiEventCalendar-dayGridEventTime":
      {
        color: "var(--event-on-surface-bold) !important",
      },
    "& .MuiEventCalendar-timeGridEvent.event-remote, & .MuiEventCalendar-timeGridEvent.event-in-person, & .MuiEventCalendar-timeGridEvent[data-palette='blue'], & .MuiEventCalendar-timeGridEvent[data-palette='green']":
      {
        padding: "6px 6px 6px 16px !important",
        "&[data-under-hour='true']": {
          paddingTop: "2px !important",
          paddingBottom: "2px !important",
          paddingLeft: "14px !important",
        },
        "&[data-under-fifteen-minutes='true']": {
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
          paddingLeft: "12px !important",
        },
      },
    "& .MuiEventCalendar-dayGridEvent.event-remote, & .MuiEventCalendar-dayGridEvent.event-in-person, & .MuiEventCalendar-dayGridEvent[data-palette='blue'], & .MuiEventCalendar-dayGridEvent[data-palette='green']":
      {
        paddingRight: "22px !important",
      },
    "& .MuiEventCalendar-agendaViewEventListItem .event-remote, & .MuiEventCalendar-agendaViewEventListItem .event-in-person, & .MuiEventCalendar-agendaViewEventListItem [data-palette='blue'], & .MuiEventCalendar-agendaViewEventListItem [data-palette='green']":
      {
        paddingRight: "38px !important",
      },
    "& .event-remote::after, & .event-in-person::after": {
      content: '""',
      position: "absolute",
      top: "5px",
      right: "5px",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "11px 11px",
      boxShadow: `0 2px 5px ${alpha(theme.palette.common.black, 0.18)}`,
      border: `1.5px solid ${theme.palette.background.paper}`,
      pointerEvents: "none",
      zIndex: 2,
      transition: "transform 0.15s ease-in-out",
    },
    "& .event-remote::after": {
      backgroundColor: theme.palette.primary.main,
      backgroundImage: createSvgDataUri(
        DEVICES_ICON_PATH,
        theme.palette.primary.contrastText,
      ),
      boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
    "& .event-in-person::after": {
      backgroundColor: theme.palette.success.main,
      backgroundImage: createSvgDataUri(
        LOCATION_ICON_PATH,
        theme.palette.success.contrastText,
      ),
      boxShadow: `0 2px 6px ${alpha(theme.palette.success.main, 0.35)}`,
    },
    "& .MuiEventCalendar-dayGridEvent.event-remote::after, & .MuiEventCalendar-dayGridEvent.event-in-person::after":
      {
        top: "50%",
        transform: "translateY(-50%)",
        right: "3px",
        width: "14px",
        height: "14px",
        backgroundSize: "9px 9px",
        borderWidth: "1px",
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.15)}`,
      },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-remote::after":
      {
        backgroundColor: theme.palette.primary.dark,
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.5)}`,
      },
    "& .MuiEventCalendar-dayGridEvent[data-variant='filled'].event-in-person::after":
      {
        backgroundColor: theme.palette.success.dark,
        border: `1px solid ${alpha(theme.palette.success.contrastText, 0.5)}`,
      },
    "& .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-remote::after, & .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-in-person::after":
      {
        top: "50%",
        transform: "translateY(-50%)",
        right: "4px",
        width: "16px",
        height: "16px",
        backgroundSize: "10px 10px",
        borderWidth: "1px",
      },
    "& .MuiEventCalendar-agendaViewEventListItem .event-remote::after, & .MuiEventCalendar-agendaViewEventListItem .event-in-person::after":
      {
        top: "50%",
        transform: "translateY(-50%)",
        right: "12px",
        width: "22px",
        height: "22px",
        backgroundSize: "13px 13px",
      },
    "& .event-remote:hover::after, & .event-in-person:hover::after": {
      transform: "scale(1.1)",
    },
    "& .MuiEventCalendar-dayGridEvent.event-remote:hover::after, & .MuiEventCalendar-dayGridEvent.event-in-person:hover::after, & .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-remote:hover::after, & .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-in-person:hover::after, & .MuiEventCalendar-agendaViewEventListItem .event-remote:hover::after, & .MuiEventCalendar-agendaViewEventListItem .event-in-person:hover::after":
      {
        transform: "translateY(-50%) scale(1.1)",
      },
    ...theme.applyStyles("dark", {
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      boxShadow: "0 20px 48px -12px rgba(0, 0, 0, 0.4)",
      "& .event-remote, & [data-palette='blue']": {
        "--event-main": theme.palette.primary.light,
        "--event-surface-bold": theme.palette.primary.main,
        "--event-surface-bold-hover": theme.palette.primary.light,
        "--event-on-surface-bold": theme.palette.primary.contrastText,
        "--event-surface-subtle": alpha(theme.palette.primary.main, 0.22),
        "--event-surface-subtle-hover": alpha(theme.palette.primary.main, 0.32),
        "--event-surface-accent": theme.palette.primary.main,
        "--event-on-surface-subtle-primary": theme.palette.primary.contrastText,
        "--event-on-surface-subtle-secondary": alpha(
          theme.palette.primary.contrastText,
          0.8,
        ),
        "--event-surface-selected": alpha(theme.palette.primary.main, 0.38),
        "--event-surface-selected-hover": alpha(
          theme.palette.primary.main,
          0.48,
        ),
        "--event-on-surface-selected": theme.palette.primary.contrastText,
        backgroundColor: "var(--event-surface-subtle)",
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.28)} 0%, ${alpha(theme.palette.primary.main, 0.14)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.light, 0.38)}`,
      },
      "& .event-in-person, & [data-palette='green']": {
        "--event-main": theme.palette.success.light,
        "--event-surface-bold": theme.palette.success.main,
        "--event-surface-bold-hover": theme.palette.success.light,
        "--event-on-surface-bold": theme.palette.success.contrastText,
        "--event-surface-subtle": alpha(theme.palette.success.main, 0.22),
        "--event-surface-subtle-hover": alpha(theme.palette.success.main, 0.32),
        "--event-surface-accent": theme.palette.success.main,
        "--event-on-surface-subtle-primary": theme.palette.success.contrastText,
        "--event-on-surface-subtle-secondary": alpha(
          theme.palette.success.contrastText,
          0.8,
        ),
        "--event-surface-selected": alpha(theme.palette.success.main, 0.38),
        "--event-surface-selected-hover": alpha(
          theme.palette.success.main,
          0.48,
        ),
        "--event-on-surface-selected": theme.palette.success.contrastText,
        backgroundColor: "var(--event-surface-subtle)",
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.28)} 0%, ${alpha(theme.palette.success.main, 0.14)} 100%)`,
        border: `1px solid ${alpha(theme.palette.success.light, 0.38)}`,
      },
      "& .event-remote::after": {
        backgroundColor: theme.palette.primary.main,
        backgroundImage: createSvgDataUri(
          DEVICES_ICON_PATH,
          theme.palette.primary.contrastText,
        ),
        border: `1.5px solid ${alpha(theme.palette.common.white, 0.35)}`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.5)}`,
      },
      "& .event-in-person::after": {
        backgroundColor: theme.palette.success.main,
        backgroundImage: createSvgDataUri(
          LOCATION_ICON_PATH,
          theme.palette.success.contrastText,
        ),
        border: `1.5px solid ${alpha(theme.palette.common.white, 0.35)}`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.5)}`,
      },
      "& .MuiEventCalendar-dayGridEvent.event-remote::after, & .MuiEventCalendar-dayGridEvent.event-in-person::after":
        {
          borderWidth: "1px",
        },
      "& .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-remote::after, & .MuiEventCalendar-timeGridEvent[data-under-hour='true'].event-in-person::after":
        {
          borderWidth: "1px",
        },
    }),
  };
});

export const FilterBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  padding: theme.spacing(1, 1.5),
  borderRadius: "16px",
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: "blur(12px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
}));

export const SoftDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "24px",
    padding: "8px",
    boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(20px)",
  },
}));
