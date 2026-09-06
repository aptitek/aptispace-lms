import React, { forwardRef } from "react";
import { SingleNumberPicker } from "./SingleNumberPicker";
import { RangeNumberPicker } from "./RangeNumberPicker";
import type { NumberPickerProps } from "./NumberPicker.types";

function checkIsRangeMode(props: NumberPickerProps): boolean {
  if (props.mode === "range") return true;
  if (props.mode === "single") return false;
  const hasRangeHandlers = Boolean(
    props.onMinChange ||
    props.onMaxChange ||
    props.onStartYearMinChange ||
    props.onStartYearMaxChange,
  );
  const hasRangeValues =
    props.minValue !== undefined ||
    props.maxValue !== undefined ||
    props.startYearMin !== undefined ||
    props.startYearMax !== undefined;
  return hasRangeHandlers || hasRangeValues;
}

export const NumberPicker = forwardRef<HTMLDivElement, NumberPickerProps>(
  function NumberPicker(props, ref) {
    if (checkIsRangeMode(props)) {
      return <RangeNumberPicker ref={ref} {...props} />;
    }
    return <SingleNumberPicker ref={ref} {...props} />;
  },
);

NumberPicker.displayName = "NumberPicker";

export { SingleNumberPicker, RangeNumberPicker };
export default NumberPicker;
