import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Id1Card } from "../app/components/organisms/Id1Card";
import type { ElectronicsFinish } from "../app/components/atoms/Electronics/Electronics.types";
import type { GuillocheVariant } from "../app/components/atoms/Guilloche/Guilloche.types";
import type { Id1CardSide } from "../app/components/organisms/Id1Card/Id1Card.types";

const meta: Meta<typeof Id1Card> = {
  title: "Organisms/Id1Card",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Clean Independent Deck-FX ID-1 Card Component** compliant with ISO/IEC 7810 ID-1 standard dimensions ($85.60\\text{ mm} \\times 53.98\\text{ mm}$).

### Visual & Technical Architecture
- **Targeted Holographic Masked Foil**: Dynamic iridescent foil reflection strictly masked to the procedural Guilloche security curves, reacting in 3D to cursor tilt and angle.
- **Independent Single-Side Views**: Pure separation between \`front\` and \`back\` card configurations with zero legacy flip overhead.
- **Deck-FX 3D Surface Physics**: Smooth gyroscope/cursor parallax tilt, dynamic specular glare, and customizable drop shadows.
- **ISO 7816 Smart Microchip & NFC Geometry**: Authentic smart card contact pads, 4-turn antenna perimeter, and inductive coupling reverse coil.
- **Procedural Guilloche Security Ribbons**: Mathematical spirograph rosettes with moiré interference shading and selective holographic highlights.
- **ICAO 9303 TD-1 Machine Readable Zone**: Compliant machine-readable data block and security signature strip on the reverse face.
- **Glassmorphic Frosted Translucency**: Translucent polycarbonate body with backdrop blur and beveled edge specular reflections.
        `,
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["front", "back"],
      description:
        "Independent card face view (Front credential or Reverse security/MRZ)",
    },
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description:
        "Card orientation (Standard ID-1 landscape or vertical personnel badge)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Predefined standard size tokens or fluid container sizing",
    },
    transparent: {
      control: "boolean",
      description:
        "Glassmorphic transparent acrylic / translucent plastic material",
    },
    holographic: {
      control: "boolean",
      description:
        "Enable dynamic holographic foil reflections targeted to procedural Guilloche curves",
    },
    holoStrength: {
      control: { type: "range", min: 0.1, max: 1.5, step: 0.05 },
      description: "Intensity of the holographic iridescent reflection",
    },
    electronicsFinish: {
      control: "select",
      options: ["gold", "cyan-laser", "copper", "silver"],
      description: "Conductive metallic trace finish",
    },
    guillocheVariant: {
      control: "select",
      options: [
        "holo-spectrum",
        "solarized-gold",
        "cyber-cyan",
        "cosmic-crimson",
        "deep-space",
      ],
      description:
        "Procedural security guilloche color theme and iridescent shimmer gradient",
    },
    showElectronics: {
      control: "boolean",
      description: "Render ISO smart chip and NFC antenna traces",
    },
    showGuilloche: {
      control: "boolean",
      description: "Render procedural security guilloche rosettes",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

/**
 * 1. Standard Front Face (Landscape with Microchip, NFC Antenna, & Cadet Credential)
 */
export const StandardFrontLandscape: Story = {
  args: {
    side: "front",
    orientation: "landscape",
    size: "lg",
    holographic: true,
    holoStrength: 0.75,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    credential: {
      id: "APTI-7810-9402",
      name: "Alex Mercer",
      callSign: "AETH-9042",
      role: "Mission Specialist",
      division: "Orbital Flight Dynamics",
      clearanceLevel: "LEVEL-4 OMNI",
      expiryDate: "2030-08",
    },
  },
};

/**
 * 2. Standard Back Face (Landscape with Magnetic Stripe, Signature Strip, & ICAO 9303 MRZ Zone)
 */
export const StandardBackLandscape: Story = {
  args: {
    side: "back",
    orientation: "landscape",
    size: "lg",
    holographic: true,
    holoStrength: 0.75,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    credential: {
      id: "APTI-7810-9402",
      name: "Alex Mercer",
      securityCode: "781",
    },
  },
};

/**
 * 3. Targeted Holographic Masked Foil on Guilloche Security Curves
 */
export const HolographicGuillocheFoil: Story = {
  args: {
    side: "front",
    orientation: "landscape",
    size: "lg",
    holographic: true,
    holoStrength: 0.95,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "cyan-laser",
    showGuilloche: true,
    guillocheVariant: "cyber-cyan",
  },
};

/**
 * 4. Side-by-Side Dual View (Simultaneous Front & Back Inspection)
 */
export const SideBySideDualView: Story = {
  render: () => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            letterSpacing: "1px",
          }}
        >
          FRONT SIDE (CREDENTIAL &amp; CHIP)
        </Typography>
        <Id1Card
          side="front"
          size="md"
          holographic={true}
          holoStrength={0.8}
          showElectronics={true}
          electronicsFinish="gold"
          showGuilloche={true}
          guillocheVariant="holo-spectrum"
          credential={{
            id: "APTI-7810-9402",
            name: "Alex Mercer",
            callSign: "AETH-9042",
            role: "Mission Specialist",
            division: "Orbital Flight Dynamics",
            clearanceLevel: "LEVEL-4 OMNI",
            expiryDate: "2030-08",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            letterSpacing: "1px",
          }}
        >
          BACK SIDE (MAGSTRIPE &amp; MRZ)
        </Typography>
        <Id1Card
          side="back"
          size="md"
          holographic={true}
          holoStrength={0.8}
          showElectronics={true}
          electronicsFinish="gold"
          showGuilloche={true}
          guillocheVariant="holo-spectrum"
          credential={{
            id: "APTI-7810-9402",
            name: "Alex Mercer",
            securityCode: "781",
          }}
        />
      </Box>
    </Box>
  ),
};

