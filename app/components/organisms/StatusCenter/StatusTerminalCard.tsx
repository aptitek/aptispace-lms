import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useTranslation } from "react-i18next";
import { useStatusCenter } from "~/utils/statusCenterContext";
import { filterTelemetryEvents } from "~/utils/statusCenter.utils";
import { EcgTelemetry } from "~/components/atoms/StatusCenter/EcgTelemetry";
import { FullScreenModal } from "~/components/molecules/FullScreenModal/FullScreenModal";
import { StatusTerminalHeader } from "./StatusTerminalHeader";
import { StatusTerminalInfrastructure } from "./StatusTerminalInfrastructure";
import { StatusTerminalFilterChips } from "./StatusTerminalFilterChips";
import { StatusTerminalEventRow } from "./StatusTerminalEventRow";

export function StatusTerminalCard() {
  const { t } = useTranslation("common");
  const {
    events,
    isTerminalOpen,
    closeTerminal,
    systemStatus,
    bpm,
    activeFilter,
    setActiveFilter,
    clearItem,
    clearAll,
    reportItem,
    simulateEvent,
  } = useStatusCenter();

  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const filteredEvents = filterTelemetryEvents(events, activeFilter);

  const handleToggleExpand = (eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
  };

  return (
    <FullScreenModal
      isOpen={isTerminalOpen}
      onClose={closeTerminal}
      maxWidth={720}
      asCard
      testId="status-terminal-card"
    >
      {/* Terminal Header */}
      <StatusTerminalHeader
        systemStatus={systemStatus}
        bpm={bpm}
        onClose={closeTerminal}
        onSimulate={simulateEvent}
      />

      {/* Cloud Infrastructure Connectivity Monitor */}
      <StatusTerminalInfrastructure />

      {/* Filter Chips Bar */}
      <StatusTerminalFilterChips
        events={events}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onClearAll={clearAll}
      />

      {/* Event List Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "52vh",
        }}
      >
        {filteredEvents.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              color: "text.secondary",
            }}
          >
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: "2.5rem",
                color: "success.main",
                opacity: 0.8,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {events.length === 0
                ? t("systemStatus.noEvents", {
                    defaultValue:
                      "No active diagnostic events. Carrier nominal.",
                  })
                : t("systemStatus.noFilteredEvents", {
                    defaultValue: "No diagnostic events match current filter.",
                  })}
            </Typography>
          </Box>
        ) : (
          filteredEvents.map((eventEntry) => (
            <StatusTerminalEventRow
              key={eventEntry.id}
              eventEntry={eventEntry}
              isExpanded={expandedEventId === eventEntry.id}
              onToggleExpand={() => handleToggleExpand(eventEntry.id)}
              onClear={() => clearItem(eventEntry.id)}
              onReport={reportItem}
            />
          ))
        )}
      </Box>

      {/* Bottom ECG Oscilloscope */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "text.secondary",
            }}
          >
            {t("systemStatus.ecgOscilloscope", {
              defaultValue: "LIVE SYSTEM ACTIVITY MONITOR",
            })}
          </Typography>
        </Box>

        <EcgTelemetry status={systemStatus} bpm={bpm} height={84} />
      </Box>
    </FullScreenModal>
  );
}

export default StatusTerminalCard;
