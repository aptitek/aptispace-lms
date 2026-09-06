import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useTranslation } from "react-i18next";
import Chip from "~/components/atoms/Chip/Chip";
import Avatar from "~/components/atoms/Avatar/Avatar";
import LoadingIndicator from "~/components/atoms/LoadingIndicator";
import RoleChip from "../RoleChip/RoleChip";
import { getRoleConfig } from "~/tokens/roles";
import type { AccountDefinition, UserRole } from "~/utils/auth";
import type { RoleFilterOption } from "./DevImpersonator.types";
import {
  QuickCreateSection,
  QuickCreateHeader,
  QuickCreateButtonGroup,
  RoleCreateButton,
  FilterBar,
  SearchField,
  SegmentedFilter,
  FilterPill,
  AccountCard,
  AccountCardLeft,
  AccountAvatarWrapper,
  AccountDetails,
  AccountNameRow,
  AccountName,
  AccountMeta,
  AccountAction,
  StatusPill,
} from "./DevImpersonator.styles";

export function matchesFilter(
  account: AccountDefinition,
  filterRole: RoleFilterOption,
  searchQuery: string,
): boolean {
  if (filterRole !== "all" && account.role !== filterRole) {
    return false;
  }
  const query = searchQuery.toLowerCase().trim();
  if (query.length === 0) return true;

  return (
    account.name.toLowerCase().includes(query) ||
    account.email.toLowerCase().includes(query) ||
    account.role.toLowerCase().includes(query)
  );
}

export interface DevAccountItemProps {
  account: AccountDefinition;
  isSelected: boolean;
  isCurrent: boolean;
  disabled: boolean;
  onSelect: (account: AccountDefinition) => void;
}

export function DevAccountItem({
  account,
  isSelected,
  isCurrent,
  disabled,
  onSelect,
}: DevAccountItemProps) {
  const { t } = useTranslation("auth");
  const roleConfig = getRoleConfig(account.role);
  const roleLabel = t(`devTool.roles.${account.role}` as const, {
    defaultValue: account.role,
  });

  return (
    <AccountCard
      isSelected={isSelected}
      isCurrent={isCurrent}
      accountRole={account.role}
      disabled={disabled}
      onClick={() => onSelect(account)}
      role="option"
      aria-selected={isSelected}
      data-testid={`account-card-${account.id}`}
    >
      <AccountCardLeft>
        <AccountAvatarWrapper>
          <Avatar
            name={account.name}
            shape={roleConfig.avatarShape}
            role={account.role}
            width={34}
            height={34}
            isPortrait={false}
          />
        </AccountAvatarWrapper>

        <AccountDetails>
          <AccountNameRow>
            <AccountName variant="body2">{account.name}</AccountName>

            <RoleChip
              userRole={account.role}
              variant={isSelected ? "filled" : "outlined"}
              label={roleLabel}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 800,
                "& .MuiChip-label": { px: 0.6 },
              }}
            />

            {account.isProfileComplete === false && (
              <StatusPill
                label={t("devTool.pendingOnboarding", "Onboarding Pending")}
                color="warning"
                size="small"
              />
            )}
          </AccountNameRow>

          <AccountMeta>
            <span>{account.email || account.title || "No email assigned"}</span>
          </AccountMeta>
        </AccountDetails>
      </AccountCardLeft>

      <AccountAction>
        {isCurrent ? (
          <Tooltip title={t("devTool.currentSession", "Current Session")}>
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: "1.1rem" }}
            />
          </Tooltip>
        ) : (
          <ArrowForwardRoundedIcon />
        )}
      </AccountAction>
    </AccountCard>
  );
}

export interface DevQuickCreateSectionProps {
  isLoading: boolean;
  isCreatingRole: UserRole | null;
  onQuickCreate: (role: UserRole) => void;
}

