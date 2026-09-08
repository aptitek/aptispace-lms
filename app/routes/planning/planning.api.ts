export async function deletePlanningClassApi(
  id: string | number,
): Promise<"ok" | "failed" | "error"> {
  try {
    const apiResponse = await fetch("/api/classes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return apiResponse.ok ? "ok" : "failed";
  } catch {
    return "error";
  }
}

export async function updatePlanningClassTimeApi(
  id: string | number,
  startTime: string,
  endTime: string,
): Promise<"ok" | "failed" | "error"> {
  try {
    const apiResponse = await fetch("/api/classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, startTime, endTime }),
    });
    return apiResponse.ok ? "ok" : "failed";
  } catch {
    return "error";
  }
}
