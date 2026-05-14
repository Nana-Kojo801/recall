import { useMemo, useState, useEffect, useRef, Fragment } from "react";
import { useQuery, useAction } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

function KStar({ size = 22, color = "#F4B400" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

function DotBg() {
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="kgcal" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kgcal)" />
      </svg>
    </div>
  );
}

const ACCENT_COLORS = ["#3B5BDB", "#E8482C", "#C93FA9", "#F4B400", "#2B7A3E"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_HOURS = Array.from({ length: 23 }, (_, i) => i + 1);

function fmtHr(h: number, m = 0): string {
  const period = h < 12 ? "AM" : "PM";
  const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m > 0 ? `${dh}:${String(m).padStart(2, "0")} ${period}` : `${dh} ${period}`;
}

function fmtPeriod(startMs: number, endMs: number): string {
  const s = new Date(startMs);
  const e = new Date(endMs);
  return `${fmtHr(s.getHours(), s.getMinutes())} – ${fmtHr(e.getHours(), e.getMinutes())}`;
}

// Get Monday of the week containing `date`
function getMondayOf(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtMonthDay(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

type Topic = {
  _id: string;
  name: string;
  courseId: string;
  nextReview?: number;
  lastStudied?: number;
};

type GCalEvent = {
  id: string;
  summary?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

type ProgramSession = {
  _id: string;
  topicId: string;
  sessionNumber: number;
  scheduledAt: number;
  cardCount: number;
  status: string;
};

// ── MOBILE Calendar ─────────────────────────────────────────────────────────

function MobileCalendar({ topics, calendarConnected, googleEvents, eventsLoading, calTokenExpired, programSessions }: { topics: Topic[] | undefined; calendarConnected: boolean; googleEvents: GCalEvent[]; eventsLoading: boolean; calTokenExpired: boolean; programSessions: ProgramSession[] | undefined }) {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);

  const selectedDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today, dayOffset]);

  const monday = useMemo(() => {
    const m = getMondayOf(today);
    m.setDate(m.getDate() + weekOffset * 7);
    return m;
  }, [today, weekOffset]);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    }), [monday]);

  const sunday = weekDays[6];
  const weekLabel = `${fmtMonthDay(monday)} — ${fmtMonthDay(sunday)}`;
  const dayLabel = selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase();

  const dueCount = topics?.filter((t) => t.nextReview && t.nextReview <= Date.now()).length ?? 0;
  const firstDue = topics?.find((t) => t.nextReview && t.nextReview <= Date.now());

  // Upcoming reviews for selected week
  const upcoming = useMemo(() => {
    const result: { date: Date; topicList: Topic[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = weekDays[i];
      const s = d.getTime();
      const e = s + 24 * 60 * 60 * 1000;
      const due = topics?.filter((t) => t.nextReview && t.nextReview >= s && t.nextReview < e) ?? [];
      if (due.length > 0) result.push({ date: d, topicList: due });
    }
    return result;
  }, [topics, weekDays]);

  // Today timeline 8am–8pm
  const currentHour = today.getHours();
  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const suggestedHour = HOURS.find((h) => h > currentHour && dueCount > 0) ?? -1;

  function fmtTime(h: number) {
    return h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
  }

  return (
    <div className="relative flex-1 overflow-y-auto pb-28">
      <DotBg />
      <div style={{ position: "relative", padding: "18px 22px 0" }}>
        {/* Header nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, background: "#1C1917", color: "#F5EFE2", padding: "4px 10px", borderRadius: 4 }}>
            CALENDAR
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 800, lineHeight: 1.0, margin: "18px 0 0", letterSpacing: -0.5, color: "#1C1917" }}>
          Review schedule
          <span style={{ display: "inline-block", marginLeft: 6 }}><KStar size={22} /></span>
        </h2>
      </div>

      {/* Connect card — only when not connected */}
      {!calendarConnected && (
        <div style={{ position: "relative", margin: "16px 16px 0" }}>
          <div style={{ padding: 14, borderRadius: 16, background: "#F4B400", border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1C1917", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700, color: "#1C1917" }}>Connect Google Calendar</div>
                <div style={{ fontSize: 11, color: "#4A4642", marginTop: 1 }}>Detect conflicts · auto-schedule reviews</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => navigate("/settings")} style={{ flex: 1, padding: "9px", borderRadius: 10, background: "#1C1917", color: "#fff", border: "2px solid #1C1917", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      )}
      {calTokenExpired && (
        <div style={{ position: "relative", margin: "16px 16px 0", padding: 12, borderRadius: 12, background: "#E8482C", border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, color: "#fff", fontSize: 12, fontWeight: 600 }}>Google Calendar token expired. Reconnect to see events.</div>
          <button onClick={() => navigate("/settings")} style={{ padding: "5px 10px", background: "#fff", color: "#E8482C", border: "1.5px solid #1C1917", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            Reconnect
          </button>
        </div>
      )}

      {viewMode === "week" && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{ position: "relative", padding: "18px 20px 0" }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#1C1917" }}>Upcoming reviews</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", letterSpacing: 1 }}>{weekOffset === 0 ? "THIS WEEK" : "SELECTED WEEK"}</div>
        </div>
        {upcoming.length === 0 ? (
          <div style={{ padding: "28px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#2B7A3E" }}>All caught up! ✦</p>
            <p style={{ fontSize: 13, color: "#8A8278", marginTop: 4 }}>No reviews due this week.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map(({ date, topicList }, i) => {
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div key={date.toISOString()} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917" }}>
                  <div style={{ width: 42, height: 44, borderRadius: 8, background: ACCENT_COLORS[i % ACCENT_COLORS.length], border: "1.5px solid #1C1917", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    <div style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>{date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{date.getDate()}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: isToday ? "#E8482C" : "#8A8278", fontWeight: 700 }}>{isToday ? "TODAY" : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1C1917", marginTop: 2 }}>{topicList.length} {topicList.length === 1 ? "topic" : "topics"} · ~{Math.ceil(topicList.length * 2)} min</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
      )}

      {/* Nav controls: toggle + arrows */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 0" }}>
        <div style={{ display: "flex", background: "#fff", border: "2px solid #1C1917", borderRadius: 6, overflow: "hidden" }}>
          {(["week", "day"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, cursor: "pointer", border: "none", background: viewMode === m ? "#1C1917" : "#fff", color: viewMode === m ? "#fff" : "#8A8278", letterSpacing: 0.5 }}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => viewMode === "week" ? setWeekOffset((o) => o - 1) : setDayOffset((o) => o - 1)}
            style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917", display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", letterSpacing: 0.5, textAlign: "center", minWidth: viewMode === "week" ? 120 : 90 }}>
            {viewMode === "week" ? weekLabel : dayLabel}
          </div>
          <button
            onClick={() => viewMode === "week" ? setWeekOffset((o) => o + 1) : setDayOffset((o) => o + 1)}
            style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917", display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>

      {viewMode === "week" ? (
      <motion.div
        key={`w${weekOffset}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.08 }}
        style={{ position: "relative", padding: "18px 20px 100px" }}
      >
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#1C1917" }}>
          {weekLabel}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {weekDays.map((day) => {
            const s = day.getTime();
            const e = s + 24 * 60 * 60 * 1000;
            const dayTopics = topics?.filter(t => t.nextReview && t.nextReview >= s && t.nextReview < e) ?? [];
            const daySessions = programSessions?.filter(ps => ps.scheduledAt >= s && ps.scheduledAt < e) ?? [];
            const dayGEvents = googleEvents.filter(ev => {
              const str = ev.start.dateTime ?? ev.start.date;
              if (!str) return false;
              return new Date(str).toDateString() === day.toDateString();
            });
            const isToday = day.toDateString() === today.toDateString();
            const hasContent = dayTopics.length > 0 || daySessions.length > 0 || dayGEvents.length > 0;
            return (
              <div key={day.toISOString()} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 10, background: hasContent ? "#fff" : "transparent", border: hasContent ? "2px solid #1C1917" : "2px dashed rgba(28,25,23,0.2)", boxShadow: hasContent ? "2px 2px 0 #1C1917" : "none" }}>
                <div style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 1 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: isToday ? "#E8482C" : "#8A8278" }}>
                    {day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, color: isToday ? "#E8482C" : "#1C1917", lineHeight: 1 }}>
                    {day.getDate()}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3, paddingTop: 1 }}>
                  {!hasContent && (
                    <div style={{ fontSize: 12, color: "#8A8278" }}>No reviews</div>
                  )}
                  {dayTopics.length > 0 && (
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1C1917" }}>
                      {dayTopics.length} topic{dayTopics.length !== 1 ? "s" : ""} · ~{Math.ceil(dayTopics.length * 2)} min
                    </div>
                  )}
                  {daySessions.map(ps => {
                    const isCompleted = ps.status === "completed";
                    return (
                      <div key={ps._id} style={{ fontSize: 11, fontWeight: 600, color: isCompleted ? "#8A8278" : "#2B7A3E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isCompleted ? "line-through" : "none", opacity: isCompleted ? 0.75 : 1 }}>
                        {isCompleted ? "✓ " : ""}Session {ps.sessionNumber} · {fmtPeriod(ps.scheduledAt, ps.scheduledAt + ps.cardCount * 60000)}
                      </div>
                    );
                  })}
                  {dayGEvents.map(ev => {
                    const startStr = ev.start.dateTime;
                    const endStr = ev.end?.dateTime;
                    const startMs = startStr ? new Date(startStr).getTime() : null;
                    const endMs = endStr ? new Date(endStr).getTime() : startMs ? startMs + 3600000 : null;
                    return (
                      <div key={ev.id} style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {startMs && endMs ? `${fmtPeriod(startMs, endMs)} · ` : ""}{ev.summary ?? "Event"}
                      </div>
                    );
                  })}
                  {eventsLoading && weekOffset === 0 && isToday && (
                    <div className="animate-pulse" style={{ width: 80, height: 12, borderRadius: 4, background: "rgba(59,91,219,0.15)", marginTop: 2 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      ) : (
      /* Day view */
      <motion.div
        key={`d${dayOffset}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.08 }}
        style={{ position: "relative", padding: "18px 20px 100px" }}
      >
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#1C1917" }}>
          {dayLabel}
        </div>
        {(() => {
          const s = selectedDay.getTime();
          const e = s + 24 * 60 * 60 * 1000;
          const dayTopics = topics?.filter(t => t.nextReview && t.nextReview >= s && t.nextReview < e) ?? [];
          const daySessions = programSessions?.filter(ps => ps.scheduledAt >= s && ps.scheduledAt < e) ?? [];
          const dayGEvents = googleEvents.filter(ev => {
            const str = ev.start.dateTime ?? ev.start.date;
            if (!str) return false;
            return new Date(str).toDateString() === selectedDay.toDateString();
          });
          const events: { hour: number; minute: number; type: "review" | "session" | "gcal"; label: string; sublabel?: string; color: string; startMs: number; endMs: number; completed?: boolean }[] = [
            ...dayTopics.map(t => ({ hour: new Date(t.nextReview!).getHours(), minute: new Date(t.nextReview!).getMinutes(), type: "review" as const, label: t.name, sublabel: "~2 min", color: "#E8482C", startMs: t.nextReview!, endMs: t.nextReview! + 0.75 * 3600000 })),
            ...daySessions.map(ps => ({ hour: new Date(ps.scheduledAt).getHours(), minute: new Date(ps.scheduledAt).getMinutes(), type: "session" as const, label: `Session ${ps.sessionNumber}`, sublabel: `${ps.cardCount} cards`, color: ps.status === "completed" ? "#8A8278" : "#2B7A3E", startMs: ps.scheduledAt, endMs: ps.scheduledAt + ps.cardCount * 60000, completed: ps.status === "completed" })),
            ...dayGEvents.map(ev => {
              const startStr = ev.start.dateTime ?? ev.start.date;
              const endStr = ev.end?.dateTime ?? ev.end?.date;
              const startMs = startStr ? new Date(startStr).getTime() : selectedDay.getTime();
              const endMs = endStr ? new Date(endStr).getTime() : startMs + 3600000;
              const d = new Date(startMs);
              return { hour: d.getHours(), minute: d.getMinutes(), type: "gcal" as const, label: ev.summary ?? "Event", color: "#3B5BDB", startMs, endMs };
            }),
          ].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

          if (events.length === 0) {
            return (
              <div style={{ padding: "28px 0", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#2B7A3E" }}>Free day! ✦</p>
                <p style={{ fontSize: 13, color: "#8A8278", marginTop: 4 }}>No reviews or sessions scheduled.</p>
              </div>
            );
          }
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {events.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: ev.completed ? "rgba(28,25,23,0.04)" : "#fff", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "2px 2px 0 #1C1917", opacity: ev.completed ? 0.7 : 1 }}>
                  <div style={{ width: 52, flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, color: ev.color, letterSpacing: 0.5 }}>
                      {ev.completed ? "DONE" : ev.type === "review" ? "REVIEW" : ev.type === "session" ? "SESSION" : "CALENDAR"}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", marginTop: 1 }}>
                      {fmtHr(ev.hour, ev.minute)}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, fontWeight: 700, color: ev.completed ? "#8A8278" : "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: ev.completed ? "line-through" : "none" }}>{ev.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: ev.color, marginTop: 1 }}>{fmtPeriod(ev.startMs, ev.endMs)}</div>
                  </div>
                  <div style={{ width: 8, height: 8, background: ev.color, borderRadius: "50%", flexShrink: 0, border: "1.5px solid #1C1917" }} />
                </div>
              ))}
            </div>
          );
        })()}
      </motion.div>
      )}
    </div>
  );
}

// ── DESKTOP Calendar ─────────────────────────────────────────────────────────

function DesktopCalendar({ topics, calendarConnected, googleEvents, eventsLoading, calTokenExpired, programSessions }: { topics: Topic[] | undefined; calendarConnected: boolean; googleEvents: GCalEvent[]; eventsLoading: boolean; calTokenExpired: boolean; programSessions: ProgramSession[] | undefined }) {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);

  const selectedDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today, dayOffset]);

  const dayLabel = selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase();

  const monday = useMemo(() => {
    const m = getMondayOf(today);
    m.setDate(m.getDate() + weekOffset * 7);
    return m;
  }, [today, weekOffset]);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    }), [monday]);

  const sunday = weekDays[6];
  const weekLabel = `${fmtMonthDay(monday)} — ${fmtMonthDay(sunday)}`;

  // Events: topics with nextReview in this week
  const reviewEvents = useMemo(() => {
    if (!topics) return [];
    return topics
      .filter((t) => {
        if (!t.nextReview) return false;
        const d = new Date(t.nextReview);
        return d >= monday && d <= new Date(sunday.getTime() + 24 * 60 * 60 * 1000);
      })
      .map((t) => {
        const d = new Date(t.nextReview!);
        const dayIndex = weekDays.findIndex((wd) => wd.toDateString() === d.toDateString());
        const startHr = d.getHours() + d.getMinutes() / 60;
        return { topic: t, dayIndex, startHr, dur: 0.75 };
      })
      .filter((e) => e.dayIndex >= 0);
  }, [topics, monday, sunday, weekDays]);

  const programSessionEvents = useMemo(() => {
    if (!programSessions) return [];
    return programSessions
      .filter(ps => {
        const d = new Date(ps.scheduledAt);
        return d >= monday && d <= new Date(sunday.getTime() + 24 * 60 * 60 * 1000);
      })
      .map(ps => {
        const d = new Date(ps.scheduledAt);
        const dayIndex = weekDays.findIndex(wd => wd.toDateString() === d.toDateString());
        const rawHr = d.getHours() + d.getMinutes() / 60;
        const startHr = rawHr < 1 ? 9 : rawHr;
        return { session: ps, dayIndex, startHr };
      })
      .filter(e => e.dayIndex >= 0);
  }, [programSessions, monday, sunday, weekDays]);

  // Upcoming reviews in next 7 days
  const upcoming = useMemo(() => {
    const result: { date: Date; topicList: Topic[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const s = d.getTime();
      const e = s + 24 * 60 * 60 * 1000;
      const due = topics?.filter((t) => t.nextReview && t.nextReview >= s && t.nextReview < e) ?? [];
      if (due.length > 0) result.push({ date: d, topicList: due });
    }
    return result.slice(0, 3);
  }, [topics, today]);

  const ROW_HEIGHT = 60;
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridScrollRef.current) return;
    const target = Math.max(0, today.getHours() - 1);
    gridScrollRef.current.scrollTop = Math.max(0, target - WEEK_HOURS[0]) * ROW_HEIGHT;
  }, []);

  return (
    <div>
      {/* Conflict / connect banner — only when not connected */}
      {!calendarConnected && (
        <div style={{ margin: "18px 28px 0", padding: 16, background: "#F4B400", border: "2.5px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "#1C1917", borderRadius: 8, display: "grid", placeItems: "center", color: "#F4B400", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>!</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 800, color: "#1C1917" }}>Connect Google Calendar</div>
            <div style={{ fontSize: 12, color: "#4A4642", marginTop: 2 }}>
              Detect scheduling conflicts and auto-book review slots. Enable in <strong>Settings → Calendar &amp; sync</strong>.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => navigate("/settings")}
              style={{ padding: "9px 14px", background: "#1C1917", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)" }}
            >
              Go to Settings →
            </button>
          </div>
        </div>
      )}
      {calTokenExpired && (
        <div style={{ margin: "18px 28px 0", padding: 14, background: "#E8482C", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, color: "#fff", fontSize: 13, fontWeight: 600 }}>Google Calendar token expired — events unavailable. Reconnect to restore sync.</div>
          <button onClick={() => navigate("/settings")} style={{ padding: "8px 14px", background: "#fff", color: "#E8482C", border: "1.5px solid #1C1917", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            Reconnect →
          </button>
        </div>
      )}

      {/* Upcoming reviews — 3-col grid */}
      <div style={{ padding: "18px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "#1C1917" }}>Upcoming reviews</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278", letterSpacing: 1 }}>NEXT 7 DAYS</div>
        </div>
        {upcoming.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#2B7A3E" }}>All caught up! ✦</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {upcoming.map(({ date, topicList }, i) => {
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div key={date.toISOString()} style={{ padding: 14, background: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 54, height: 60, background: ACCENT_COLORS[i % ACCENT_COLORS.length], border: "1.5px solid #1C1917", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700 }}>{date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>{date.getDate()}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 700, color: "#1C1917" }}>
                      {topicList.length} {topicList.length === 1 ? "topic" : "topics"} · ~{Math.ceil(topicList.length * 2)} min
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: isToday ? "#E8482C" : "#8A8278", marginTop: 4, fontWeight: isToday ? 700 : 400 }}>
                      {isToday ? "TODAY" : fmtMonthDay(date)}
                    </div>
                  </div>
                  <div style={{ color: "#8A8278", fontSize: 16 }}>→</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Week / Day grid */}
      <div style={{ padding: "18px 28px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "#1C1917" }}>
              {viewMode === "week" ? "Week view" : "Day view"}
            </div>
            {/* View toggle */}
            <div style={{ display: "flex", background: "#fff", border: "2px solid #1C1917", borderRadius: 6, overflow: "hidden" }}>
              {(["week", "day"] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{ padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: viewMode === m ? "#1C1917" : "#fff", color: viewMode === m ? "#fff" : "#8A8278", letterSpacing: 0.5 }}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => viewMode === "week" ? setWeekOffset((o) => o - 1) : setDayOffset((o) => o - 1)}
              style={{ width: 30, height: 30, borderRadius: 6, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917", cursor: "pointer", display: "grid", placeItems: "center" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278", letterSpacing: 1, minWidth: 130, textAlign: "center" }}>
              {viewMode === "week" ? weekLabel : dayLabel}
            </div>
            <button
              onClick={() => viewMode === "week" ? setWeekOffset((o) => o + 1) : setDayOffset((o) => o + 1)}
              style={{ width: 30, height: 30, borderRadius: 6, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917", cursor: "pointer", display: "grid", placeItems: "center" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>

        {viewMode === "week" ? (
        <div style={{ background: "#fff", border: "2.5px solid #1C1917", borderRadius: 14, boxShadow: "5px 5px 0 #1C1917", overflow: "hidden" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)", borderBottom: "2px solid #1C1917", background: "#FBF6EA" }}>
            <div />
            {weekDays.map((d, i) => {
              const isToday = d.toDateString() === today.toDateString();
              return (
                <div key={i} style={{ padding: "10px 12px", borderLeft: "1.5px solid #1C1917", textAlign: "center", background: isToday ? "#F4B400" : "transparent" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: isToday ? "#1C1917" : "#8A8278" }}>
                    {DAYS_SHORT[i].toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, color: "#1C1917" }}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid body with events — scrollable */}
          <div ref={gridScrollRef} style={{ maxHeight: "600px", overflowY: "auto" }}>
          {(() => {
            const nowHr = today.getHours() + today.getMinutes() / 60;
            const currentTimePx = (nowHr - WEEK_HOURS[0]) * ROW_HEIGHT;
            const showCurrentTime = nowHr >= WEEK_HOURS[0] && nowHr < WEEK_HOURS[WEEK_HOURS.length - 1] + 1;
            const todayColIndex = weekDays.findIndex(d => d.toDateString() === today.toDateString());
            return (
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)", gridAutoRows: ROW_HEIGHT }}>
              {WEEK_HOURS.map((h, ri) => (
                <Fragment key={h}>
                  <div style={{ paddingRight: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", borderTop: ri === 0 ? "none" : "1px solid rgba(28,25,23,0.1)", textAlign: "right", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", transform: ri > 0 ? "translateY(-7px)" : "none", userSelect: "none" }}>
                    {ri === 0 ? "" : fmtHr(h)}
                  </div>
                  {weekDays.map((_, di) => (
                    <div key={`c${h}${di}`} style={{ borderLeft: "1px solid rgba(28,25,23,0.08)", borderTop: ri === 0 ? "none" : "1px solid rgba(28,25,23,0.1)", position: "relative" }}>
                      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(28,25,23,0.04)" }} />
                    </div>
                  ))}
                </Fragment>
              ))}

              {/* Current time indicator */}
              {showCurrentTime && todayColIndex >= 0 && (
                <>
                  <div style={{ position: "absolute", top: currentTimePx, left: 0, right: 0, height: 2, background: "#E8482C", zIndex: 10, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: currentTimePx - 5, left: `calc(52px + ${todayColIndex} * ((100% - 52px) / 7) - 1px)`, width: 12, height: 12, background: "#E8482C", borderRadius: "50%", zIndex: 10, pointerEvents: "none" }} />
                </>
              )}

              {/* Review event overlays */}
              {reviewEvents.map((e, i) => {
                const clampedStart = Math.max(e.startHr, WEEK_HOURS[0]);
                const topPx = (clampedStart - WEEK_HOURS[0]) * ROW_HEIGHT + 1;
                const heightPx = Math.max(e.dur * ROW_HEIGHT - 2, 22);
                return (
                  <div
                    key={`r${i}`}
                    onClick={() => navigate(`/courses/${e.topic.courseId}/topics/${e.topic._id}/study`)}
                    style={{ position: "absolute", top: topPx, height: heightPx, left: `calc(52px + ${e.dayIndex} * ((100% - 52px) / 7) + 3px)`, width: "calc((100% - 52px) / 7 - 6px)", background: "rgba(232,72,44,0.1)", color: "#E8482C", border: "1.5px solid #E8482C", borderLeft: "4px solid #E8482C", borderRadius: 4, padding: "3px 6px", fontSize: 11, fontWeight: 700, lineHeight: 1.2, overflow: "hidden", cursor: "pointer", zIndex: 5 }}
                  >
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 11, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.topic.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(e.topic.nextReview!, e.topic.nextReview! + 0.75 * 3600000)}</div>
                  </div>
                );
              })}

              {/* Program session overlays */}
              {programSessionEvents.map((e, i) => {
                const isCompleted = e.session.status === "completed";
                const clampedStart = Math.max(e.startHr, WEEK_HOURS[0]);
                const topPx = (clampedStart - WEEK_HOURS[0]) * ROW_HEIGHT + 1;
                const durHr = Math.max(e.session.cardCount / 60, 0.25);
                const heightPx = Math.max(durHr * ROW_HEIGHT - 2, 22);
                const color = isCompleted ? "rgba(28,25,23,0.35)" : "#2B7A3E";
                return (
                  <div
                    key={`ps${i}`}
                    style={{ position: "absolute", top: topPx, height: heightPx, left: `calc(52px + ${e.dayIndex} * ((100% - 52px) / 7) + 3px)`, width: "calc((100% - 52px) / 7 - 6px)", background: isCompleted ? "rgba(28,25,23,0.05)" : "rgba(43,122,62,0.12)", color, border: `1.5px solid ${color}`, borderLeft: `4px solid ${color}`, borderRadius: 4, padding: "3px 6px", fontSize: 11, fontWeight: 700, lineHeight: 1.2, overflow: "hidden", zIndex: 5, opacity: isCompleted ? 0.75 : 1 }}
                  >
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 11, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isCompleted ? "line-through" : "none" }}>{isCompleted ? "✓ " : ""}Session {e.session.sessionNumber}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(e.session.scheduledAt, e.session.scheduledAt + e.session.cardCount * 60000)}</div>
                  </div>
                );
              })}

              {/* Google Calendar loading skeleton */}
              {eventsLoading && [0, 1, 2].map((i) => (
                <div key={`skel${i}`} className="animate-pulse" style={{ position: "absolute", top: (i * 2 + 1) * ROW_HEIGHT + 4, height: ROW_HEIGHT - 8, left: `calc(52px + ${(i + 1) % 7} * ((100% - 52px) / 7) + 3px)`, width: "calc((100% - 52px) / 7 - 6px)", background: "rgba(59,91,219,0.12)", border: "1.5px solid rgba(59,91,219,0.2)", borderRadius: 4, zIndex: 3 }} />
              ))}

              {/* Google Calendar event overlays */}
              {!eventsLoading && googleEvents.map((ev) => {
                const startStr = ev.start.dateTime ?? ev.start.date;
                const endStr = ev.end.dateTime ?? ev.end.date;
                if (!startStr) return null;
                const start = new Date(startStr);
                const end = endStr ? new Date(endStr) : new Date(start.getTime() + 60 * 60 * 1000);
                const dayIndex = weekDays.findIndex((wd) => wd.toDateString() === start.toDateString());
                if (dayIndex < 0) return null;
                const startHr = start.getHours() + start.getMinutes() / 60;
                const endHr = end.getHours() + end.getMinutes() / 60;
                if (startHr >= WEEK_HOURS[WEEK_HOURS.length - 1] + 1 || endHr <= WEEK_HOURS[0]) return null;
                const clampedStart = Math.max(startHr, WEEK_HOURS[0]);
                const clampedEnd = Math.min(endHr, WEEK_HOURS[WEEK_HOURS.length - 1] + 1);
                const topPx = (clampedStart - WEEK_HOURS[0]) * ROW_HEIGHT;
                const heightPx = Math.max((clampedEnd - clampedStart) * ROW_HEIGHT - 2, 22);
                return (
                  <div key={ev.id} style={{ position: "absolute", top: topPx + 1, height: heightPx, left: `calc(52px + ${dayIndex} * ((100% - 52px) / 7) + 3px)`, width: "calc((100% - 52px) / 7 - 6px)", background: "rgba(59,91,219,0.12)", color: "#3B5BDB", border: "1.5px solid #3B5BDB", borderLeft: "4px solid #3B5BDB", borderRadius: 4, padding: "3px 6px", fontSize: 11, fontWeight: 700, lineHeight: 1.2, overflow: "hidden", zIndex: 4 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 11, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.summary ?? "Event"}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(start.getTime(), end.getTime())}</div>
                  </div>
                );
              })}
            </div>
            );
          })()}
          </div>
        </div>
        ) : (
        /* Day view */
        <div style={{ background: "#fff", border: "2.5px solid #1C1917", borderRadius: 14, boxShadow: "5px 5px 0 #1C1917", overflow: "hidden" }}>
          {/* Day header */}
          <div style={{ padding: "10px 16px", borderBottom: "2px solid #1C1917", background: "#FBF6EA", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 54, height: 60, background: selectedDay.toDateString() === today.toDateString() ? "#F4B400" : "#1C1917", border: "1.5px solid #1C1917", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: selectedDay.toDateString() === today.toDateString() ? "#1C1917" : "#fff", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700 }}>{selectedDay.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1 }}>{selectedDay.getDate()}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, color: "#1C1917" }}>{selectedDay.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
              {selectedDay.toDateString() === today.toDateString() && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#E8482C", fontWeight: 700, marginTop: 2 }}>TODAY</div>}
            </div>
          </div>
          {/* Hourly grid — scrollable */}
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {(() => {
            const nowHr = today.getHours() + today.getMinutes() / 60;
            const currentTimePx = (nowHr - WEEK_HOURS[0]) * ROW_HEIGHT;
            const showCurrentTime = selectedDay.toDateString() === today.toDateString() && nowHr >= WEEK_HOURS[0] && nowHr < WEEK_HOURS[WEEK_HOURS.length - 1] + 1;
            const s = selectedDay.getTime();
            const e = s + 24 * 60 * 60 * 1000;
            const dayTopics = topics?.filter(t => t.nextReview && t.nextReview >= s && t.nextReview < e) ?? [];
            const daySessions = programSessions?.filter(ps => ps.scheduledAt >= s && ps.scheduledAt < e) ?? [];
            const dayGEvents = googleEvents.filter(ev => {
              const str = ev.start.dateTime ?? ev.start.date;
              if (!str) return false;
              return new Date(str).toDateString() === selectedDay.toDateString();
            });
            return (
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "52px 1fr", gridAutoRows: ROW_HEIGHT }}>
              {WEEK_HOURS.map((h, ri) => (
                <Fragment key={h}>
                  <div style={{ paddingRight: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", borderTop: ri === 0 ? "none" : "1px solid rgba(28,25,23,0.1)", textAlign: "right", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", transform: ri > 0 ? "translateY(-7px)" : "none", userSelect: "none" }}>
                    {ri === 0 ? "" : fmtHr(h)}
                  </div>
                  <div style={{ borderLeft: "1px solid rgba(28,25,23,0.1)", borderTop: ri === 0 ? "none" : "1px solid rgba(28,25,23,0.1)", position: "relative" }}>
                    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(28,25,23,0.04)" }} />
                  </div>
                </Fragment>
              ))}
              {/* Current time indicator */}
              {showCurrentTime && (
                <>
                  <div style={{ position: "absolute", top: currentTimePx, left: 0, right: 0, height: 2, background: "#E8482C", zIndex: 10, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: currentTimePx - 5, left: "47px", width: 12, height: 12, background: "#E8482C", borderRadius: "50%", zIndex: 10, pointerEvents: "none" }} />
                </>
              )}
              {dayTopics.map((t, i) => {
                const d = new Date(t.nextReview!);
                const startHr = Math.max(WEEK_HOURS[0], d.getHours() + d.getMinutes() / 60);
                const topPx = (startHr - WEEK_HOURS[0]) * ROW_HEIGHT + 1;
                return (
                  <div key={`r${i}`} onClick={() => navigate(`/courses/${t.courseId}/topics/${t._id}/study`)}
                    style={{ position: "absolute", top: topPx, height: Math.max(0.75 * ROW_HEIGHT - 2, 22), left: "calc(52px + 3px)", width: "calc(100% - 52px - 6px)", background: "rgba(232,72,44,0.1)", color: "#E8482C", border: "1.5px solid #E8482C", borderLeft: "4px solid #E8482C", borderRadius: 4, padding: "3px 8px", overflow: "hidden", zIndex: 5, cursor: "pointer" }}
                  >
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(t.nextReview!, t.nextReview! + 0.75 * 3600000)}</div>
                  </div>
                );
              })}
              {daySessions.map((ps, i) => {
                const isCompleted = ps.status === "completed";
                const d = new Date(ps.scheduledAt);
                const rawHr = d.getHours() + d.getMinutes() / 60;
                const startHr = Math.max(WEEK_HOURS[0], rawHr < 1 ? 9 : rawHr);
                const topPx = (startHr - WEEK_HOURS[0]) * ROW_HEIGHT + 1;
                const durHr = Math.max(ps.cardCount / 60, 0.25);
                const color = isCompleted ? "rgba(28,25,23,0.35)" : "#2B7A3E";
                return (
                  <div key={`ps${i}`} style={{ position: "absolute", top: topPx, height: Math.max(durHr * ROW_HEIGHT - 2, 22), left: "calc(52px + 3px)", width: "calc(100% - 52px - 6px)", background: isCompleted ? "rgba(28,25,23,0.05)" : "rgba(43,122,62,0.12)", color, border: `1.5px solid ${color}`, borderLeft: `4px solid ${color}`, borderRadius: 4, padding: "3px 8px", overflow: "hidden", zIndex: 5, opacity: isCompleted ? 0.75 : 1 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: isCompleted ? "line-through" : "none" }}>{isCompleted ? "✓ " : ""}Session {ps.sessionNumber}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(ps.scheduledAt, ps.scheduledAt + ps.cardCount * 60000)}</div>
                  </div>
                );
              })}
              {dayGEvents.map(ev => {
                const startStr = ev.start.dateTime ?? ev.start.date;
                const endStr = ev.end.dateTime ?? ev.end.date;
                if (!startStr) return null;
                const start = new Date(startStr);
                const end = endStr ? new Date(endStr) : new Date(start.getTime() + 3600000);
                const startHr = start.getHours() + start.getMinutes() / 60;
                const endHr = end.getHours() + end.getMinutes() / 60;
                if (startHr >= WEEK_HOURS[WEEK_HOURS.length - 1] + 1 || endHr <= WEEK_HOURS[0]) return null;
                const clampedStart = Math.max(startHr, WEEK_HOURS[0]);
                const clampedEnd = Math.min(endHr, WEEK_HOURS[WEEK_HOURS.length - 1] + 1);
                const topPx = (clampedStart - WEEK_HOURS[0]) * ROW_HEIGHT;
                const heightPx = Math.max((clampedEnd - clampedStart) * ROW_HEIGHT - 2, 22);
                return (
                  <div key={ev.id} style={{ position: "absolute", top: topPx + 1, height: heightPx, left: "calc(52px + 3px)", width: "calc(100% - 52px - 6px)", background: "rgba(59,91,219,0.12)", color: "#3B5BDB", border: "1.5px solid #3B5BDB", borderLeft: "4px solid #3B5BDB", borderRadius: 4, padding: "3px 8px", overflow: "hidden", zIndex: 4 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.summary ?? "Event"}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.8, marginTop: 1 }}>{fmtPeriod(start.getTime(), end.getTime())}</div>
                  </div>
                );
              })}
            </div>
            );
          })()}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function CalendarPage() {
  const topics = useQuery(api.topics.listByUser);
  const allProgramSessions = useQuery(api.programSessions.getAllByUser);
  const user = useQuery(api.users.getMe);
  const calendarConnected = !!(user?.googleAccessToken);
  const fetchEvents = useAction(api.googleCalendar.fetchUpcomingEvents);
  const [googleEvents, setGoogleEvents] = useState<GCalEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [calTokenExpired, setCalTokenExpired] = useState(false);

  useEffect(() => {
    if (!calendarConnected) return;
    setIsLoadingEvents(true);
    setCalTokenExpired(false);
    fetchEvents({}).then((data) => {
      const raw = data as { items?: GCalEvent[]; error?: string };
      if (raw?.error === "oauth_expired") {
        setCalTokenExpired(true);
        setGoogleEvents([]);
      } else {
        setGoogleEvents(raw?.items ?? []);
      }
      setIsLoadingEvents(false);
    }).catch((err) => {
      console.error("[Recall] Failed to fetch Google Calendar events:", err);
      setIsLoadingEvents(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarConnected]);

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <MobileCalendar topics={topics} calendarConnected={calendarConnected} googleEvents={googleEvents} eventsLoading={isLoadingEvents} calTokenExpired={calTokenExpired} programSessions={allProgramSessions} />
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", overflowY: "auto" }}>
          {/* Header */}
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase" }}>
                REVIEW SCHEDULE
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                Calendar
                <KStar size={24} />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <DesktopCalendar topics={topics} calendarConnected={calendarConnected} googleEvents={googleEvents} eventsLoading={isLoadingEvents} calTokenExpired={calTokenExpired} programSessions={allProgramSessions} />
          </motion.div>
        </main>
      </div>
    </>
  );
}
