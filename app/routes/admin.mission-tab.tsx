import Box from "@mui/material/Box";
import type { FetcherWithComponents } from "react-router";
import type { MissionCenterData, ErrorStatusType } from "~/types/missionCenter";
import MissionCenter from "~/components/organisms/MissionCenter/MissionCenter";

export interface AdminMissionCenterTabPanelProps {
  missionCenter: MissionCenterData;
  onRefresh: () => void;
  fetcher: FetcherWithComponents<unknown>;
}

export function AdminMissionCenterTabPanel({
  missionCenter,
  onRefresh,
  fetcher,
}: AdminMissionCenterTabPanelProps) {
  const handleUpdateErrorStatus = (
    reportId: string,
    status: ErrorStatusType,
  ) => {
    fetcher.submit(
      { intent: "update-error-status", reportId, status },
      { method: "post" },
    );
  };

  const handleDeleteErrorReport = (reportId: string) => {
    fetcher.submit(
      { intent: "delete-error-report", reportId },
      { method: "post" },
    );
  };

  const handleClearResolvedErrors = () => {
    fetcher.submit({ intent: "clear-resolved-errors" }, { method: "post" });
  };

  return (
    <Box
      role="tabpanel"
      id="admin-tabpanel-2"
      aria-labelledby="admin-tab-2"
      data-testid="admin-tabpanel-mission-center"
      sx={{ width: "100%", mt: 1 }}
    >
      <MissionCenter
        missionData={missionCenter}
        onRefresh={onRefresh}
        onUpdateErrorStatus={handleUpdateErrorStatus}
        onDeleteErrorReport={handleDeleteErrorReport}
        onClearResolvedErrors={handleClearResolvedErrors}
        isSubmitting={fetcher.state !== "idle"}
      />
    </Box>
  );
}
