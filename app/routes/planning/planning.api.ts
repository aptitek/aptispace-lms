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

export async function regeneratePlanningFeedTokenApi(): Promise<
  { ok: true; feedToken: string } | { ok: false; error?: string }
> {
  try {
    const apiResponse = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "REGENERATE_TOKEN" }),
    });
    const resPayload = (await apiResponse.json()) as { feedToken?: string };
    if (apiResponse.ok && resPayload.feedToken) {
      return { ok: true, feedToken: resPayload.feedToken };
    }
    return { ok: false };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
