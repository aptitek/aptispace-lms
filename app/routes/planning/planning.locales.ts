import { frFR, enUS as schedulerEnUS } from "@mui/x-scheduler/locales";
import {
  fr as baseFr,
  enUS as dateFnsEnUS,
  type Locale,
} from "date-fns/locale";

function capitalizeFirstLetter(str: string): string {
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export const frCapitalized: Locale = {
  ...baseFr,
  localize: {
    ...baseFr.localize,
    month: (n, options) => {
      const formatted = baseFr.localize.month(n, options);
      return capitalizeFirstLetter(formatted);
    },
    day: (n, options) => {
      const formatted = baseFr.localize.day(n, options);
      return capitalizeFirstLetter(formatted);
    },
  },
};

export function getSchedulerLocaleText(currentLang: string) {
  return currentLang.startsWith("fr")
    ? frFR.components.MuiEventCalendar.defaultProps.localeText
    : schedulerEnUS.components.MuiEventCalendar.defaultProps.localeText;
}

export function getSchedulerDateLocale(currentLang: string): Locale {
  return currentLang.startsWith("fr") ? frCapitalized : dateFnsEnUS;
}
