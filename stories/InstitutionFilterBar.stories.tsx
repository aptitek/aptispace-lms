import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import InstitutionFilterBar, {
  type InstitutionFilterBarProps,
} from "../app/components/molecules/InstitutionFilterBar/InstitutionFilterBar";

const meta = {
  title: "Molecules/InstitutionFilterBar",
  component: InstitutionFilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "InstitutionFilterBar molecule for filtering institutions by search keywords (name, slug) and category types (School, Institution).",
      },
    },
  },
  args: {
    query: "",
    onQueryChange: () => {},
    typeFilter: "all",
    onTypeFilterChange: () => {},
  },
} satisfies Meta<typeof InstitutionFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultFilterBarStory(args: InstitutionFilterBarProps) {
  const [query, setQuery] = useState(args.query || "");
  const [typeFilter, setTypeFilter] = useState(args.typeFilter || "all");

  return (
    <Box sx={{ width: "100%", maxWidth: 800, p: 2 }}>
      <InstitutionFilterBar
        query={query}
        onQueryChange={setQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </Box>
  );
}

export const Default: Story = {
  render: (args) => <DefaultFilterBarStory {...args} />,
};

function FilteredByCompanyStory(args: InstitutionFilterBarProps) {
  const [query, setQuery] = useState(args.query);
  const [typeFilter, setTypeFilter] = useState(args.typeFilter);

  return (
    <Box sx={{ width: "100%", maxWidth: 800, p: 2 }}>
      <InstitutionFilterBar
        query={query}
        onQueryChange={setQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
    </Box>
  );
}

export const FilteredByCompany: Story = {
  args: {
    query: "Aptitek",
    typeFilter: "company",
  },
  render: (args) => <FilteredByCompanyStory {...args} />,
};
