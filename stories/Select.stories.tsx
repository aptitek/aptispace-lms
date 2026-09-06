import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import Select from "~/components/atoms/Select/Select";
import RoleChip from "~/components/molecules/RoleChip/RoleChip";
import InstitutionChip from "~/components/molecules/InstitutionChip/InstitutionChip";

const meta = {
  title: "Atoms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: "",
    onChange: () => {},
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultOutlinedDemo() {
  const [category, setCategory] = useState("academic");
  return (
    <Box sx={{ width: 260 }}>
      <Select
        label="Category"
        value={category}
        onChange={setCategory}
        options={[
          { value: "all", label: "All Categories" },
          {
            value: "academic",
            label: "Academic Institutions",
            icon: <SchoolRoundedIcon fontSize="small" />,
          },
          {
            value: "company",
            label: "Corporate Partners",
            icon: <BusinessRoundedIcon fontSize="small" />,
          },
        ]}
      />
    </Box>
  );
}

export const DefaultOutlined: Story = {
  render: () => <DefaultOutlinedDemo />,
};

function WithChipsDemo() {
  const [currentRole, setCurrentRole] = useState("student");
  return (
    <Box sx={{ width: 240 }}>
      <Select
        label="Role"
        value={currentRole}
        onChange={setCurrentRole}
        options={[
          { value: "all", label: "All Roles" },
          {
            value: "student",
            chip: <RoleChip userRole="student" size="small" />,
          },
          {
            value: "instructor",
            chip: <RoleChip userRole="instructor" size="small" />,
          },
          {
            value: "admin",
            chip: <RoleChip userRole="admin" size="small" />,
          },
        ]}
      />
    </Box>
  );
}

export const WithChips: Story = {
  render: () => <WithChipsDemo />,
};

function FilledVariantDemo() {
  const [institutionType, setInstitutionType] = useState("school");
  return (
    <Box sx={{ width: 240 }}>
      <Select
        variant="filled"
        label="Institution"
        value={institutionType}
        onChange={setInstitutionType}
        options={[
          {
            value: "school",
            chip: <InstitutionChip institutionType="school" size="small" />,
          },
          {
            value: "company",
            chip: <InstitutionChip institutionType="company" size="small" />,
          },
        ]}
      />
    </Box>
  );
}

export const FilledVariant: Story = {
  render: () => <FilledVariantDemo />,
};
