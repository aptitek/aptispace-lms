import { useState, useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "~/components/atoms/LoadingIndicator";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
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
  AccountsList,
  EmptyState,
} from "./DevImpersonator.styles";
import {
  matchesFilter,
  DevAccountItem,
  DevQuickCreateSection,
  DevFilterSection,
} from "./DevImpersonator.components";

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
          <BugReportRoundedIcon />
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
                  <LoadingIndicator size={16} />
                ) : (
                  <RefreshRoundedIcon fontSize="small" />
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
