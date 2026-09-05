import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { alpha } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Fab from "@mui/material/Fab";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// MUI X Scheduler Types
import type { EventCalendar } from "@mui/x-scheduler/event-calendar";
import type {
  SchedulerEvent,
  SchedulerChangeEventDetails,
  SchedulerEventEditingStartEventDetails,
  SchedulerRenderableEventOccurrence,
} from "@mui/x-scheduler/models";

type EventCalendarComponentType = typeof EventCalendar;

// Domain & Auth
import { authGuard } from "~/utils/session.server";
import { resolveActiveUser } from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";
import { getDatabaseFromContext } from "~/db";
import {
  getClassesForUser,
  getEligibleInstructors,
  ensureCalendarFeedToken,
  type ClassWithDetails,
} from "~/services/classService";

// Shared submodules
import Tooltip from "~/components/atoms/Tooltip/Tooltip";
import { PlanningLayout } from "~/components/templates/PlanningLayout";
import { CalendarFrame } from "./planning.styles";
import {
  mapClassToSchedulerEvent,
  type PlanningLoaderData,
  type InstructorOption,
  type SessionOption,
} from "./planning.types";
import { PlanningHero } from "./planning.hero";
import { CalendarHeaderTooltips } from "./planning.tooltips";
import {
  CalendarSkeleton,
  CalendarErrorState,
  CalendarEmptyState,
} from "./planning.states";
import { ClassDetailsDialog } from "./planning.details-dialog";
import { ClassFormDialog } from "./planning.form-dialog";
import { CalendarExportDialog } from "./planning.export-dialog";

export function meta() {
  return [
    { title: "AptiSpace LMS • Planning & Timetable" },
    {
      name: "description",
      content:
        "Interactive academic planning, scheduled classes, and cohort timetables with live iCal subscription.",
    },
  ];
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth?.user || !isUserProfileComplete(auth.user)) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/onboarding" },
    });
  }

  const activeUser = resolveActiveUser(auth.user, auth.session);
  if (!activeUser) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/onboarding" },
    });
  }

  const db = getDatabaseFromContext(context) || auth.db;
  if (!db) {
    throw new Response("Database unavailable", { status: 503 });
  }

  const classesList = await getClassesForUser(db, activeUser);
  const feedToken = await ensureCalendarFeedToken(db, activeUser.id);

  let eligibleInstructors: InstructorOption[] = [];
  let availableSessions: SessionOption[] = [];

  if (activeUser.role === "admin") {
    const rawInstructors = await getEligibleInstructors(db);
    eligibleInstructors = rawInstructors.map((inst) => ({
      id: inst.id,
      name: inst.name,
      email: inst.email,
      role: inst.role,
    }));

    const rawSessions = await db.query.sessions.findMany({
      with: {
        course: true,
        cohort: true,
      },
    });

    availableSessions = rawSessions.map((s) => ({
      id: s.id,
      courseTitle: s.course.title,
      cohortName: `${s.cohort.diploma} Year ${s.cohort.year}`,
    }));
  }

  return {
    user: activeUser,
    classes: classesList,
    feedToken,
    instructors: eligibleInstructors,
    sessions: availableSessions,
  };
}

