import React, { useMemo } from "react";
import { generateTd1Mrz } from "../../atoms/MrzZone/icao9303";
import {
  FRENCH_ID_FRONT,
  FRENCH_ID_BACK,
  FRENCH_ID_SAMPLE_HOLDER,
  type FrenchIdCardSide,
  type FrenchIdFragment,
  type FrenchIdFragmentKind,
} from "./FrenchIdCard.layout";
import type { Id1CardCredential } from "./Id1Card.types";
import {
  FrenchRoot,
  FrenchFragment,
  FrenchMicroLabel,
  FrenchFieldValue,
  FrenchHeader,
  FrenchPhoto,
  FrenchMRZ,
  FrenchEuFlag,
  FrenchEuStar,
  FrenchEuCode,
  FrenchSignature,
  French2dBarcode,
  FrenchChipSymbol,
  mmToPct,
  mmToCqh,
} from "./Id1CredentialLayout.french.styles";

/** Maps a layout fragment id to the credential field that may override it. */
const CREDENTIAL_KEY_BY_FRAGMENT: Record<string, keyof Id1CardCredential> = {
  nom: "surname",
  prenoms: "givenNames",
  sexe: "sex",
  nationalite: "nationality",
  "date-naissance": "dateOfBirth",
  "lieu-naissance": "placeOfBirth",
  "document-number": "documentNumber",
  expiry: "expiryDate",
  can: "can",
  taille: "height",
  adresse: "address",
  "date-issue": "issueDate",
  autorite: "authority",
};

/** Normalizes "DD.MM.YYYY" to ICAO "YYMMDD"; undefined when unparseable. */
function toYymmdd(ddmmyyyy: string | undefined): string | undefined {
  if (!ddmmyyyy) return undefined;
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(ddmmyyyy.trim());
  if (!m) return undefined;
  return `${m[3].slice(-2)}${m[2]}${m[1]}`;
}

/** Rebuilds a valid ICAO 9303 TD1 zone for the (possibly overridden) holder. */
function buildMrz(credential: Id1CardCredential): string {
  const mrzData = {
    documentCode: "I" as const,
    issuingState: "FRA" as const,
    documentNumber:
      credential.documentNumber ?? FRENCH_ID_SAMPLE_HOLDER.documentNumber,
    birthDate:
      toYymmdd(credential.dateOfBirth) ??
      FRENCH_ID_SAMPLE_HOLDER.birthDateYymmdd,
    sex: (credential.sex ?? FRENCH_ID_SAMPLE_HOLDER.sex) as "M" | "F",
    expiryDate:
      toYymmdd(credential.expiryDate) ??
      FRENCH_ID_SAMPLE_HOLDER.expiryDateYymmdd,
    nationality: credential.nationality ?? FRENCH_ID_SAMPLE_HOLDER.nationality,
    surname: credential.surname ?? FRENCH_ID_SAMPLE_HOLDER.surname,
    givenNames: credential.givenNames ?? FRENCH_ID_SAMPLE_HOLDER.givenNames,
  };
  return generateTd1Mrz(mrzData).lines.join("\n");
}

/** Resolve the displayed value for a fragment, preferring the credential. */
function resolveValue(
  fragment: FrenchIdFragment,
  credential: Id1CardCredential,
): string | undefined {
  if (fragment.id === "mrz") return buildMrz(credential);
  const key = CREDENTIAL_KEY_BY_FRAGMENT[fragment.id];
  const override = key ? credential[key] : undefined;
  return override ?? fragment.value;
}

/** 12 gold stars laid out on an ellipse (EU flag geometry). */
const EU_STAR_POSITIONS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    id: `star-${i}`,
    left: 50 + 38 * Math.cos(angle),
    top: 50 + 36 * Math.sin(angle),
  };
});

// Deterministic pseudo-random "finder pattern" cells for the 2D-Doc placeholder.
const BARCODE_CELLS = Array.from({ length: 64 }, (_, i) => ({
  id: `cell-${i}`,
  on: (i * 7 + i * i * 5 + 3) % 3 !== 0,
}));

