import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltip";
import type {
  MrzZoneProps,
  MrzValidationResult,
  Td1MrzData,
} from "./MrzZone.types";
import { generateTd1Mrz, validateTd1Mrz } from "./icao9303";
import { MrzContainer, MrzPre, StatusPill } from "./MrzZone.styles";

const DEFAULT_MRZ_LINES: [string, string, string] = [
  "IDAPT0942<<<<<4<<<<<<<<<<<<<<<",
  "2608284M3008287APT<<<<<<<<<<<4",
  "MERCER<<ALEX<<<<<<<<<<<<<<<<<<",
];

function resolveMrzLines(
  customLines?: [string, string, string],
  cardData?: Td1MrzData,
): [string, string, string] {
  if (customLines) {
    return customLines;
  }
  if (cardData) {
    return generateTd1Mrz(cardData).lines;
  }
  return DEFAULT_MRZ_LINES;
}

interface ValidationBadgeProps {
  validation: MrzValidationResult;
}

function ValidationBadge({ validation }: ValidationBadgeProps) {
  const { t } = useTranslation("onboarding");
  const validLabel = t("card.mrzValid", "ICAO OK");
  const invalidLabel = t("card.mrzInvalid", "CHECK ERR");

  const tooltip = validation.isValid
    ? validLabel
    : validation.errors.length > 0
      ? validation.errors.join("; ")
      : invalidLabel;

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <StatusPill
        isValidStatus={validation.isValid}
        data-testid={validation.isValid ? "mrz-valid-pill" : "mrz-invalid-pill"}
      >
        {validation.isValid ? validLabel : invalidLabel}
      </StatusPill>
    </Tooltip>
  );
}

export default function MrzZone({
  cardData,
  lines: customLines,
  showValidation = false,
  compact = false,
  darkOnLight = false,
  fullWidth = false,
  className,
  testId = "mrz-zone",
}: MrzZoneProps) {
  const { t } = useTranslation("onboarding");

  const computedLines = useMemo<[string, string, string]>(
    () => resolveMrzLines(customLines, cardData),
    [customLines, cardData],
  );

  const validation = useMemo<MrzValidationResult>(
    () => validateTd1Mrz(computedLines),
    [computedLines],
  );

  return (
    <MrzContainer
      role="region"
      aria-label={t("card.mrzZone", "ICAO 9303 Machine Readable Zone")}
      compact={compact}
      darkOnLight={darkOnLight}
      fullWidth={fullWidth}
      className={className}
      data-testid={testId}
    >
      <MrzPre compact={compact} darkOnLight={darkOnLight} fullWidth={fullWidth}>
        <code>{computedLines.join("\n")}</code>
      </MrzPre>

      {showValidation && <ValidationBadge validation={validation} />}
    </MrzContainer>
  );
}
