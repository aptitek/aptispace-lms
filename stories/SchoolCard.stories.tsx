import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import {
  SchoolCard,
  SchoolCardSkeleton,
} from "~/components/molecules/SchoolCard/SchoolCard";
import type { SchoolConfig } from "~/types/institution";

const mockAcademicSchool: SchoolConfig = {
  id: "school-aptitek",
  name: "Aptitek Institute of Technology",
  slug: "aptitek",
  logoUrl: "/aptitek-logo.svg",
  type: "academic",
  emailDomain: "aptitek.io",
};

const mockCompanySchool: SchoolConfig = {
  id: "school-enterprise",
  name: "Aerospace Industries Corp",
  slug: "aero-corp",
  logoUrl: "/favicon.svg",
  type: "company",
  emailDomain: "aerospace.internal",
};

const meta = {
  title: "Molecules/SchoolCard",
  component: SchoolCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 340, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    school: mockAcademicSchool,
  },
} satisfies Meta<typeof SchoolCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AcademicSchool: Story = {
  args: {
    school: mockAcademicSchool,
    studentCount: 120,
  },
};

export const CompanyPartner: Story = {
  args: {
    school: mockCompanySchool,
    studentCount: 35,
  },
};

export const FallbackWithoutLogo: Story = {
  args: {
    school: {
      id: "school-unregistered",
      name: "Galactic Polytechnic",
      slug: "gal-poly",
      logoUrl: "",
      type: "academic",
    },
    studentCount: 14,
  },
};

export const Selected: Story = {
  args: {
    school: mockAcademicSchool,
    studentCount: 120,
    isSelected: true,
  },
};

export const Interactive: Story = {
  args: {
    school: mockAcademicSchool,
    studentCount: 120,
    onClick: (school) => alert(`Selected school: ${school.name}`),
  },
};

export const SkeletonInteractiveAdd: Story = {
  render: () => (
    <SchoolCardSkeleton onClick={() => alert("Add School triggered")} />
  ),
};

export const SkeletonStaticLoading: Story = {
  render: () => <SchoolCardSkeleton />,
};
