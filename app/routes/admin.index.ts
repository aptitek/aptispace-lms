import { redirect } from "react-router";

export function loader() {
  return redirect("/admin/users");
}

export default function AdminIndex() {
  return null;
}