/**
 * 5. Transparent Frosted Acrylic Glassmorphic ID-1 Card (Front View)
 */
export const TransparentAcrylicFront: Story = {
  args: {
    side: "front",
    orientation: "landscape",
    size: "lg",
    transparent: true,
    holographic: true,
    holoStrength: 0.85,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "cyan-laser",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
  },
};

/**
 * 6. Transparent Frosted Acrylic Glassmorphic ID-1 Card (Back View)
 */
export const TransparentAcrylicBack: Story = {
  args: {
    side: "back",
    orientation: "landscape",
    size: "lg",
    transparent: true,
    holographic: true,
    holoStrength: 0.85,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "cyan-laser",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
  },
};

/**
 * 7. Portrait Orientation Personnel Badge
 */
export const PortraitOrientationBadge: Story = {
  args: {
    side: "front",
    orientation: "portrait",
    size: "md",
    holographic: true,
    holoStrength: 0.8,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "solarized-gold",
  },
};

/**
 * 8. Minimalist Blank Card (No Electronics or Guilloche)
 */
export const MinimalistBlankCard: Story = {
  args: {
    side: "front",
    orientation: "landscape",
    size: "lg",
    showGlare: true,
    holographic: false,
    showElectronics: false,
    showGuilloche: false,
  },
};

const PlaygroundWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(4),
  padding: theme.spacing(3),
  width: "100%",
  maxWidth: "900px",
}));

const ControlsGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(2.5),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(15, 23, 42, 0.7)"
      : "rgba(241, 245, 249, 0.9)",
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
}));

function InteractiveCardPlayground() {
  const [side, setSide] = useState<Id1CardSide>("front");
  const [transparent, setTransparent] = useState(false);
  const [holographic, setHolographic] = useState(true);
  const [showElectronics, setShowElectronics] = useState(true);
  const [showGuilloche, setShowGuilloche] = useState(true);
  const [electronicsFinish, setElectronicsFinish] =
    useState<ElectronicsFinish>("gold");
  const [guillocheVariant, setGuillocheVariant] =
    useState<GuillocheVariant>("holo-spectrum");

  return (
    <PlaygroundWrapper>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Independent ID-1 Card Playground ({side.toUpperCase()} VIEW)
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AutorenewIcon />}
          onClick={() =>
            setSide((prev) => (prev === "front" ? "back" : "front"))
          }
        >
          {side === "front" ? "Switch to Back Side" : "Switch to Front Side"}
        </Button>
      </Box>

      <Id1Card
        side={side}
        size="lg"
        transparent={transparent}
        holographic={holographic}
        holoStrength={0.85}
        showGlare
        showElectronics={showElectronics}
        electronicsFinish={electronicsFinish}
        showGuilloche={showGuilloche}
        guillocheVariant={guillocheVariant}
      />

      <ControlsGrid>
        <FormControlLabel
          control={
            <Switch
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
            />
          }
          label="Transparent Acrylic"
        />

        <FormControlLabel
          control={
            <Switch
              checked={holographic}
              onChange={(e) => setHolographic(e.target.checked)}
            />
          }
          label="Holographic Guilloche Foil"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showElectronics}
              onChange={(e) => setShowElectronics(e.target.checked)}
            />
          }
          label="Show Electronics"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showGuilloche}
              onChange={(e) => setShowGuilloche(e.target.checked)}
            />
          }
          label="Show Guilloche"
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="finish-label">Electronics Finish</InputLabel>
          <Select
            labelId="finish-label"
            value={electronicsFinish}
            label="Electronics Finish"
            onChange={(e) =>
              setElectronicsFinish(e.target.value as ElectronicsFinish)
            }
          >
            <MenuItem value="gold">Gold</MenuItem>
            <MenuItem value="cyan-laser">Cyan Laser</MenuItem>
            <MenuItem value="copper">Copper</MenuItem>
            <MenuItem value="silver">Silver</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="variant-label">Guilloche Theme</InputLabel>
          <Select
            labelId="variant-label"
            value={guillocheVariant}
            label="Guilloche Theme"
            onChange={(e) =>
              setGuillocheVariant(e.target.value as GuillocheVariant)
            }
          >
            <MenuItem value="holo-spectrum">Holo Spectrum</MenuItem>
            <MenuItem value="solarized-gold">Solarized Gold</MenuItem>
            <MenuItem value="cyber-cyan">Cyber Cyan</MenuItem>
            <MenuItem value="cosmic-crimson">Cosmic Crimson</MenuItem>
            <MenuItem value="deep-space">Deep Space</MenuItem>
          </Select>
        </FormControl>
      </ControlsGrid>
    </PlaygroundWrapper>
  );
}

export const InteractiveSideSwitcher: Story = {
  render: () => <InteractiveCardPlayground />,
};
