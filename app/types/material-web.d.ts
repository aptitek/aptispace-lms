import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import type { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";
import type { MdAssistChip } from "@material/web/chips/assist-chip.js";
import type { MdFilterChip } from "@material/web/chips/filter-chip.js";
import type { MdSuggestionChip } from "@material/web/chips/suggestion-chip.js";
import type { MdInputChip } from "@material/web/chips/input-chip.js";
import type { MdChipSet } from "@material/web/chips/chip-set.js";

export type {
  MdFilledTextField,
  MdOutlinedTextField,
  MdAssistChip,
  MdFilterChip,
  MdSuggestionChip,
  MdInputChip,
  MdChipSet,
};

export type MdTextFieldAttributes = Omit<
  HTMLAttributes<HTMLElement>,
  "inputMode"
> & {
  label?: string;
  value?: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  prefixText?: string;
  suffixText?: string;
  rows?: number;
  cols?: number;
  name?: string;
  autocomplete?: string;
  inputMode?: string;
  max?: string;
  min?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  step?: string;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  noAsterisk?: boolean;
  noSpinner?: boolean;
  textDirection?: string;
  tabIndex?: number;
  autoFocus?: boolean;
  "data-testid"?: string;
  slot?: string;
};

export type MdChipAttributes = HTMLAttributes<HTMLElement> & {
  label?: string;
  disabled?: boolean;
  softDisabled?: boolean;
  elevated?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  download?: string;
  selected?: boolean;
  removable?: boolean;
  hasIcon?: boolean;
  tabIndex?: number;
  "data-testid"?: string;
  slot?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-text-field": DetailedHTMLProps<
        MdTextFieldAttributes,
        MdFilledTextField
      >;
      "md-outlined-text-field": DetailedHTMLProps<
        MdTextFieldAttributes,
        MdOutlinedTextField
      >;
      "md-assist-chip": DetailedHTMLProps<MdChipAttributes, MdAssistChip>;
      "md-filter-chip": DetailedHTMLProps<MdChipAttributes, MdFilterChip>;
      "md-suggestion-chip": DetailedHTMLProps<
        MdChipAttributes,
        MdSuggestionChip
      >;
      "md-input-chip": DetailedHTMLProps<MdChipAttributes, MdInputChip>;
      "md-chip-set": DetailedHTMLProps<HTMLAttributes<HTMLElement>, MdChipSet>;
      "md-icon": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { slot?: string },
        HTMLElement
      >;
      "md-icon-button": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          slot?: string;
          toggle?: boolean;
          selected?: boolean;
          disabled?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-text-field": DetailedHTMLProps<
        MdTextFieldAttributes,
        MdFilledTextField
      >;
      "md-outlined-text-field": DetailedHTMLProps<
        MdTextFieldAttributes,
        MdOutlinedTextField
      >;
      "md-assist-chip": DetailedHTMLProps<MdChipAttributes, MdAssistChip>;
      "md-filter-chip": DetailedHTMLProps<MdChipAttributes, MdFilterChip>;
      "md-suggestion-chip": DetailedHTMLProps<
        MdChipAttributes,
        MdSuggestionChip
      >;
      "md-input-chip": DetailedHTMLProps<MdChipAttributes, MdInputChip>;
      "md-chip-set": DetailedHTMLProps<HTMLAttributes<HTMLElement>, MdChipSet>;
      "md-icon": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & { slot?: string },
        HTMLElement
      >;
      "md-icon-button": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          slot?: string;
          toggle?: boolean;
          selected?: boolean;
          disabled?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
