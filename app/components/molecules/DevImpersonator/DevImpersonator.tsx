import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "react-material-expressive";
import BugReportIcon from "@mui/icons-material/BugReport";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Avatar from "~/components/atoms/Avatar/Avatar";
import {
  getRoleAvatarShape,
  type ExpressiveShapeName,
} from "~/components/atoms/Avatar/shapes";
import {
  type AccountDefinition,
  type UserRole,
  fetchAccountsFromDb,
  createAccountInDb,
} from "~/utils/auth";
import type {
  DevImpersonatorProps,
  RoleFilterOption,
} from "./DevImpersonator.types";
import {
  DevContainer,
  ToolHeader,
  HeaderTitle,
  HeaderActions,
  ModeBadge,
  QuickCreateSection,
  QuickCreateHeader,
  QuickCreateButtonGroup,
  RoleCreateButton,
  FilterBar,
  SearchField,
  SegmentedFilter,
  FilterPill,
  AccountsList,
  AccountCard,
  AccountCardLeft,
  AccountAvatarWrapper,
  AccountDetails,
  AccountNameRow,
  AccountName,
  AccountMeta,
  AccountAction,
  EmptyState,
  StatusPill,
} from "./DevImpersonator.styles";

function resolveAvatarShape(role: UserRole): ExpressiveShapeName {
  return getRoleAvatarShape(role);
}

function resolveRoleChipColor(
  role: UserRole,
): "secondary" | "info" | "success" | "default" {
  switch (role) {
    case "admin":
      return "secondary";
    case "instructor":
      return "info";
    case "student":
      return "success";
    default:
      return "default";
  }
}

function matchesFilter(
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

interface DevAccountItemProps {
  account: AccountDefinition;
  isSelected: boolean;
  isCurrent: boolean;
  disabled: boolean;
  onSelect: (account: AccountDefinition) => void;
}

function DevAccountItem({
  account,
  isSelected,
  isCurrent,
  disabled,
  onSelect,
}: DevAccountItemProps) {
  const { t } = useTranslation("auth");
  const avatarShape = resolveAvatarShape(account.role);
  const chipColor = resolveRoleChipColor(account.role);
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
            shape={avatarShape}
            role={account.role}
            width={34}
            height={34}
            isPortrait={false}
          />
        </AccountAvatarWrapper>

        <AccountDetails>
          <AccountNameRow>
            <AccountName variant="body2">{account.name}</AccountName>

            <Chip
              color={chipColor}
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
            <CheckCircleIcon color="success" sx={{ fontSize: "1.1rem" }} />
          </Tooltip>
        ) : (
          <ArrowForwardIcon />
        )}
      </AccountAction>
    </AccountCard>
  );
}

interface DevQuickCreateSectionProps {
  isLoading: boolean;
  isCreatingRole: UserRole | null;
  onQuickCreate: (role: UserRole) => void;
}

