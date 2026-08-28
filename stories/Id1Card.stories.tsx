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

const meta: Meta<typeof Id1Card> = {
  title: "Organisms/Id1Card",
  component: Id1Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Clean Deck-FX ID-1 Card Component** compliant with ISO/IEC 7810 ID-1 standard dimensions ($85.60\\text{ mm} \\times 53.98\\text{ mm}$).

### Visual Features
- **Deck-FX 3D Card Engine**: Realistic gyroscope/mouse 3D parallax tilt, dynamic specular glare physics, and smooth spring-driven flip animations.
- **Glassmorphic Transparent Option**: Frosted acrylic / translucent plastic body with backdrop blur and beveled edge specular reflections.
- **Selective Holographic Foil**: Foil reflections strictly restricted to the procedural Guilloche security curves and user-specified masks (\`maskUrl\`).
- **ISO 7816 & 14443 Electronics**: Microchip, 4-turn perimeter NFC antenna, inductive coupling coil, and seamless symmetrical interconnects.
- **Procedural Guilloche Security Geometry**: Mathematical spirograph rosettes and wave ribbons with non-clamping overflow that create authentic moiré interference patterns.
- **Dual-Side Independent Configuration**: Complete freedom to toggle and style electronics, guilloche, and user content separately for front and back faces.
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description:
        "Card orientation (Standard ID-1 landscape or vertical ID badge)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description:
        "Predefined responsive size tokens or fluid container sizing",
    },
    transparent: {
      control: "boolean",
      description:
        "Glassmorphic transparent acrylic / translucent plastic material",
    },
    electronicsFinish: {
      control: "select",
      options: ["gold", "cyan-laser", "copper", "silver"],
      description: "Conductive trace finish metallic appearance",
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
        "Security guilloche color theme and iridescent shimmer gradient",
    },
    showElectronics: {
      control: "boolean",
      description:
        "Render ISO 7816 chip and ISO 14443 NFC antenna traces on front",
    },
    showGuilloche: {
      control: "boolean",
      description: "Render procedural security guilloche rosettes on front",
    },
    showBackElectronics: {
      control: "boolean",
      description: "Render reverse inductive electronics on card back",
    },
    showBackGuilloche: {
      control: "boolean",
      description: "Render security guilloche rosettes on card back",
    },
    holographic: {
      control: "boolean",
      description:
        "Enable selective holographic foil lighting on guilloche curves",
    },
    interactive: {
      control: "boolean",
      description: "Enable click-to-flip interaction with 3D animation",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Id1Card>;

/**
 * 1. Clean Deck-FX ID-1 Card (Standard Landscape with Electronics & Guilloche)
 */
export const StandardLandscape: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    interactive: true,
    holographic: true,
    holoStrength: 0.65,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    showBackElectronics: false,
    showBackGuilloche: true,
  },
};

/**
 * 2. Transparent Frosted Acrylic Glassmorphic ID-1 Card
 */
export const TransparentAcrylic: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    transparent: true,
    interactive: true,
    holographic: true,
    holoStrength: 0.75,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "cyan-laser",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    showBackElectronics: false,
    showBackGuilloche: true,
  },
};

/**
 * 3. Cyan Laser Electronics Finish with High-Density Cyber Guilloche
 */
export const DualInterfaceCyanLaser: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    interactive: true,
    holographic: true,
    holoStrength: 0.8,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "cyan-laser",
    showGuilloche: true,
    guillocheVariant: "cyber-cyan",
    showBackElectronics: true,
    backElectronicsFinish: "cyan-laser",
    showBackGuilloche: true,
    backGuillocheVariant: "cyber-cyan",
  },
};

/**
 * 4. Flipped Reverse Side View (Inductive Coil & Reverse Guilloche)
 */
export const FlippedReverseSide: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    isFlipped: true,
    interactive: true,
    holographic: true,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "holo-spectrum",
    showBackElectronics: true,
    backElectronicsFinish: "gold",
    showBackGuilloche: true,
    backGuillocheVariant: "holo-spectrum",
  },
};

/**
 * 5. Portrait Orientation Space Agency Badge
 */
export const PortraitBadge: Story = {
  args: {
    orientation: "portrait",
    size: "md",
    interactive: true,
    holographic: true,
    holoStrength: 0.7,
    showGlare: true,
    showElectronics: true,
    electronicsFinish: "gold",
    showGuilloche: true,
    guillocheVariant: "solarized-gold",
    showBackElectronics: true,
    backElectronicsFinish: "gold",
    showBackGuilloche: true,
    backGuillocheVariant: "solarized-gold",
  },
};

/**
 * 6. Minimalist Blank Card (No Electronics or Guilloche)
 */
export const MinimalistBlankCard: Story = {
  args: {
    orientation: "landscape",
    size: "lg",
    interactive: true,
    holographic: false,
    showGlare: true,
    showElectronics: false,
    showGuilloche: false,
    showBackElectronics: false,
    showBackGuilloche: false,
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

function InteractiveDeckFxEditorStory() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [showElectronics, setShowElectronics] = useState(true);
  const [showGuilloche, setShowGuilloche] = useState(true);
  const [showBackElectronics, setShowBackElectronics] = useState(false);
  const [showBackGuilloche, setShowBackGuilloche] = useState(true);
  const [electronicsFinish, setElectronicsFinish] =
    useState<ElectronicsFinish>("gold");
  const [guillocheVariant, setGuillocheVariant] =
    useState<GuillocheVariant>("holo-spectrum");
  const [holographic, setHolographic] = useState(true);

  return (
    <PlaygroundWrapper>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Deck-FX ID-1 Card Playground
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AutorenewIcon />}
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          {isFlipped ? "Flip to Front" : "Flip to Back"}
        </Button>
      </Box>

      <Id1Card
        size="lg"
        transparent={transparent}
        isFlipped={isFlipped}
        onFlipChange={setIsFlipped}
        interactive
        holographic={holographic}
        holoStrength={0.7}
        showGlare
        showElectronics={showElectronics}
        electronicsFinish={electronicsFinish}
        showGuilloche={showGuilloche}
        guillocheVariant={guillocheVariant}
        showBackElectronics={showBackElectronics}
        backElectronicsFinish={electronicsFinish}
        showBackGuilloche={showBackGuilloche}
        backGuillocheVariant={guillocheVariant}
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
          label="Holographic Foil"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showElectronics}
              onChange={(e) => setShowElectronics(e.target.checked)}
            />
          }
          label="Front Electronics"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showGuilloche}
              onChange={(e) => setShowGuilloche(e.target.checked)}
            />
          }
          label="Front Guilloche"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showBackElectronics}
              onChange={(e) => setShowBackElectronics(e.target.checked)}
            />
          }
          label="Back Electronics"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showBackGuilloche}
              onChange={(e) => setShowBackGuilloche(e.target.checked)}
            />
          }
          label="Back Guilloche"
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

export const LiveInteractiveEditor: Story = {
  render: () => <InteractiveDeckFxEditorStory />,
};
