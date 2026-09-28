const IST = "Asia/Kolkata";

/** Parse `datetime-local` value (YYYY-MM-DDTHH:mm) as India Standard Time → UTC ISO. */
export function istDatetimeLocalToUtcIso(local: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local.trim());
  if (!match) {
    throw new Error("Invalid date/time");
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const utcMs = Date.UTC(year, month - 1, day, hour - 5, minute - 30);
  return new Date(utcMs).toISOString();
}

export function formatDateTimeIST(iso: string) {
  const formatted = new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatted} IST`;
}