function DevQuickCreateSection({
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
          <PersonAddAlt1Icon sx={{ fontSize: 14 }} />
          <span>{t("devTool.newAccount", "New Account")}</span>
        </Box>
        {isCreatingRole && (
          <Chip
            size="small"
            icon={<LoadingIndicator className="!size-3.5 [&>svg]:!size-3.5" />}
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
              Icon: SchoolIcon,
            },
            {
              role: "instructor" as const,
              labelKey: "devTool.newInstructor",
              defaultLabel: "+ Instructor",
              tooltipKey: "devTool.createInstructorTooltip",
              defaultTooltip:
                "Create a new Instructor account (Triggers Onboarding)",
              Icon: SupervisorAccountIcon,
            },
            {
              role: "admin" as const,
              labelKey: "devTool.newAdmin",
              defaultLabel: "+ Admin",
              tooltipKey: "devTool.createAdminTooltip",
              defaultTooltip:
                "Create a new Administrator account (Triggers Onboarding)",
              Icon: AdminPanelSettingsIcon,
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
                    <LoadingIndicator className="!size-3.5 [&>svg]:!size-3.5" />
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

interface DevFilterSectionProps {
  filterRole: RoleFilterOption;
  roleCounts: Record<RoleFilterOption, number>;
  searchQuery: string;
  onFilterChange: (role: RoleFilterOption) => void;
  onSearchChange: (query: string) => void;
}

function DevFilterSection({
  filterRole,
  roleCounts,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: DevFilterSectionProps) {
  const { t } = useTranslation("auth");

  return (
    <FilterBar>
      <SegmentedFilter role="tablist" aria-label="Filter accounts by role">
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
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </FilterBar>
  );
}

export default function DevImpersonator({
  onSelectAccount,
  onSelectPersona,
  onAccountCreated,
  currentUserId,
  loading: externalLoading = false,
  initialAccounts,
  className,
  "data-testid": dataTestId = "dev-impersonator",
}: DevImpersonatorProps) {
  const { t } = useTranslation("auth");

  const [accounts, setAccounts] = useState<AccountDefinition[]>(
    () => initialAccounts || [],
  );
  const [selectedId, setSelectedId] = useState<string>(() => {
    return currentUserId || (initialAccounts?.[0]?.id ?? accounts[0]?.id ?? "");
  });
  const [filterRole, setFilterRole] = useState<RoleFilterOption>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isCreatingRole, setIsCreatingRole] = useState<UserRole | null>(null);

  const loadAccounts = async () => {
    setIsFetching(true);
    try {
      const fetched = await fetchAccountsFromDb();
      setAccounts(fetched);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!initialAccounts) {
      void loadAccounts();
    }
  }, [initialAccounts]);

  const handleSelect = (account: AccountDefinition) => {
    setSelectedId(account.id);
    if (onSelectAccount) {
      onSelectAccount(account);
    } else if (onSelectPersona) {
      onSelectPersona(account.role);
    }
  };

  const handleQuickCreate = async (role: UserRole) => {
    setIsCreatingRole(role);
    try {
      const newAccount = await createAccountInDb(role);
      if (newAccount) {
        setAccounts((prev) => [
          newAccount,
          ...prev.filter((a) => a.id !== newAccount.id),
        ]);
        setSelectedId(newAccount.id);
        onAccountCreated?.(newAccount);
        if (onSelectAccount) {
          onSelectAccount(newAccount);
        } else if (onSelectPersona) {
          onSelectPersona(newAccount.role);
        }
      }
    } finally {
      setIsCreatingRole(null);
    }
  };

  const roleCounts = useMemo(() => {
    const counts = {
      all: accounts.length,
      admin: 0,
      instructor: 0,
      student: 0,
    };
    for (const acc of accounts) {
      if (acc.role in counts) {
        counts[acc.role as UserRole]++;
      }
    }
    return counts;
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) =>
      matchesFilter(acc, filterRole, searchQuery),
    );
  }, [accounts, filterRole, searchQuery]);

  const isLoading = externalLoading || isFetching;

  return (
    <DevContainer
      elevation={0}
      aria-label={t("devTool.ariaLabel")}
      className={className}
      data-testid={dataTestId}
    >
      <ToolHeader>
        <HeaderTitle>
          <BugReportIcon />
          <span>{t("devTool.title")}</span>
        </HeaderTitle>

        <HeaderActions>
          <Tooltip title={t("devTool.refresh", "Refresh accounts")} arrow>
            <span>
              <IconButton
                size="small"
                onClick={loadAccounts}
                disabled={isLoading}
                aria-label={t("devTool.refresh", "Refresh accounts")}
                sx={{ color: "text.secondary" }}
              >
                {isFetching ? (
                  <LoadingIndicator className="!size-4 [&>svg]:!size-4" />
                ) : (
                  <RefreshIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <ModeBadge size="small" label={t("devTool.modeBadge")} />
        </HeaderActions>
      </ToolHeader>

      <DevQuickCreateSection
        isLoading={isLoading}
        isCreatingRole={isCreatingRole}
        onQuickCreate={handleQuickCreate}
      />

      <DevFilterSection
        filterRole={filterRole}
        roleCounts={roleCounts}
        searchQuery={searchQuery}
        onFilterChange={setFilterRole}
        onSearchChange={setSearchQuery}
      />

      {/* Accounts List */}
      <AccountsList role="listbox" aria-label={t("devTool.groupAriaLabel")}>
        {filteredAccounts.length === 0 ? (
          <EmptyState>
            <Typography variant="body2">
              {t("devTool.emptyState", "No accounts found in database")}
            </Typography>
          </EmptyState>
        ) : (
          filteredAccounts.map((account) => (
            <DevAccountItem
              key={account.id}
              account={account}
              isSelected={selectedId === account.id}
              isCurrent={currentUserId === account.id}
              disabled={isLoading}
              onSelect={handleSelect}
            />
          ))
        )}
      </AccountsList>
    </DevContainer>
  );
}
