// Relative positions across program duration (0 = start, 1 = end)
// Matches spec example for 1-week: 0, 30min, 3h, 1d, 3d, 7d
const OFFSETS_6 = [0, 0.003, 0.018, 0.143, 0.429, 1.0];

export const DURATION_OPTIONS = [
  { label: "1 day",    ms: 1 * 24 * 60 * 60 * 1000 },
  { label: "3 days",   ms: 3 * 24 * 60 * 60 * 1000 },
  { label: "1 week",   ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "2 weeks",  ms: 14 * 24 * 60 * 60 * 1000 },
  { label: "1 month",  ms: 30 * 24 * 60 * 60 * 1000 },
] as const;

export function computeSessionSchedule(startMs: number, endMs: number, numSessions = 6): number[] {
  const duration = endMs - startMs;
  return OFFSETS_6.slice(0, numSessions).map((r) => Math.round(startMs + r * duration));
}

export function adjustNextSessionTime(
  currentScheduledAt: number,
  now: number,
  endDate: number,
  easyRatio: number
): number {
  const gap = currentScheduledAt - now;
  if (easyRatio < 0.33) {
    // Struggling — pull closer
    const earlier = now + gap * 0.7;
    return Math.round(Math.max(now + 30 * 60 * 1000, earlier));
  }
  if (easyRatio > 0.67) {
    // Doing well — push later
    const later = now + gap * 1.3;
    return Math.round(Math.min(endDate, later));
  }
  return currentScheduledAt;
}

export function formatSessionTime(ms: number): string {
  const now = Date.now();
  const diff = ms - now;
  if (Math.abs(diff) < 60_000) return "Now";
  const d = new Date(ms);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `Today ${timeStr}`;
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${timeStr}`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + timeStr;
}
