import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useTranslation } from "react-i18next";
import Chip from "~/components/atoms/Chip/Chip";
import Avatar from "~/components/atoms/Avatar/Avatar";
import LoadingIndicator from "~/components/atoms/LoadingIndicator";
import Select from "~/components/atoms/Select/Select";
import type { SelectOption } from "~/components/atoms/Select/Select.types";
import Filter from "~/components/molecules/Filter/Filter";
import RoleChip from "../RoleChip/RoleChip";
import { getRoleConfig } from "~/tokens/roles";
import type { AccountDefinition, UserRole } from "~/utils/auth";
import type { UserCardData } from "../UserCard/UserCard.types";
import type { RoleFilterOption } from "./DevImpersonator.types";
import {
  QuickCreateSection,
  QuickCreateHeader,
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

export function mapAccountToUserCard(account: AccountDefinition): UserCardData {
  const parts = (account.name || "").trim().split(" ");
  const firstName = parts[0] || account.name || "User";
  const familyName = parts.slice(1).join(" ") || "";

  return {
    id: account.id,
    firstName,
    familyName,
    displayName: account.name,
    email: account.email,
    role: account.role,
    avatarUrl: account.avatarUrl,
    githubUsername: account.githubUsername,
    cohortName: account.cohortName,
    institutionName: account.institutionName,
    institutionId: account.institutionId,
    isProfileComplete: account.isProfileComplete ?? true,
  };
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
            <AccountName>{account.name}</AccountName>
            {isCurrent && (
              <Tooltip title={t("devTool.currentSessionTooltip")} arrow>
                <StatusPill
                  isCurrent
                  size="small"
                  icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 11 }} />}
                  label={t("devTool.currentSession")}
                />
              </Tooltip>
            )}
            {account.isProfileComplete === false && (
              <Tooltip title={t("devTool.pendingOnboardingTooltip")} arrow>
                <StatusPill
                  size="small"
                  label={t("devTool.pendingOnboarding")}
                />
              </Tooltip>
            )}
          </AccountNameRow>

          <AccountMeta>
            <span>{account.email}</span>
            <span>•</span>
            <RoleChip
              userRole={account.role}
              size="small"
              testId={`role-chip-${account.id}`}
            />
          </AccountMeta>
        </AccountDetails>
      </AccountCardLeft>

      <AccountAction>
        <Tooltip
          title={t("devTool.impersonateTooltip", { role: roleLabel })}
          arrow
          placement="left"
        >
          <span>
            <Chip
              size="small"
              variant={isSelected ? "filled" : "outlined"}
              color="primary"
              label={
                isSelected ? t("devTool.active") : t("devTool.impersonate")
              }
              icon={
                isSelected ? (
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 13 }} />
                ) : (
                  <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
                )
              }
              sx={{
                height: 24,
                fontSize: "0.7rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            />
          </span>
        </Tooltip>
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
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const isActionDisabled = isLoading || Boolean(isCreatingRole);

  const roleOptions: SelectOption<UserRole>[] = [
    {
      value: "student",
      label: t("devTool.roles.student", "Student"),
      chip: <RoleChip userRole="student" size="small" />,
    },
    {
      value: "instructor",
      label: t("devTool.roles.instructor", "Instructor"),
      chip: <RoleChip userRole="instructor" size="small" />,
    },
    {
      value: "admin",
      label: t("devTool.roles.admin", "Admin"),
      chip: <RoleChip userRole="admin" size="small" />,
    },
  ];

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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: "100%",
        }}
      >
        <Select<UserRole>
          value={selectedRole}
          onChange={(newRole) => setSelectedRole(newRole as UserRole)}
          options={roleOptions}
          size="small"
          disabled={isActionDisabled}
          label={t("devTool.selectRole", "Role")}
          testId="create-role-select"
          data-testid="create-role-select"
          sx={{ minWidth: 140, flex: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={isActionDisabled}
          onClick={() => onQuickCreate(selectedRole)}
          startIcon={
            isCreatingRole ? (
              <LoadingIndicator size={14} />
            ) : (
              <PersonAddAlt1RoundedIcon fontSize="small" />
            )
          }
          data-testid="create-user-btn"
          sx={{
            fontWeight: 700,
            textTransform: "none",
            borderRadius: (theme) => theme.shape.corners.medium,
            height: 38,
            px: 2,
            whiteSpace: "nowrap",
          }}
        >
          {t("devTool.createUser", "Create User")}
        </Button>
      </Box>
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
    <Filter
      testId="dev-impersonator-filter"
      data-testid="dev-impersonator-filter"
      sx={{
        backgroundColor: "transparent",
        border: "none",
        p: 0,
        boxShadow: "none",
        gap: 1.5,
      }}
    >
      <Filter.Search
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t("devTool.searchPlaceholder", "Search accounts...")}
        testId="accounts-search-input"
        data-testid="accounts-search-input"
        sx={{ flex: 1 }}
      />
      <Filter.Select<RoleFilterOption>
        value={filterRole}
        onChange={(newFilterRole) =>
          onFilterChange(newFilterRole as RoleFilterOption)
        }
        label={t("devTool.filterRole", "Role")}
        testId="accounts-role-filter"
        data-testid="accounts-role-filter"
        minWidth={130}
        options={[
          {
            value: "all",
            label: `${t("devTool.filterAll", "All")} (${roleCounts.all})`,
          },
          {
            value: "student",
            label: `${t("devTool.roles.student", "Student")} (${roleCounts.student})`,
            chip: <RoleChip userRole="student" size="small" />,
          },
          {
            value: "instructor",
            label: `${t("devTool.roles.instructor", "Instructor")} (${roleCounts.instructor})`,
            chip: <RoleChip userRole="instructor" size="small" />,
          },
          {
            value: "admin",
            label: `${t("devTool.roles.admin", "Admin")} (${roleCounts.admin})`,
            chip: <RoleChip userRole="admin" size="small" />,
          },
        ]}
      />
    </Filter>
  );
}
