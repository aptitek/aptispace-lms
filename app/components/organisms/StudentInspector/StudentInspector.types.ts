import type { EntityCardData } from "../../molecules/EntityCard/EntityCard.types";
import type {
  SchoolConfig,
  CohortConfig,
} from "../OnboardingCard/OnboardingCard.types";
import type { AuthUser } from "../../../utils/auth";

export interface CohortWithInstitution extends CohortConfig {
  institutionId?: string;
  institutionName?: string;
}

export interface StudentInspectorProps {
  /**
   * The currently selected student data
   */
  student: EntityCardData | null;
  /**
   * Available institutions/schools
   */
  schools: SchoolConfig[];
  /**
   * Available cohorts
   */
  cohorts: CohortWithInstitution[];
  /**
   * Callback fired when the inspector panel is closed
   */
  onClose: () => void;
  /**
   * Callback to add student to a cohort
   */
  onAddCohort: (params: {
    studentId: string;
    cohortId: string;
  }) => Promise<void> | void;
  /**
   * Callback to remove student from a cohort
   */
  onRemoveCohort: (params: {
    studentId: string;
    cohortId: string;
  }) => Promise<void> | void;
  /**
   * Callback to impersonate the inspected student
   */
  onImpersonate?: (student: EntityCardData) => void;
  /**
   * Callback to delete the inspected student
   */
  onDelete?: (student: EntityCardData) => void;
  /**
   * Callback fired when student profile is updated via the extended ProfileCard
   */
  onStudentUpdated?: (updatedUser: AuthUser) => void;
  /**
   * Whether a cohort action is currently submitting
   */
  isSubmitting?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Test identifier
   */
  "data-testid"?: string;
}