export default function Planning() {
  const { t } = useTranslation("common");
  const loaderData = useLoaderData<PlanningLoaderData>();
  const [classesState, setClassesState] = useState<ClassWithDetails[]>(
    loaderData.classes,
  );
  const [feedTokenState, setFeedTokenState] = useState<string>(
    loaderData.feedToken,
  );
  const calendarFrameRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [showEmptyGrid, setShowEmptyGrid] = useState<boolean>(false);
  const [CalendarComponent, setCalendarComponent] =
    useState<EventCalendarComponentType | null>(null);

  const [selectedClass, setSelectedClass] = useState<ClassWithDetails | null>(
    null,
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassWithDetails | null>(
    null,
  );
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const isAdmin = loaderData.user.role === "admin";

  const loadScheduler = useCallback(() => {
    setLoadError(false);
    import("@mui/x-scheduler/event-calendar")
      .then((mod) => {
        setCalendarComponent(() => mod.EventCalendar);
      })
      .catch(() => {
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    loadScheduler();
  }, [loadScheduler]);

  const schedulerEvents: SchedulerEvent[] = useMemo(() => {
    return classesState.map(mapClassToSchedulerEvent);
  }, [classesState]);

  const handleEventsChange = useCallback(
    async (
      newEvents: SchedulerEvent[],
      _eventDetails: SchedulerChangeEventDetails,
    ) => {
      if (!isAdmin) return;

      for (const ne of newEvents) {
        const orig = classesState.find((c) => c.id === ne.id);
        if (!orig) continue;

        const origStartIso = new Date(orig.startTime).toISOString();
        const origEndIso = new Date(orig.endTime).toISOString();

        if (origStartIso !== ne.start || origEndIso !== ne.end) {
          setClassesState((prev) =>
            prev.map((c) =>
              c.id === ne.id
                ? {
                    ...c,
                    startTime: new Date(ne.start),
                    endTime: new Date(ne.end),
                  }
                : c,
            ),
          );

          try {
            const apiResponse = await fetch("/api/classes", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: ne.id,
                startTime: ne.start,
                endTime: ne.end,
              }),
            });
            if (!apiResponse.ok) {
              setClassesState((prev) =>
                prev.map((c) => (c.id === orig.id ? orig : c)),
              );
              setSnackbarMessage(t("planning.messages.updateFailed"));
            } else {
              setSnackbarMessage(t("planning.messages.updated"));
            }
          } catch {
            setClassesState((prev) =>
              prev.map((c) => (c.id === orig.id ? orig : c)),
            );
            setSnackbarMessage(t("planning.messages.updateError"));
          }
          break;
        }
      }
    },
    [isAdmin, classesState, t],
  );

  const handleEventEditingStart = useCallback(
    (
      occurrence: SchedulerRenderableEventOccurrence,
      eventDetails: SchedulerEventEditingStartEventDetails,
    ) => {
      eventDetails.cancel();
      if (eventDetails.reason === "creation") {
        if (isAdmin) {
          setEditingClass(null);
          setIsFormModalOpen(true);
        }
      } else {
        const found = classesState.find((c) => c.id === occurrence.id);
        if (found) setSelectedClass(found);
      }
    },
    [isAdmin, classesState],
  );

  const handleDeleteClass = async (id: string) => {
    if (!isAdmin || !window.confirm(t("planning.messages.confirmDelete"))) {
      return;
    }

    try {
      const apiResponse = await fetch("/api/classes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (apiResponse.ok) {
        setClassesState((prev) => prev.filter((c) => c.id !== id));
        setSelectedClass(null);
        setSnackbarMessage(t("planning.messages.deleted"));
      } else {
        setSnackbarMessage(t("planning.messages.deleteFailed"));
      }
    } catch {
      setSnackbarMessage(t("planning.messages.deleteError"));
    }
  };

  const handleRegenerateToken = async () => {
    if (!isAdmin || !window.confirm(t("planning.messages.confirmRegenerate"))) {
      return;
    }

    try {
      const apiResponse = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "REGENERATE_TOKEN" }),
      });
      const resPayload = (await apiResponse.json()) as { feedToken?: string };
      if (apiResponse.ok && resPayload.feedToken) {
        setFeedTokenState(resPayload.feedToken);
        setSnackbarMessage(t("planning.messages.tokenRotated"));
      } else {
        setSnackbarMessage(t("planning.messages.tokenRotateFailed"));
      }
    } catch {
      setSnackbarMessage(t("planning.messages.tokenRotateError"));
    }
  };

  return (
    <PlanningLayout
      hero={
        <PlanningHero
          userRole={loaderData.user.role}
          isAdmin={isAdmin}
          onOpenExport={() => setIsExportModalOpen(true)}
        />
      }
      calendar={
        <CalendarFrame ref={calendarFrameRef}>
          <CalendarHeaderTooltips containerRef={calendarFrameRef} />
          {loadError ? (
            <CalendarErrorState
              onRetry={loadScheduler}
              feedToken={feedTokenState}
              userId={loaderData.user.id}
            />
          ) : !CalendarComponent ? (
            <CalendarSkeleton />
          ) : classesState.length === 0 && !showEmptyGrid ? (
            <CalendarEmptyState
              isAdmin={isAdmin}
              onAddClass={() => {
                setEditingClass(null);
                setIsFormModalOpen(true);
              }}
              onShowGrid={() => setShowEmptyGrid(true)}
            />
          ) : (
            <CalendarComponent
              events={schedulerEvents}
              onEventsChange={handleEventsChange}
              onEventEditingStart={handleEventEditingStart}
              views={["day", "week", "month", "agenda"]}
              defaultView="week"
              readOnly={!isAdmin}
              areEventsDraggable={isAdmin}
              areEventsResizable={isAdmin}
              sx={{
                height: "760px",
                fontFamily: "inherit",
              }}
            />
          )}
          {isAdmin && (
            <Tooltip
              title={t("planning.addClass", "Add Class")}
              placement="left"
              arrow
            >
              <Fab
                color="primary"
                aria-label={t("planning.addClass", "Add Class")}
                data-testid="planning-add-class-fab"
                onClick={() => {
                  setEditingClass(null);
                  setIsFormModalOpen(true);
                }}
                sx={{
                  position: "absolute",
                  bottom: { xs: 20, sm: 24 },
                  right: { xs: 20, sm: 24 },
                  zIndex: 20,
                  width: 64,
                  height: 64,
                  borderRadius: "20px",
                  boxShadow: (theme) =>
                    `0 10px 28px -4px ${alpha(theme.palette.primary.main, 0.45)}, 0 4px 12px rgba(0,0,0,0.15)`,
                  transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
                  "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: (theme) =>
                      `0 14px 32px -4px ${alpha(theme.palette.primary.main, 0.6)}, 0 6px 16px rgba(0,0,0,0.2)`,
                  },
                  "&:active": {
                    transform: "scale(0.96)",
                  },
                }}
              >
                <AddRoundedIcon sx={{ fontSize: "2.25rem" }} />
              </Fab>
            </Tooltip>
          )}
        </CalendarFrame>
      }
      dialogs={
        <>
          {selectedClass && (
            <ClassDetailsDialog
              classItem={selectedClass}
              isAdmin={isAdmin}
              onClose={() => setSelectedClass(null)}
              onEdit={() => {
                setEditingClass(selectedClass);
                setSelectedClass(null);
                setIsFormModalOpen(true);
              }}
              onDelete={() => handleDeleteClass(selectedClass.id)}
            />
          )}

          {isAdmin && isFormModalOpen && (
            <ClassFormDialog
              editingClass={editingClass}
              sessions={loaderData.sessions}
              instructors={loaderData.instructors}
              onClose={() => {
                setIsFormModalOpen(false);
                setEditingClass(null);
              }}
              onSaved={(savedClass) => {
                if (editingClass) {
                  setClassesState((prev) =>
                    prev.map((c) => (c.id === savedClass.id ? savedClass : c)),
                  );
                  setSnackbarMessage(t("planning.messages.updated"));
                } else {
                  setClassesState((prev) => [...prev, savedClass]);
                  setSnackbarMessage(t("planning.messages.created"));
                }
                setIsFormModalOpen(false);
                setEditingClass(null);
              }}
            />
          )}

          <CalendarExportDialog
            open={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            feedToken={feedTokenState}
            isAdmin={isAdmin}
            userId={loaderData.user.id}
            onRegenerateToken={handleRegenerateToken}
            onNotify={(msg) => setSnackbarMessage(msg)}
          />
        </>
      }
      feedback={
        <Snackbar
          open={Boolean(snackbarMessage)}
          autoHideDuration={4000}
          onClose={() => setSnackbarMessage(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarMessage(null)}
            severity="success"
            sx={{ borderRadius: "14px", fontWeight: 600 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      }
    />
  );
}
