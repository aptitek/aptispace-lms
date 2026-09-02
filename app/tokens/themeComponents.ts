export const m3TooltipDarkOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: {
    backgroundColor: "#eee8d5",
    color: "#002b36",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: "1rem",
    borderRadius: 8,
    padding: "6px 10px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
    border: `1px solid rgba(88, 110, 117, 0.3)`,
    backdropFilter: "blur(8px)",
  },
  arrow: {
    color: "#eee8d5",
  },
};

export const m3TooltipLightOverrides = {
  popper: {
    zIndex: 1500,
  },
  tooltip: {
    backgroundColor: "#073642",
    color: "#fdf6e3",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: "1rem",
    borderRadius: 8,
    padding: "6px 10px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
    border: `1px solid rgba(88, 110, 117, 0.2)`,
    backdropFilter: "blur(8px)",
  },
  arrow: {
    color: "#073642",
  },
};

export const m3DatePickerDarkComponents = {
  MuiPickersPopper: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        backgroundColor: "#073642",
        border: "1px solid rgba(88, 110, 117, 0.3)",
        boxShadow: "0px 8px 32px rgba(0, 43, 54, 0.6)",
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        borderRadius: 9999,
        fontWeight: 600,
        color: "#839496",
        "&:hover": {
          backgroundColor: "rgba(38, 139, 210, 0.15)",
        },
        "&.Mui-selected": {
          backgroundColor: "#268bd2 !important",
          color: "#fdf6e3 !important",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#1e6fa8 !important",
          },
        },
        "&.MuiPickersDay-today": {
          borderColor: "#268bd2",
        },
      },
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      weekDayLabel: {
        color: "#586e75",
        fontWeight: 600,
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      label: {
        fontWeight: 700,
        color: "#93a1a1",
      },
      switchViewButton: {
        color: "#268bd2",
      },
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: {
        "& .MuiPickersYear-yearButton": {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "#268bd2 !important",
            color: "#fdf6e3 !important",
            fontWeight: 700,
          },
        },
      },
    },
  },
  MuiMonthCalendar: {
    styleOverrides: {
      root: {
        "& .MuiPickersMonth-monthButton": {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "#268bd2 !important",
            color: "#fdf6e3 !important",
            fontWeight: 700,
          },
        },
      },
    },
  },
};

export const m3DatePickerLightComponents = {
  MuiPickersPopper: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        backgroundColor: "#fdf6e3",
        border: "1px solid rgba(88, 110, 117, 0.2)",
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        borderRadius: 9999,
        fontWeight: 600,
        color: "#657b83",
        "&:hover": {
          backgroundColor: "rgba(38, 139, 210, 0.12)",
        },
        "&.Mui-selected": {
          backgroundColor: "#268bd2 !important",
          color: "#fdf6e3 !important",
          fontWeight: 700,
          "&:hover": {
            backgroundColor: "#1e6fa8 !important",
          },
        },
        "&.MuiPickersDay-today": {
          borderColor: "#268bd2",
        },
      },
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      weekDayLabel: {
        color: "#93a1a1",
        fontWeight: 600,
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      label: {
        fontWeight: 700,
        color: "#586e75",
      },
      switchViewButton: {
        color: "#268bd2",
      },
    },
  },
  MuiYearCalendar: {
    styleOverrides: {
      root: {
        "& .MuiPickersYear-yearButton": {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "#268bd2 !important",
            color: "#fdf6e3 !important",
            fontWeight: 700,
          },
        },
      },
    },
  },
  MuiMonthCalendar: {
    styleOverrides: {
      root: {
        "& .MuiPickersMonth-monthButton": {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "#268bd2 !important",
            color: "#fdf6e3 !important",
            fontWeight: 700,
          },
        },
      },
    },
  },
};
