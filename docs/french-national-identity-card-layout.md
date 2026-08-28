# French National Identity Card (CNIe) — Exact Layout Specification

Reference layout for the **Carte Nationale d'Identité électronique (CNIe)**, the
current French biometric identity card issued since **August 2021**. This document
is the human-readable companion to the machine-readable spec at
`app/components/organisms/Id1Card/FrenchIdCard.layout.ts` (all coordinates in **mm**
from the card's top-left corner).

## 1. Card & format facts (authoritative)

| Property | Value |
| --- | --- |
| Product | Carte Nationale d'Identité électronique (CNIe) |
| Format | **ISO/IEC 7810 ID-1** (standard bank/credit-card size) |
| Width | **85.60 mm** (± 0.12) |
| Height | **53.98 mm** (± 0.05) |
| Thickness | **0.76 mm** (± 0.08) |
| Corner radius | **3.18 mm** (± 0.30) |
| Material | Multi-layer **polycarbonate**, laser-engraved |
| Biometric photo | **ISO/IEC 19794-5:2011**, grayscale laser engraving |
| MRZ | **ICAO 9303 TD1** — 3 lines × 30 characters |
| Contactless chip | **ISO/IEC 14443** (NFC), PACE access via **CAN** |
| Legal basis | **EU Regulation 2019/1157** |

All printed labels on the new card are **bilingual (French / English)**.

---

## 2. FRONT (recto)

```
O───────────────────────────────────────────────────────────────────────────────O
│  ┌─────┐  RÉPUBLIQUE FRANÇAISE          CARTE NATIONALE D'IDENTITÉ            │
│  │ EU  │  NATIONAL IDENTITY CARD                                              │
│  │ FR ★│                                       N° du document   ┌────────────┐ │
│  └─────┘                                           21AA12345     │  21AA12345 │ │
│  ┌────────────┐  Nom / Surname                                       │ ...    │ │
│  │            │  DUPONT                                              └────────┘ │
│  │            │  Prénoms / Given names                                         │
│  │   PHOTO    │  JULIE MARIE                                                   │
│  │ (primary)  │  Sexe / Sex   Nationalité / Nationality                        │
│  │  ISO19794  │  F            FRA                                              │
│  │  27×33mm   │  Date de naissance / Date of birth                             │
│  │            │  15.03.1990                                                    │
│  │            │  Lieu de naissance / Place of birth                            │
│  └────────────┘  PARIS (75)                                                    │
│  ┌──────────┐   Date d'expiration / Date of expiry   ┌──────────┐ ┌─────────┐ │
│  │Signature │   15.03.2030                            │  DOVID   │ │ CAN     │ │
│  └──────────┘                                         │  ghost   │ │ 123456  │ │
│                                                       └──────────┘ └─────────┘ │
O───────────────────────────────────────────────────────────────────────────────O
```

### Front elements (rect in mm from top-left)

| # | id | kind | Label / content | Rect (x, y, w, h) | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `eu-flag` | flag | `FR` | (3.2, 3.0, 8.0, 5.6) | EU flag: 12 gold stars, negative `FR` (EU Reg. 2019/1157) |
| 2 | `header-republic` | header | RÉPUBLIQUE FRANÇAISE | (13.0, 2.6, 44.0, 3.2) | bold, 2.0 mm |
| 3 | `header-title-fr` | header | CARTE NATIONALE D'IDENTITÉ | (13.0, 5.7, 52.0, 3.0) | bold, 1.8 mm |
| 4 | `header-title-en` | header | NATIONAL IDENTITY CARD | (13.0, 8.5, 52.0, 2.6) | 1.4 mm |
| 5 | `photo-primary` | photo | — | (3.2, 11.6, 27.0, 33.0) | main portrait, left column |
| 6 | `document-number` | doc-no | N° du document → `21AA12345` | (56.0, 12.2, 26.0, 4.0) | 9 chars, right-aligned, bold |
| 7 | `nom` | label-value | Nom / Surname → `DUPONT` | (33.0, 16.4, 48.0, 6.0) | bold, 2.2 mm, uppercase |
| 8 | `prenoms` | label-value | Prénoms / Given names → `JULIE MARIE` | (33.0, 22.6, 48.0, 5.8) | 1.8 mm |
| 9 | `sexe` | label-value | Sexe / Sex → `F` | (33.0, 28.2, 17.0, 5.0) | 1.8 mm |
| 10 | `nationalite` | label-value | Nationalité / Nationality → `FRA` | (50.0, 28.2, 28.0, 5.0) | 1.8 mm |
| 11 | `date-naissance` | label-value | Date de naissance / Date of birth → `15.03.1990` | (33.0, 33.2, 40.0, 5.0) | DD.MM.YYYY |
| 12 | `lieu-naissance` | label-value | Lieu de naissance / Place of birth → `PARIS (75)` | (33.0, 38.0, 48.0, 5.0) | city + dept. or country |
| 13 | `signature` | signature | Signature | (4.2, 46.8, 24.5, 3.6) | below primary photo |
| 14 | `expiry` | expiry | Date d'expiration / Date of expiry → `15.03.2030` | (44.0, 43.6, 34.0, 5.0) | 10-year validity |
| 15 | `photo-ghost` | photo-ghost | — | (44.0, 45.0, 13.0, 8.0) | DOVID/MLI secondary holographic portrait |
| 16 | `can` | can | CAN → `123456` | (65.5, 46.5, 17.0, 4.2) | 6 digits, card-specific font (PACE) |

---

## 3. BACK (verso)

```
O───────────────────────────────────────────────────────────────────────────────O
│  RÉPUBLIQUE FRANÇAISE                   Taille / Height :     1,75 m          │
│  Adresse / Address :             ┌──────┐  ┌──────────────┐                    │
│  12 RUE DE LA PAIX               │ chip │  │ 2D-Doc (CEV) │                    │
│  75001 PARIS                     │ pict │  │   QR / 2D    │                    │
│                                  └──────┘  │    barcode   │                    │
│  Date de délivrance / Date of issue :      └──────────────┘                    │
│  16.03.2020                                                                   │
│  Autorité de délivrance / Issuing authority :                                │
│  PRÉFECTURE DE POLICE                                                        │
│                                                                              │
│  I<FRA21AA123450<<<<<<<<<<<<<<<                                              │
│  9003152F3003150FRA<<<<<<<<<<<6                                              │
│  DUPONT<<JULIE<MARIE<<<<<<<<<<<                                              │
O───────────────────────────────────────────────────────────────────────────────O
```

### Back elements (rect in mm from top-left)

| # | id | kind | Label / content | Rect (x, y, w, h) | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `header-back` | header | RÉPUBLIQUE FRANÇAISE | (6.0, 3.2, 50.0, 3.2) | repeats with Marianne guilloche motif |
| 2 | `taille` | label-value | Taille / Height → `1,75 m` | (56.0, 4.6, 26.0, 5.0) | height in metres |
| 3 | `adresse` | label-value | Adresse / Address → 2 lines | (5.0, 8.6, 48.0, 12.0) | street + postal city |
| 4 | `date-issue` | label-value | Date de délivrance / Date of issue → `16.03.2020` | (5.0, 21.2, 44.0, 5.0) | DD.MM.YYYY |
| 5 | `autorite` | label-value | Autorité de délivrance / Issuing authority → `PRÉFECTURE DE POLICE` | (5.0, 26.2, 48.0, 5.0) | prefecture / consulate |
| 6 | `chip-symbol` | chip-symbol | — | (56.0, 13.0, 8.0, 8.0) | ICAO contactless biometric-chip pictogram |
| 7 | `barcode-2d` | barcode-2d | 2D-Doc (CEV) | (60.0, 13.0, 21.0, 21.0) | ANTS-signed square 2D barcode |
| 8 | `mrz` | mrz | MRZ · ICAO 9303 TD1 | (3.5, 37.5, 78.6, 12.5) | 3 lines × 30 chars, bottom |

### MRZ (Machine Readable Zone) — ICAO 9303 TD1

Three lines of exactly **30 characters**. The sample below (validated by the app's
`generateTd1Mrz`) encodes the sample holder:

```
I<FRA21AA123450<<<<<<<<<<<<<<<
9003152F3003150FRA<<<<<<<<<<<6
DUPONT<<JULIE<MARIE<<<<<<<<<<<
```

| Line | Positions | Meaning |
| --- | --- | --- |
| 1 | 1–2 | Document code `I<` |
| 1 | 3–5 | Issuing state `FRA` |
| 1 | 6–14 | Document number (9 chars) |
| 1 | 15 | Document-number check digit |
| 1 | 16–30 | Optional / filler |
| 2 | 1–6 | Date of birth YYMMDD |
| 2 | 7 | DOB check digit |
| 2 | 8 | Sex (`M`/`F`) |
| 2 | 9–14 | Expiry YYMMDD |
| 2 | 15 | Expiry check digit |
| 2 | 16–18 | Nationality `FRA` |
| 2 | 19–29 | Optional / composite |
| 2 | 30 | Composite check digit |
| 3 | — | `SURNAME<<GIVEN<NAMES` padded to 30 |

---

## 4. Accuracy notes & source conflicts

Positions above reproduce the compiled public design and are checked against
ISO/IEC 7810, ICAO 9303, EU Reg. 2019/1157 and multiple photographic references.
Exact ANTS/ANSSI overlay coordinates are **not published**, so individual mm rects
are faithful, proportional targets rather than certified prints.

Details that vary slightly between descriptions (and how this spec resolves them):

- **Issue date & authority** — most current sources place them on the **back**
  (`date-issue`, `autorite`); a few older descriptions move the issue date to the
  front. This spec puts issue date + authority on the back, expiry + CAN on the front.
- **Height (`Taille`)** — placed on the **back** next to the address (current format).
- **MRZ format** — the current CNIe uses **TD1 (3×30)** on the back. The pre‑2021
  laminated card used **TD2 (2×36)** with the MRZ on the front; that format is out of scope.

## 5. Sources

- [Wikipedia — French national identity card](https://en.wikipedia.org/wiki/National_identity_card_(France))
- [PRADO — Council of the EU public register of authentic travel documents](https://www.consilium.europa.eu/prado/en/prado-start-page.html) (France CNI entry)
- [EU Regulation 2019/1157 — strengthening the security of identity cards](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019R1157)
- [ISO/IEC 7810 — identification cards formats](https://www.iso.org/standard/43309.html) (ID-1: 85.60 × 53.98 mm)
- [ICAO Doc 9303 — Machine Readable Travel Documents (MRZ/TD1)](https://www.icao.int/publications/pages/publication.aspx?docnum=9303)
