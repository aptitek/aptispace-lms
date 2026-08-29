import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MrzZoneProps } from "./MrzZone.types";
import { generateTd1Mrz, validateTd1Mrz } from "./icao9303";
import { MrzContainer, MrzPre, StatusPill } from "./MrzZone.styles";

const DEFAULT_MRZ_LINES: [string, string, string] = [
  "IDAPT0942<<<<<4<<<<<<<<<<<<<<<",
  "2608284M3008287APT<<<<<<<<<<<4",
  "MERCER<<ALEX<<<<<<<<<<<<<<<<<<",
];

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

  const computedLines = useMemo<[string, string, string]>(() => {
    if (customLines) {
      return customLines;
    }
    if (cardData) {
      return generateTd1Mrz(cardData).lines;
    }
    return DEFAULT_MRZ_LINES;
  }, [customLines, cardData]);

  const validation = useMemo(() => {
    return validateTd1Mrz(computedLines);
  }, [computedLines]);

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

      {showValidation && (
        <StatusPill
          isValidStatus={validation.isValid}
          data-testid={
            validation.isValid ? "mrz-valid-pill" : "mrz-invalid-pill"
          }
          title={validation.errors.join("; ")}
        >
          {validation.isValid
            ? t("card.mrzValid", "ICAO OK")
            : t("card.mrzInvalid", "CHECK ERR")}
        </StatusPill>
      )}
    </MrzContainer>
  );
}