/** Stylized person silhouette used when no photo URL is supplied. */
const SILHOUETTE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">' +
    '<rect width="200" height="260" fill="#c9c9ce"/>' +
    '<circle cx="100" cy="82" r="46" fill="#7a7a82"/>' +
    '<path d="M28 250c12-72 64-96 144-96s92 24 104 96z" fill="#7a7a82"/>' +
    "</svg>",
)}`;

interface RenderOpts {
  fragment: FrenchIdFragment;
  value: string | undefined;
  credential: Id1CardCredential;
  valueFontSize: string | undefined;
  caps: boolean;
}

function renderFlag({ value }: RenderOpts): React.ReactNode {
  return (
    <FrenchEuFlag>
      {EU_STAR_POSITIONS.map((star) => (
        <FrenchEuStar
          key={star.id}
          sx={{ left: `${star.left}%`, top: `${star.top}%` }}
        >
          ★
        </FrenchEuStar>
      ))}
      <FrenchEuCode>{value}</FrenchEuCode>
    </FrenchEuFlag>
  );
}

function renderHeader({ value, valueFontSize }: RenderOpts): React.ReactNode {
  return <FrenchHeader sx={{ fontSize: valueFontSize }}>{value}</FrenchHeader>;
}

function photoOrPlaceholder(src: string | undefined, ghost: boolean) {
  if (src && src.length > 0) {
    return <FrenchPhoto ghost={ghost} src={src} alt="Portrait" />;
  }
  return <FrenchPhoto src={SILHOUETTE_SVG} alt="Portrait" />;
}

function renderPhotoPrimary({ credential }: RenderOpts): React.ReactNode {
  return photoOrPlaceholder(credential.avatarUrl, false);
}

function renderPhotoGhost({ credential }: RenderOpts): React.ReactNode {
  return photoOrPlaceholder(credential.avatarUrl, true);
}

function renderField({
  fragment,
  value,
  valueFontSize,
  caps,
}: RenderOpts): React.ReactNode {
  return (
    <>
      {fragment.label && <FrenchMicroLabel>{fragment.label}</FrenchMicroLabel>}
      <FrenchFieldValue caps={caps} sx={{ fontSize: valueFontSize }}>
        {value}
      </FrenchFieldValue>
    </>
  );
}

function renderSignature(): React.ReactNode {
  return (
    <FrenchSignature>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none">
        <path
          d="M5 20 C 15 6, 22 26, 32 14 S 50 26, 60 12 S 80 22, 95 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </FrenchSignature>
  );
}

function render2dBarcode(): React.ReactNode {
  return (
    <French2dBarcode>
      {BARCODE_CELLS.map((cell) => (cell.on ? <span key={cell.id} /> : null))}
    </French2dBarcode>
  );
}

function renderChipSymbol(): React.ReactNode {
  return (
    <FrenchChipSymbol>
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        <rect
          x="10"
          y="12"
          width="20"
          height="16"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        {[14, 20, 26].map((cx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy={8}
              r="2.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx={cx}
              cy={6}
              r="1.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </g>
        ))}
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="28"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="12"
          y1="20"
          x2="28"
          y2="20"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </FrenchChipSymbol>
  );
}

function renderMrz({ value, valueFontSize }: RenderOpts): React.ReactNode {
  return <FrenchMRZ sx={{ fontSize: valueFontSize }}>{value}</FrenchMRZ>;
}

const FRAGMENT_RENDERERS: Record<
  FrenchIdFragmentKind,
  (opts: RenderOpts) => React.ReactNode
> = {
  flag: renderFlag,
  header: renderHeader,
  "photo-primary": renderPhotoPrimary,
  "photo-ghost": renderPhotoGhost,
  "label-value": renderField,
  "document-number": renderField,
  expiry: renderField,
  can: renderField,
  signature: renderSignature,
  "barcode-2d": render2dBarcode,
  "chip-symbol": renderChipSymbol,
  mrz: renderMrz,
  text: renderField,
};

interface FragmentViewProps {
  fragment: FrenchIdFragment;
  credential: Id1CardCredential;
}

function FrenchFragmentView({ fragment, credential }: FragmentViewProps) {
  const value = resolveValue(fragment, credential);
  const geomStyle = mmToPct(
    fragment.rect.x,
    fragment.rect.y,
    fragment.rect.width,
    fragment.rect.height,
  );
  const render = FRAGMENT_RENDERERS[fragment.kind];
  const valueFontSize = fragment.fontSizeMm
    ? mmToCqh(fragment.fontSizeMm)
    : undefined;
  const caps = fragment.textTransform === "uppercase";

  return (
    <FrenchFragment align={fragment.align ?? "left"} sx={geomStyle}>
      {render({
        fragment,
        value,
        credential,
        valueFontSize,
        caps,
      })}
    </FrenchFragment>
  );
}

export interface FrenchCredentialViewProps {
  credential?: Partial<Id1CardCredential>;
  side: FrenchIdCardSide;
  className?: string;
  testId?: string;
}

/**
 * Renders the exact CNIe layout (front or back) from `FrenchIdCard.layout.ts`.
 * Fragments are absolutely positioned in mm→% coordinates so the layout is
 * dimensionally faithful regardless of the rendered pixel size.
 */
export function FrenchCredentialView({
  credential,
  side,
  className,
  testId = "id1-french-credential",
}: FrenchCredentialViewProps) {
  const fragments = side === "back" ? FRENCH_ID_BACK : FRENCH_ID_FRONT;

  const merged = useMemo<Id1CardCredential>(
    () => ({ ...FRENCH_ID_SAMPLE_HOLDER, ...credential }) as Id1CardCredential,
    [credential],
  );

  return (
    <FrenchRoot className={className} data-testid={testId}>
      {fragments.map((fragment) => (
        <FrenchFragmentView
          key={fragment.id}
          fragment={fragment}
          credential={merged}
        />
      ))}
    </FrenchRoot>
  );
}
