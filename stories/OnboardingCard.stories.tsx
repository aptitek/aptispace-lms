import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import OnboardingCard from "../app/components/organisms/OnboardingCard/OnboardingCard";
import type {
  SchoolConfig,
  CohortConfig,
  OnboardingProfile,
} from "../app/components/organisms/OnboardingCard/OnboardingCard.types";

const mockSchoolLogo: SchoolConfig = {
  id: "school-aptispace-orbital",
  name: "AptiSpace Orbital Academy",
  slug: "aptispace-orbital-academy",
  logoUrl: "/favicon.svg",
  emailDomain: "cadet.aptispace.io",
  emailPattern: "{first}.{last}@{domain}",
};

const mockSchoolNoLogo: SchoolConfig = {
  id: "school-quantum-aerospace",
  name: "Quantum Aerospace Institute",
  slug: "quantum-aerospace",
  logoUrl: null,
  emailDomain: "quantum-aerospace.edu",
  emailPattern: "{first}.{last}@{domain}",
};

const mockCohort: CohortConfig = {
  id: "cohort-2026",
  name: "Cadet Cohort 2026",
  description: "Avionics and orbital navigation flight cohort.",
};

const mockProfile: OnboardingProfile = {
  firstName: "Alex",
  familyName: "Mercer",
  email: "alex.mercer@cadet.aptispace.io",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  documentNumber: "0942",
  callSign: "AETH-9042",
  clearanceLevel: "LEVEL-4 OMNI",
  division: "Orbital Flight Dynamics",
};

const meta: Meta<typeof OnboardingCard> = {
  title: "Organisms/OnboardingCard",
  component: OnboardingCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "ISO/IEC 7810 ID-1 Interactive Transparent Onboarding Physical Credential. Features large biometric avatar, fields for firstname, familyname, institutional email, holographic school logo, MUI Cohort Chip with academic validity period (Sept 1st to Aug 31st), procedural Guilloche, transparent substrate with exposed contact chip on back left, enlarged holographic AptiSpace logo, and full-width ICAO 9303 TD-1 MRZ zone.",
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["front", "back"],
      description: "Active visible card face",
    },
    transparent: {
      control: "boolean",
      description: "Glassmorphic transparent acrylic substrate",
    },
    holoVariant: {
      control: "select",
      options: ["rainbow", "cosmic", "gold", "default"],
      description: "Holographic spectral reflection theme",
    },
    orientation: {
      control: "radio",
      options: ["landscape", "portrait"],
      description: "Card physical orientation",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "responsive"],
      description: "Dimension preset",
    },
    flipOnClick: {
      control: "boolean",
      description: "Allow clicking card directly to flip 3D",
    },
    readOnly: {
      control: "boolean",
      description: "Disable input fields for preview mode",
    },
  },
  args: {
    school: mockSchoolLogo,
    cohort: mockCohort,
    profile: mockProfile,
    side: "front",
    transparent: true,
    holoVariant: "rainbow",
    orientation: "landscape",
    size: "lg",
    flipOnClick: true,
    readOnly: false,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OnboardingCard>;

export const Default: Story = {
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "primary.light",
        }}
      >
        <TouchAppIcon fontSize="small" />
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Click card to flip 3D • Type into fields or click avatar to edit
        </Typography>
      </Box>
      <OnboardingCard {...args} />
    </Box>
  ),
};

export const SchoolTextFallback: Story = {
  args: {
    school: mockSchoolNoLogo,
    cohort: { name: "Promotion 2026" },
    holoVariant: "rainbow",
    size: "lg",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        When no school logo is provided, falls back to the school name styled
        with clean Material typography.
      </Typography>
      <OnboardingCard {...args} />
    </Box>
  ),
};

export const BackFaceReverse: Story = {
  args: {
    side: "back",
    school: mockSchoolLogo,
    profile: mockProfile,
    size: "lg",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Back side: Exposed contact pads on left, school logo, and full-width MRZ
        zone.
      </Typography>
      <OnboardingCard {...args} />
    </Box>
  ),
};

export const AptiSpaceBrandLogo: Story = {
  args: {
    school: {
      id: "school-aptispace-academy",
      name: "AptiSpace Academy",
      slug: "aptispace-academy",
      logoUrl: "/favicon.svg",
      emailDomain: "cadet.aptispace.io",
      emailPattern: "{first}.{last}@{domain}",
    },
    cohort: mockCohort,
    profile: mockProfile,
    holoVariant: "rainbow",
    size: "lg",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        School logo (favicon) on front badge and AptiSpace branding on back
        face.
      </Typography>
      <OnboardingCard {...args} />
    </Box>
  ),
};

export const CustomValidityDates: Story = {
  args: {
    school: mockSchoolLogo,
    cohort: {
      name: "Astronavigation 2027",
      validFrom: "01/09/2027",
      validUntil: "31/08/2028",
    },
    profile: mockProfile,
    size: "lg",
  },
  render: (args) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Displays non-editable academic school-year validity date (01/09/2027 –
        31/08/2028) next to the MUI Cohort Chip.
      </Typography>
      <OnboardingCard {...args} />
    </Box>
  ),
};

export const GoldThemeSchool: Story = {
  args: {
    school: {
      id: "school-polytechnique-paris",
      name: "École Polytechnique Spatiale",
      slug: "polytechnique-spatiale",
      logoUrl: null,
      emailDomain: "polytechnique.edu",
      emailPattern: "{first}.{last}@{domain}",
    },
    cohort: { name: "Promotion X-2026" },
    profile: {
      firstName: "Éléonore",
      familyName: "Vance",
      email: "eleonore.vance@polytechnique.edu",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
      documentNumber: "7816",
      clearanceLevel: "LEVEL-5 COSMIC",
    },
    holoVariant: "gold",
    size: "lg",
  },
};
