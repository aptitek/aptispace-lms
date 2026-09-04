import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

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
import { RootContainer, CalendarFrame } from "./planning.styles";
import {
  getSchedulerColor,
  type PlanningLoaderData,
  type InstructorOption,
  type SessionOption,
} from "./planning.types";
import { PlanningHero } from "./planning.hero";
import { PlanningFilter, type AttendanceFilter } from "./planning.filter";
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
  const [selectedFilter, setSelectedFilter] = useState<AttendanceFilter>("all");
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

  const filteredClasses = useMemo(() => {
    if (selectedFilter === "all") return classesState;
    if (selectedFilter === "in_person")
      return classesState.filter((c) => !c.isRemote);
    return classesState.filter((c) => c.isRemote);
  }, [classesState, selectedFilter]);

  const schedulerEvents: SchedulerEvent[] = useMemo(() => {
    return filteredClasses.map((c) => ({
      id: c.id,
      title: c.isRemote ? `[Remote] ${c.title}` : c.title,
      start: new Date(c.startTime).toISOString(),
      end: new Date(c.endTime).toISOString(),
      color: getSchedulerColor(c.isRemote),
      description: c.description ?? undefined,
    }));
  }, [filteredClasses]);

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
            const res = await fetch("/api/classes", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: ne.id,
                startTime: ne.start,
                endTime: ne.end,
              }),
            });
            if (!res.ok) {
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
      const res = await fetch("/api/classes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
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
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "REGENERATE_TOKEN" }),
      });
      const resPayload = (await res.json()) as { feedToken?: string };
      if (res.ok && resPayload.feedToken) {
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
    <RootContainer>
      <PlanningHero
        userRole={loaderData.user.role}
        isAdmin={isAdmin}
        onOpenExport={() => setIsExportModalOpen(true)}
        onAddClass={() => {
          setEditingClass(null);
          setIsFormModalOpen(true);
        }}
      />

      <PlanningFilter
        selectedFilter={selectedFilter}
        onSelectFilter={(newFilter) => {
          setSelectedFilter(newFilter);
          setShowEmptyGrid(false);
        }}
        classes={classesState}
      />

      <CalendarFrame>
        {loadError ? (
          <CalendarErrorState
            onRetry={loadScheduler}
            feedToken={feedTokenState}
            userId={loaderData.user.id}
          />
        ) : !CalendarComponent ? (
          <CalendarSkeleton />
        ) : filteredClasses.length === 0 && !showEmptyGrid ? (
          <CalendarEmptyState
            isFiltered={selectedFilter !== "all"}
            selectedFilter={selectedFilter}
            isAdmin={isAdmin}
            onResetFilter={() => {
              setSelectedFilter("all");
              setShowEmptyGrid(false);
            }}
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
              "& .MuiEventCalendar-timeGridEvent": {
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.01)" },
              },
            }}
          />
        )}
      </CalendarFrame>

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
    </RootContainer>
  );
}
