export function getClassColor(className: string, theme: "light" | "dark") {
  if (className === "/")
    return theme === "dark"
      ? "bg-gray-800 text-gray-400"
      : "bg-gray-100 text-gray-400";
  if (className.startsWith("1ST"))
    return "bg-blue-100 text-blue-800 border-blue-200";
  if (className.startsWith("BTS1"))
    return "bg-green-100 text-green-800 border-green-200";
  if (className.startsWith("BTS2"))
    return "bg-purple-100 text-purple-800 border-purple-200";
  if (className.startsWith("TSTI"))
    return "bg-orange-100 text-orange-800 border-orange-200";
  return theme === "dark"
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-gray-100 text-gray-800 border-gray-200";
}

export function formatFrDate(dateStr: string) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const raw = date.toLocaleDateString("fr-FR", options);
  return raw.replace(/^([A-Za-zéûî]+) 1 /, "$1 1er ");
}

export function getLastUpdated() {
  return new Date()
    .toLocaleTimeString("fr-FR", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
    .replace(":", " heures ");
}