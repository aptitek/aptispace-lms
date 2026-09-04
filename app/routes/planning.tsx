import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import Chip from "~/components/atoms/Chip/Chip";
import { authGuard } from "~/utils/session.server";
import { resolveActiveUser } from "~/utils/auth";
import { isUserProfileComplete } from "~/services/userService";
import { getCourses } from "~/services/courseService";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const auth = await authGuard(request, context);
  if (!auth || !auth.user || !isUserProfileComplete(auth.user)) {
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
  const coursesList = auth.db ? await getCourses(auth.db).catch(() => []) : [];

  return {
    user: activeUser,
    coursesCount: coursesList.length,
  };
}

export function meta() {
  return [
    { title: "AptiSpace LMS • Planning & Timetable" },
    {
      name: "description",
      content:
        "Interactive academic planning, lectures, labs, and cohort timetables.",
    },
  ];
}

const PlanningContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  padding: theme.spacing(4, 3),
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5, 2),
    gap: theme.spacing(2.5),
  },
}));

const HeroCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3.5, 4),
  borderRadius: "24px",
  backgroundColor: alpha(theme.palette.primary.main, 0.04),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
  backdropFilter: "blur(16px)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  ...theme.applyStyles("dark", {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
  }),
}));

const FilterRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const TimetableGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: theme.spacing(2.5),
}));

const SeanceCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$isNext",
})<{ $isNext?: boolean }>(({ theme, $isNext }) => ({
  padding: theme.spacing(2.5),
  borderRadius: "18px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${
    $isNext
      ? alpha(theme.palette.primary.main, 0.4)
      : alpha(theme.palette.divider, 0.8)
  }`,
  boxShadow: $isNext
    ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`
    : "none",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  transition: theme.transitions.create(
    ["border-color", "box-shadow", "transform"],
    {
      duration: theme.transitions.duration.shorter,
    },
  ),
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.main,
  },
}));

interface MockSeance {
  id: string;
  courseTitle: string;
  moduleCode: string;
  type: "lecture" | "lab" | "workshop";
  startTime: string;
  endTime: string;
  location: string;
  isNext?: boolean;
}

const SAMPLE_SEANCES: MockSeance[] = [
  {
    id: "s-1",
    courseTitle: "Cloud Infrastructure & Edge Computing",
    moduleCode: "INFRA-401",
    type: "lecture",
    startTime: "09:00",
    endTime: "11:30",
    location: "Amphitheater Turing",
    isNext: true,
  },
  {
    id: "s-2",
    courseTitle: "Microservices & Distributed Systems",
    moduleCode: "ARCH-502",
    type: "lab",
    startTime: "13:00",
    endTime: "16:00",
    location: "Lab Room Kepler-12",
  },
  {
    id: "s-3",
    courseTitle: "Fullstack Architecture & GraphQL",
    moduleCode: "DEV-301",
    type: "workshop",
    startTime: "16:30",
    endTime: "18:30",
    location: "Studio Ada Lovelace",
  },
];

function resolveTypeColor(
  type: MockSeance["type"],
): "primary" | "secondary" | "default" {
  if (type === "lecture") return "primary";
  if (type === "lab") return "secondary";
  return "default";
}

export default function Planning() {
  const loaderData = useLoaderData<typeof loader>();
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = SAMPLE_SEANCES.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <PlanningContainer data-testid="planning-page-container">
      <HeroCard>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <CalendarMonthRoundedIcon color="primary" sx={{ fontSize: 24 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Academic Planning & Timetable
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {loaderData.user.name}. View your scheduled lectures,
            laboratories, and cohort sessions.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<SchoolRoundedIcon sx={{ fontSize: 16 }} />}
            label={loaderData.user.cohort?.name || "Master's Degree"}
            color="primary"
            variant="filled"
          />
          <Chip
            icon={<EventAvailableRoundedIcon sx={{ fontSize: 16 }} />}
            label="Spring 2026"
            variant="outlined"
          />
        </Box>
      </HeroCard>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Today's Schedule
        </Typography>

        <FilterRow>
          {["all", "lecture", "lab", "workshop"].map((ft) => (
            <Button
              key={ft}
              size="small"
              variant={filterType === ft ? "contained" : "text"}
              onClick={() => setFilterType(ft)}
              sx={{
                borderRadius: "16px",
                textTransform: "capitalize",
                px: 2,
                fontSize: "0.75rem",
                fontWeight: filterType === ft ? 700 : 500,
              }}
            >
              {ft}
            </Button>
          ))}
        </FilterRow>
      </Box>

      <TimetableGrid data-testid="timetable-grid">
        {filtered.map((seance) => (
          <SeanceCard
            key={seance.id}
            $isNext={seance.isNext}
            data-testid={`seance-card-${seance.id}`}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                label={seance.moduleCode}
                size="small"
                color={resolveTypeColor(seance.type)}
                sx={{ fontWeight: 700, fontSize: "0.7rem" }}
              />
              {seance.isNext && (
                <Chip
                  label="NEXT UP"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 800, fontSize: "0.65rem" }}
                />
              )}
            </Box>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.3 }}
            >
              {seance.courseTitle}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                mt: "auto",
                pt: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  fontSize: "0.8rem",
                }}
              >
                <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />
                <span>
                  {seance.startTime} - {seance.endTime}
                </span>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  fontSize: "0.8rem",
                }}
              >
                <LocationOnRoundedIcon sx={{ fontSize: 16 }} />
                <span>{seance.location}</span>
              </Box>
            </Box>
          </SeanceCard>
        ))}
      </TimetableGrid>
    </PlanningContainer>
  );
}
