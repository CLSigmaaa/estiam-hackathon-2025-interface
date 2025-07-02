// lib/timetable/searchParams.ts
export function parseTimetableParams(searchParams: URLSearchParams) {
  return {
    day: searchParams.get("jour") ?? new Date().toISOString().split("T")[0],
    rooms: searchParams.getAll("salle"),
    slot: searchParams.get("plage_horaire"),
    showAll: searchParams.get("tout") === "true",
    theme: searchParams.get("theme") === "dark" ? "dark" : "light" as "dark" | "light",
  }
}