export function DevQuickCreateSection({
  isLoading,
  isCreatingRole,
  onQuickCreate,
}: DevQuickCreateSectionProps) {
  const { t } = useTranslation("auth");
  const isActionDisabled = isLoading || Boolean(isCreatingRole);

  return (
    <QuickCreateSection>
      <QuickCreateHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PersonAddAlt1RoundedIcon sx={{ fontSize: 14 }} />
          <span>{t("devTool.newAccount", "New Account")}</span>
        </Box>
        {isCreatingRole && (
          <Chip
            size="small"
            icon={<LoadingIndicator size={14} />}
            label={t("devTool.creatingAccount", "Creating account...")}
            variant="outlined"
            color="warning"
            sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700 }}
          />
        )}
      </QuickCreateHeader>

      <QuickCreateButtonGroup>
        {(
          [
            {
              role: "student" as const,
              labelKey: "devTool.newStudent",
              defaultLabel: "+ Student",
              tooltipKey: "devTool.createStudentTooltip",
              defaultTooltip:
                "Create a new Student account (Triggers Onboarding)",
              Icon: SchoolRoundedIcon,
            },
            {
              role: "instructor" as const,
              labelKey: "devTool.newInstructor",
              defaultLabel: "+ Instructor",
              tooltipKey: "devTool.createInstructorTooltip",
              defaultTooltip:
                "Create a new Instructor account (Triggers Onboarding)",
              Icon: SupervisorAccountRoundedIcon,
            },
            {
              role: "admin" as const,
              labelKey: "devTool.newAdmin",
              defaultLabel: "+ Admin",
              tooltipKey: "devTool.createAdminTooltip",
              defaultTooltip:
                "Create a new Administrator account (Triggers Onboarding)",
              Icon: AdminPanelSettingsRoundedIcon,
            },
          ] as const
        ).map(
          ({
            role,
            labelKey,
            defaultLabel,
            tooltipKey,
            defaultTooltip,
            Icon,
          }) => (
            <Tooltip
              key={role}
              title={t(tooltipKey, defaultTooltip)}
              arrow
              placement="top"
            >
              <Box
                component="span"
                sx={{ display: "inline-flex", width: "100%" }}
              >
                <RoleCreateButton
                  roleType={role}
                  disabled={isActionDisabled}
                  onClick={() => onQuickCreate(role)}
                  data-testid={`create-${role}-btn`}
                >
                  {isCreatingRole === role ? (
                    <LoadingIndicator size={14} />
                  ) : (
                    <Icon />
                  )}
                  <span>{t(labelKey, defaultLabel)}</span>
                </RoleCreateButton>
              </Box>
            </Tooltip>
          ),
        )}
      </QuickCreateButtonGroup>
    </QuickCreateSection>
  );
}

export interface DevFilterSectionProps {
  filterRole: RoleFilterOption;
  roleCounts: Record<RoleFilterOption, number>;
  searchQuery: string;
  onFilterChange: (role: RoleFilterOption) => void;
  onSearchChange: (query: string) => void;
}

export function DevFilterSection({
  filterRole,
  roleCounts,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: DevFilterSectionProps) {
  const { t } = useTranslation("auth");

  return (
    <FilterBar>
      <SegmentedFilter
        role="tablist"
        aria-label={t("devTool.filterAria", "Filter accounts by role")}
      >
        {(["all", "student", "instructor", "admin"] as const).map((role) => {
          const isActive = filterRole === role;
          const label =
            role === "all"
              ? t("devTool.filterAll", "All")
              : t(`devTool.roles.${role}` as const, { defaultValue: role });
          const count = roleCounts[role];

          return (
            <FilterPill
              key={role}
              isActive={isActive}
              onClick={() => onFilterChange(role)}
              role="tab"
              aria-selected={isActive}
              data-testid={`filter-${role}`}
            >
              <span>
                {label} ({count})
              </span>
            </FilterPill>
          );
        })}
      </SegmentedFilter>

      <SearchField
        size="small"
        placeholder={t("devTool.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          htmlInput: {
            "aria-label": t("devTool.searchPlaceholder"),
            "data-testid": "accounts-search-input",
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </FilterBar>
  );
}
