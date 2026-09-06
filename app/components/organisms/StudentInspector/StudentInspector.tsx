import UserInspector from "../UserInspector/UserInspector";
import type { UserInspectorProps } from "../UserInspector/UserInspector.types";

export default function StudentInspector(props: UserInspectorProps) {
  return <UserInspector {...props} />;
}

export { SchoolBadgeInline } from "../UserInspector/UserInspector";
export type { StudentInspectorProps } from "../UserInspector/UserInspector.types";
