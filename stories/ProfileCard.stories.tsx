import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import { ProfileCard } from "../app/components/organisms/ProfileCard";

const meta: Meta<typeof ProfileCard> = {
  title: "Organisms/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          p: 4,
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {
    institutionName: "AptiSpace Academy",
    cohortName: "Web Development",
    year: "2026",
    role: "student",
    firstName: "Alex",
    familyName: "Mercer",
    emailPrefix: "alex.mercer",
    emailDomain: "@aptispace.com",
    githubUsername: "alexmercer",
    mrzData: {
      documentCode: "I",
      issuingState: "APT",
      documentNumber: "0942",
      birthDate: "990101",
      sex: "M",
      expiryDate: "300828",
      nationality: "APT",
      surname: "MERCER",
      givenNames: "ALEX",
    },
    sx: { width: 540 },
  },
};

export const Instructor: Story = {
  args: {
    institutionName: "AptiSpace Academy",
    role: "instructor",
    firstName: "Sarah",
    familyName: "Connor",
    emailPrefix: "sarah.connor",
    emailDomain: "@aptispace.com",
    githubUsername: "sconnor_apti",
    mrzData: {
      documentCode: "I",
      issuingState: "APT",
      documentNumber: "1122",
      birthDate: "850512",
      sex: "F",
      expiryDate: "300828",
      nationality: "APT",
      surname: "CONNOR",
      givenNames: "SARAH",
    },
    sx: { width: 540 },
  },
};

export const Admin: Story = {
  args: {
    institutionName: "AptiSpace Academy",
    role: "admin",
    firstName: "Ada",
    familyName: "Lovelace",
    emailPrefix: "ada.lovelace",
    emailDomain: "@aptispace.com",
    githubUsername: "adalovelace",
    mrzData: {
      documentCode: "I",
      issuingState: "APT",
      documentNumber: "0001",
      birthDate: "151210",
      sex: "F",
      expiryDate: "300828",
      nationality: "APT",
      surname: "LOVELACE",
      givenNames: "ADA",
    },
    sx: { width: 540 },
  },
};
