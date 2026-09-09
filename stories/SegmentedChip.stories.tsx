import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import SegmentedChip from "../app/components/molecules/SegmentedChip/SegmentedChip";

const meta: Meta<typeof SegmentedChip> = {
  title: "Molecules/SegmentedChip",
  component: SegmentedChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Generic, multi-segment compound chip component. Renders compound chips with individual styled segments, tooltips, custom dividers, M3 expressive shapes, and delete action.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Size preset",
    },
    variant: {
      control: "radio",
      options: ["outlined", "filled"],
      description: "Visual surface treatment",
    },
    shape: {
      control: "text",
      description:
        "Expressive chip shape preset ('pill', 'bun', 'arch', 'asymmetric', etc.)",
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedChip>;

export const Default: Story = {
  args: {
    segments: [
      {
        label: "STATUS",
        bold: true,
        background: "rgba(34, 197, 94, 0.15)",
        color: "#22c55e",
      },
      { label: "Healthy" },
      { label: "99.9%", mono: true },
    ],
    size: "medium",
    variant: "outlined",
  },
};

export const BuildAndGit: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
    >
      <SegmentedChip
        leading={{
          label: "main",
          bold: true,
          background: "rgba(56, 189, 248, 0.15)",
          color: "#0284c7",
        }}
        items={[
          { label: "55a21f3", mono: true },
          {
            label: "passing",
            icon: (
              <CheckCircleOutlineRoundedIcon
                sx={{ fontSize: 14, color: "#22c55e" }}
              />
            ),
          },
        ]}
        size="small"
      />

      <SegmentedChip
        segments={[
          { label: "v2.4.0", bold: true, mono: true },
          { label: "release", tooltip: "Stable release build" },
          { label: "x86_64", mono: true },
        ]}
        size="medium"
        variant="filled"
      />
    </Box>
  ),
};

export const KeyValueMetrics: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}
    >
      <SegmentedChip
        leading={{
          label: "CPU",
          bold: true,
          icon: <MemoryRoundedIcon sx={{ fontSize: 16 }} />,
        }}
        items={[{ label: "42%", mono: true }]}
        size="small"
      />
      <SegmentedChip
        leading={{ label: "RAM", bold: true }}
        items={[{ label: "1.4 GB / 8 GB", mono: true }]}
        size="small"
      />
      <SegmentedChip
        leading={{ label: "PING", bold: true }}
        items={[{ label: "14ms", mono: true }]}
        size="small"
      />
    </Box>
  ),
};

export const CohortBadgePreset: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Structured Cohort Data (`cohort` prop)
      </Typography>
      <Box
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        <SegmentedChip
          cohort={{ diploma: "M", year: 1, tags: ["IA", "Dev"] }}
          size="small"
        />
        <SegmentedChip
          cohort={{ diploma: "B", year: 3, tags: ["Cyber", "Sec"] }}
          size="medium"
        />
        <SegmentedChip
          cohort={{ diploma: "M", year: 2, tags: ["Data", "Cloud"] }}
          size="large"
          onDelete={() => alert("Deleted!")}
        />
      </Box>
    </Box>
  ),
};

export const ExpressiveShapes: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}
    >
      <SegmentedChip
        segments={[{ label: "Pill", bold: true }, { label: "Default" }]}
        shape="pill"
      />
      <SegmentedChip
        segments={[{ label: "Bun", bold: true }, { label: "Shape" }]}
        shape="bun"
      />
      <SegmentedChip
        segments={[{ label: "Arch", bold: true }, { label: "Shape" }]}
        shape="arch"
      />
      <SegmentedChip
        segments={[{ label: "Asymmetric", bold: true }, { label: "Shape" }]}
        shape="asymmetric"
      />
    </Box>
  ),
};

export const InteractiveAndDeletable: Story = {
  render: () => (
    <Box
      sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}
    >
      <SegmentedChip
        segments={[{ label: "Filter", bold: true }, { label: "Active" }]}
        onClick={() => alert("Chip clicked!")}
      />
      <SegmentedChip
        segments={[{ label: "Tag", bold: true }, { label: "Frontend" }]}
        onDelete={() => alert("Delete tag!")}
      />
      <SegmentedChip
        segments={[{ label: "Disabled", bold: true }, { label: "State" }]}
        disabled
        onDelete={() => {}}
      />
    </Box>
  ),
};

export const EditableInPlace: Story = {
  render: () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 700 }}>
            Single-Click In-Place Editing (Press Enter or blur to save, Escape to cancel):
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <SegmentedChip
              editable
              segments={[
                { label: "STATUS", bold: true, background: "rgba(56, 189, 248, 0.15)", color: "#0284c7" },
                { label: "In Review" },
                { label: "v1.2.0", mono: true },
              ]}
              size="medium"
            />
            <SegmentedChip
              editable
              segments={[
                { label: "COHORT", bold: true },
                { label: "M2026" },
                { label: "AI & Data" },
              ]}
              size="small"
              shape="bun"
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.5, fontWeight: 700 }}>
            Double-Click Editing &amp; Per-Segment Control (Leading segment locked, second segment editable):
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <SegmentedChip
              editTrigger="doubleClick"
              segments={[
                { label: "LOCKED", bold: true, editable: false, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444" },
                { label: "Double-click me to edit", editable: true },
              ]}
              size="medium"
            />
          </Box>
        </Box>
      </Box>
    );
  },
};

