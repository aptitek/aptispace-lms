import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InstitutionChip from "~/components/atoms/InstitutionChip/InstitutionChip";

export interface InstitutionFilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  testId?: string;
}

export function InstitutionFilterBar({
  query,
  onQueryChange,
  typeFilter,
  onTypeFilterChange,
  testId = "institution-filter-bar",
}: InstitutionFilterBarProps) {
  const { t } = useTranslation("common");

  const endAdornment = query ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        onClick={() => onQueryChange("")}
        aria-label={t("common:clearSearch", "Clear search")}
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        width: "100%",
        p: 2,
        mb: 3,
        borderRadius: "12px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
      data-testid={testId}
    >
      <TextField
        select
        size="small"
        label={t("filterBar.institutionType", "Institution Type")}
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        slotProps={{
          select: {
            renderValue: (selectedType) => (
              <InstitutionChip
                institutionType={String(selectedType)}
                size="small"
              />
            ),
          },
        }}
        sx={{ minWidth: 180 }}
        data-testid="institution-type-filter"
      >
        <MenuItem value="all" sx={{ py: 0.75 }}>
          <InstitutionChip institutionType="all" size="small" />
        </MenuItem>
        <MenuItem value="academic" sx={{ py: 0.75 }}>
          <InstitutionChip institutionType="school" size="small" />
        </MenuItem>
        <MenuItem value="company" sx={{ py: 0.75 }}>
          <InstitutionChip institutionType="company" size="small" />
        </MenuItem>
      </TextField>

      <TextField
        size="small"
        placeholder={t(
          "filterBar.searchInstitutions",
          "Search institutions by name or slug...",
        )}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment,
          },
        }}
        sx={{
          flex: 1,
          minWidth: 200,
        }}
        data-testid="institution-search-field"
      />
    </Box>
  );
}

export default InstitutionFilterBar;
