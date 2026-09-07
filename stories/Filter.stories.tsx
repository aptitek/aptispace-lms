import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Filter from "../app/components/molecules/Filter";
import Chip from "../app/components/atoms/Chip/Chip";

const meta = {
  title: "Molecules/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Generic Filter molecule with modular fields (Select, Number, Range, Custom), search, and reset capabilities. Supports both declarative configuration and compound component composition.",
      },
    },
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive story using Declarative Configuration
 */
function DeclarativeFilterDemo() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [level, setLevel] = useState<string | number>(1);
  const [startYearMin, setStartYearMin] = useState<number | null>(2024);
  const [startYearMax, setStartYearMax] = useState<number | null>(2026);

  const hasActive = Boolean(
    query.trim().length > 0 ||
    role !== "all" ||
    level !== 1 ||
    startYearMin !== null ||
    startYearMax !== null,
  );

  const handleClear = () => {
    setQuery("");
    setRole("all");
    setLevel(1);
    setStartYearMin(null);
    setStartYearMax(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 960, p: 2 }}>
      <Filter
        testId="storybook-declarative-filter"
        fields={[
          {
            type: "select",
            id: "role",
            label: "User Role",
            value: role,
            onChange: setRole,
            minWidth: 170,
            options: [
              { value: "all", chip: <Chip userRole="all" size="small" /> },
              {
                value: "student",
                chip: <Chip userRole="student" size="small" />,
              },
              {
                value: "instructor",
                chip: <Chip userRole="instructor" size="small" />,
              },
              {
                value: "admin",
                chip: <Chip userRole="admin" size="small" />,
              },
            ],
          },
          {
            type: "number",
            id: "level",
            label: "Level",
            value: level,
            onChange: setLevel,
            min: 1,
            max: 5,
          },
          {
            type: "range",
            id: "years",
            startYearMin,
            startYearMax,
            onStartYearMinChange: setStartYearMin,
            onStartYearMaxChange: setStartYearMax,
          },
        ]}
        search={{
          value: query,
          onChange: setQuery,
          placeholder: "Search users or records...",
        }}
        onClear={handleClear}
        hasActiveFilters={hasActive}
      />
    </Box>
  );
}

export const DeclarativeMode: Story = {
  render: () => <DeclarativeFilterDemo />,
};

/**
 * Interactive story using Compound Components API
 */
function CompoundFilterDemo() {
  const [query, setQuery] = useState("");
  const [instType, setInstType] = useState("all");
  const [startYearMin, setStartYearMin] = useState<number | null>(null);
  const [startYearMax, setStartYearMax] = useState<number | null>(null);

  const isDirty = query.trim().length > 0 || instType !== "all";

  return (
    <Box sx={{ width: "100%", maxWidth: 960, p: 2 }}>
      <Filter testId="storybook-compound-filter">
        <Filter.Select
          label="Institution Type"
          value={instType}
          onChange={setInstType}
          minWidth={180}
          renderValue={(selectedType) => (
            <Chip institutionType={String(selectedType)} size="small" />
          )}
          options={[
            {
              value: "all",
              chip: <Chip institutionType="all" size="small" />,
            },
            {
              value: "academic",
              chip: <Chip institutionType="school" size="small" />,
            },
            {
              value: "company",
              chip: <Chip institutionType="company" size="small" />,
            },
          ]}
        />
        <Filter.Range
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={setStartYearMin}
          onStartYearMaxChange={setStartYearMax}
        />
        {isDirty && (
          <Filter.Clear
            onClear={() => {
              setQuery("");
              setInstType("all");
              setStartYearMin(null);
              setStartYearMax(null);
            }}
          />
        )}
        <Filter.Spacer />
        <Filter.Search
          value={query}
          onChange={setQuery}
          placeholder="Search institutions (name, slug)..."
          minWidth={260}
        />
      </Filter>
    </Box>
  );
}

export const CompoundMode: Story = {
  render: () => <CompoundFilterDemo />,
};

function CohortFilterDemo() {
  const [query, setQuery] = useState("");
  const [diploma, setDiploma] = useState("all");
  const [year, setYear] = useState<string | number>("all");
  const [tag, setTag] = useState("all");
  const [startYearMin, setStartYearMin] = useState<number | null>(null);
  const [startYearMax, setStartYearMax] = useState<number | null>(null);

  const hasActive =
    query.trim().length > 0 ||
    diploma !== "all" ||
    (year !== "all" && year !== "") ||
    tag !== "all" ||
    startYearMin !== null ||
    startYearMax !== null;

  return (
    <Box sx={{ width: "100%", maxWidth: 960, p: 2 }}>
      <Filter testId="storybook-cohort-filter">
        <Filter.Select
          label="Diploma"
          value={diploma}
          onChange={setDiploma}
          minWidth={150}
          options={[
            { value: "all", label: <em>All Diplomas</em> },
            { value: "B", label: "B – Bachelor" },
            { value: "M", label: "M – Master" },
            { value: "MBA", label: "MBA – Master of Business Administration" },
          ]}
        />
        <Filter.Number
          label="Year"
          placeholder="All"
          value={year}
          onChange={setYear}
          min={0}
          max={20}
        />
        <Filter.Select
          label="Specialty"
          value={tag}
          onChange={setTag}
          minWidth={160}
          options={[
            { value: "all", label: <em>All Specialties</em> },
            { value: "IA", label: "Artificial Intelligence" },
            { value: "Dev", label: "Software Development" },
            { value: "Cyber", label: "Cybersecurity" },
          ]}
        />
        <Filter.Range
          startYearMin={startYearMin}
          startYearMax={startYearMax}
          onStartYearMinChange={setStartYearMin}
          onStartYearMaxChange={setStartYearMax}
        />
        {hasActive && (
          <Filter.Clear
            onClear={() => {
              setQuery("");
              setDiploma("all");
              setYear("all");
              setTag("all");
              setStartYearMin(null);
              setStartYearMax(null);
            }}
          />
        )}
        <Filter.Spacer />
        <Filter.Search
          value={query}
          onChange={setQuery}
          placeholder="Search cohorts (name, tag, year)..."
          minWidth={260}
        />
      </Filter>
    </Box>
  );
}

export const CohortFilterMode: Story = {
  render: () => <CohortFilterDemo />,
};
