import type { UserCardData } from "../../molecules/UserCard/UserCard.types";
import type { SchoolConfig, CohortConfig } from "../../../types/institution";
import type { AuthUser } from "../../../utils/auth";

export interface CohortWithInstitution extends CohortConfig {
  institutionId?: string;
  institutionName?: string;
}

export interface UserInspectorProps {
  student?: UserCardData | null;
  user?: UserCardData | null;
  schools?: SchoolConfig[];
  cohorts?: CohortWithInstitution[];
  onClose: () => void;
  onAddCohort?: (payload: {
    studentId: string;
    cohortId: string;
  }) => void | Promise<void>;
  onRemoveCohort?: (payload: {
    studentId: string;
    cohortId: string;
  }) => void | Promise<void>;
  onImpersonate?: (student: UserCardData) => void;
  onDelete?: (student: UserCardData) => void;
  onStudentUpdated?: (updatedUser: AuthUser) => void;
  onUpdateGithub?: (studentId: string, githubId: string) => void;
  isSubmitting?: boolean;
  className?: string;
  "data-testid"?: string;
}

export type StudentInspectorProps = UserInspectorProps;
