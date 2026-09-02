import type { EntityCardData } from "~/components/molecules/EntityCard/EntityCard.types";
import type { SchoolConfig } from "~/types/institution";
import type { CohortWithInstitution } from "~/components/organisms/StudentInspector/StudentInspector.types";

export function getDefaultSchools(): SchoolConfig[] {
  return [
    {
      id: "school-aptitek",
      name: "Aptitek",
      slug: "aptitek",
      type: "company",
      logoUrl: "/aptitek-logo.svg",
      emailDomain: "aptitek.io",
      usernamePattern: "{first}.{last}",
    },
    {
      id: "school-42",
      name: "42 Paris",
      slug: "42paris",
      type: "academic",
      logoUrl: "/aptitek-logo.svg",
      emailDomain: "42.fr",
      usernamePattern: "{f}{last}",
    },
  ];
}

export function getDefaultCohorts(): CohortWithInstitution[] {
  return [
    {
      id: "cohort-2027",
      name: "Cohort 2027",
      institutionId: "school-aptitek",
      startDate: "2027-09-01",
      endDate: "2028-06-30",
    },
    {
      id: "cohort-2026",
      name: "Cohort 2026",
      institutionId: "school-aptitek",
      startDate: "2026-09-01",
      endDate: "2027-06-30",
    },
    {
      id: "cohort-42-2026",
      name: "42 Common Core 2026",
      institutionId: "school-42",
      startDate: "2026-10-01",
      endDate: "2027-09-30",
    },
    {
      id: "cohort-2025",
      name: "Cohort 2025",
      institutionId: "school-aptitek",
      startDate: "2025-09-01",
      endDate: "2026-06-30",
    },
  ];
}

export function getDefaultStudents(): EntityCardData[] {
  return [
    {
      id: "std-001",
      firstName: "Alexandre",
      familyName: "MOREAU",
      displayName: "Alexandre MOREAU",
      email: "alexandre.moreau@aptitek.io",
      role: "student",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      githubUsername: "amoreau",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "std-002",
      firstName: "Thomas",
      familyName: "DUBOIS",
      displayName: "Thomas DUBOIS",
      email: "thomas.dubois@aptitek.io",
      role: "student",
      githubUsername: "tdubois",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: false,
    },
    {
      id: "std-003",
      firstName: "Sophie",
      familyName: "LAURENT",
      displayName: "Sophie LAURENT",
      email: "sophie.laurent@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "std-004",
      firstName: "Maxime",
      familyName: "LEROY",
      displayName: "Maxime LEROY",
      email: "maxime.leroy@aptitek.io",
      role: "student",
      githubUsername: "mleroy",
      cohortName: "Cohort 2025",
      cohortId: "cohort-2025",
      cohortStartYear: "2025",
      cohorts: [
        {
          id: "cohort-2025",
          name: "Cohort 2025",
          startYear: "2025",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "std-005",
      firstName: "Camille",
      familyName: "ROUX",
      displayName: "Camille ROUX",
      email: "camille.roux@aptitek.io",
      role: "student",
      githubUsername: "croux",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "std-006",
      firstName: "Lucas",
      familyName: "GARCIA",
      displayName: "Lucas GARCIA",
      email: "lucas.garcia@aptitek.io",
      role: "student",
      cohortName: "Cohort 2026",
      cohortId: "cohort-2026",
      cohortStartYear: "2026",
      cohorts: [
        {
          id: "cohort-2026",
          name: "Cohort 2026",
          startYear: "2026",
          institutionId: "school-aptitek",
          institutionName: "Aptitek",
        },
      ],
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: false,
    },
  ];
}

export function getDefaultInstructors(): EntityCardData[] {
  return [
    {
      id: "inst-001",
      firstName: "Sarah",
      familyName: "CONNOR",
      displayName: "Sarah CONNOR",
      email: "sarah.connor@aptitek.io",
      role: "instructor",
      avatarUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      githubUsername: "sconnor",
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
    {
      id: "inst-002",
      firstName: "Marcus",
      familyName: "AURELIUS",
      displayName: "Marcus AURELIUS",
      email: "marcus.aurelius@aptitek.io",
      role: "instructor",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      githubUsername: "maurelius",
      institutionId: "school-42",
      institutionName: "42 Paris",
      isProfileComplete: true,
    },
    {
      id: "inst-003",
      firstName: "Elena",
      familyName: "ROSTOVA",
      displayName: "Elena ROSTOVA",
      email: "elena.rostova@aptitek.io",
      role: "instructor",
      githubUsername: "erostova",
      institutionId: "school-aptitek",
      institutionName: "Aptitek",
      isProfileComplete: true,
    },
  ];
}
