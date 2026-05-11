import { useQuery } from "convex/react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { api } from "@/../convex/_generated/api";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

function KStar({ size = 14, color = "#F4B400" }: { size?: number; color?: string }) {
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
          <pattern id="kgst" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kgst)" />
      </svg>
    </div>
  );
}

function Heatmap({ sessions }: { sessions: Array<{ startedAt: number; completedAt?: number }> | undefined }) {
  const WEEKS = 18;
  const DAYS = 7;
  const cells = useMemo(() => {
    const now = Date.now();
    const start = now - WEEKS * 7 * 24 * 60 * 60 * 1000;
    const counts = new Map<string, number>();
    sessions?.forEach((s) => {
      if (s.startedAt < start) return;
      const d = new Date(s.startedAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const result: number[] = [];
    for (let w = 0; w < WEEKS; w++) {
      for (let d = 0; d < DAYS; d++) {
        const date = new Date(now - (WEEKS - w - 1) * 7 * 24 * 60 * 60 * 1000 + (d - DAYS + 1) * 24 * 60 * 60 * 1000);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        result.push(counts.get(key) ?? 0);
      }
    }
    return result;
  }, [sessions]);

  const maxVal = Math.max(...cells, 1);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${WEEKS}, 1fr)`, gap: 2, marginTop: 10 }}>
      {cells.map((v, i) => {
        const ratio = v / maxVal;
        const opacity = v === 0 ? 0.08 : ratio < 0.4 ? 0.35 : ratio < 0.75 ? 0.65 : 1;
        return (
          <div key={i} style={{ aspectRatio: "1", background: "#2B7A3E", opacity, borderRadius: 2, border: "0.5px solid #1C1917" }} />
        );
      })}
    </div>
  );
}

export function StatsPage() {
  const topics = useQuery(api.topics.listByUser);
  const courses = useQuery(api.courses.list);
  const sessions = useQuery(api.studySessions.listByUser);
  const cards = useQuery(api.flashcards.listByUser);

  const now = Date.now();
  const month = new Date().toLocaleString("en-US", { month: "short" }).toUpperCase();

  const totalCards = cards?.length ?? 0;
  const ratedCards = cards?.filter((c) => c.lastRating) ?? [];
  const retention = ratedCards.length > 0
    ? Math.round(ratedCards.filter((c) => c.lastRating !== "hard").length / ratedCards.length * 100)
    : 0;

  const completedSessions = sessions?.filter((s) => s.completedAt) ?? [];
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const weekSessions = completedSessions.filter((s) => s.startedAt >= weekStart);
  const weekMs = weekSessions.reduce((sum, s) => sum + ((s.completedAt ?? s.startedAt) - s.startedAt), 0);
  const weekTimeMin = Math.round(weekMs / 60000);
  const weekTimeDisplay = weekTimeMin >= 60 ? `${(weekTimeMin / 60).toFixed(1)}h` : `${weekTimeMin}m`;

  const dueCount = topics?.filter((t) => t.nextReview && t.nextReview <= now).length ?? 0;
  const onTimePct = topics && topics.length > 0
    ? Math.round((topics.length - dueCount) / topics.length * 100)
    : 100;

  const streak = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const daySet = new Set<string>();
    sessions.filter(s => s.completedAt).forEach(s => {
      const d = new Date(s.completedAt!);
      daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(Date.now() - i * 86400000);
      if (daySet.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)) count++;
      else break;
    }
    return count;
  }, [sessions]);

  const byCourse = useMemo(() => {
    if (!courses || !topics) return [];
    return courses.map((course) => {
      const ct = topics.filter((t) => t.courseId === course._id);
      const studied = ct.filter((t) => t.lastStudied).length;
      const mastery = ct.length > 0 ? studied / ct.length : 0;
      return { ...course, mastery, topicCount: ct.length };
    });
  }, [courses, topics]);

  const sparkBars = [0.6, 0.85, 0.7, 0.95, 0.55, 0.9, 0.4, 0.78, 0.88, 0.65, 0.82, 0.95, 1.0, 0.7];

  const statsGrid = [
    { v: String(streak), l: "STREAK", s: "days", c: "#F4B400", tc: "#1C1917" },
    { v: String(totalCards), l: "CARDS", s: "studied", c: "#fff", tc: "#1C1917" },
    { v: weekTimeDisplay, l: "TIME", s: "this week", c: "#3B5BDB", tc: "#fff" },
    { v: `${onTimePct}%`, l: "ON-TIME", s: "reviews", c: "#2B7A3E", tc: "#fff" },
  ];

  const isLoading = topics === undefined || courses === undefined || sessions === undefined;

  const mobileContent = (
    <div style={{ position: "relative", minHeight: "100%", overflow: "auto", fontFamily: "var(--font-sans)", color: "#1C1917" }}>
      <DotBg />
      <div style={{ position: "relative", padding: "20px 22px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, background: "#1C1917", color: "#F5EFE2", padding: "4px 10px", borderRadius: 4, display: "inline-block" }}>
          STATS · {month}
        </div>

        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 800, lineHeight: 1.0, margin: "18px 0 0", letterSpacing: -0.5 }}>
          Your progress
          <span style={{ display: "inline-block", marginLeft: 6, transform: "translateY(-3px)" }}>
            <KStar size={18} />
          </span>
        </h2>
      </div>

      {/* Hero retention card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{ margin: "16px 16px 0", padding: 18, borderRadius: 18, background: "#E8482C", color: "#fff", border: "2.5px solid #1C1917", boxShadow: "5px 5px 0 #1C1917", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <KStar size={22} color="#F4B400" />
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5 }}>RETENTION · 30 DAYS</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 64, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9 }}>
            {ratedCards.length > 0 ? `${retention}%` : "—"}
          </div>
          {ratedCards.length > 0 && <div style={{ fontSize: 13, opacity: 0.9 }}>{ratedCards.length} rated</div>}
        </div>
        <div style={{ height: 50, display: "flex", alignItems: "flex-end", gap: 3, marginTop: 14 }}>
          {sparkBars.map((b, i) => (
            <div key={i} style={{ flex: 1, height: `${b * 100}%`, background: i === sparkBars.length - 2 ? "#fff" : "rgba(255,255,255,0.55)", border: "1.5px solid #1C1917", borderRadius: 2 }} />
          ))}
        </div>
      </motion.div>

      {/* Stats 2×2 grid */}
      <div style={{ padding: "12px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {statsGrid.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            style={{ padding: 12, borderRadius: 12, background: s.c, color: s.tc, border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917" }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 1, opacity: 0.8 }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5, marginTop: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>{s.s}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ padding: 14, borderRadius: 14, background: "#fff", border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 800 }}>Activity</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>LAST 18 WEEKS</div>
          </div>
          <Heatmap sessions={sessions} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 9, color: "#8A8278" }}>
            <span>Less</span>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* By course */}
      <div style={{ padding: "16px 16px 120px" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 10 }}>By course</div>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 56, borderRadius: 12, background: "rgba(28,25,23,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : byCourse.length === 0 ? (
          <p style={{ fontFamily: "var(--font-accent)", fontSize: 16, color: "#8A8278" }}>No courses yet.</p>
        ) : byCourse.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "2px 2px 0 #1C1917", marginBottom: 8 }}
          >
            <div style={{ width: 10, height: 36, background: c.color, border: "1.5px solid #1C1917", borderRadius: 3, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ height: 5, borderRadius: 2.5, background: "#FBF6EA", border: "1px solid #1C1917", marginTop: 6, overflow: "hidden" }}>
                <div style={{ width: `${c.mastery * 100}%`, height: "100%", background: c.mastery > 0.7 ? "#2B7A3E" : c.mastery > 0.5 ? "#F4B400" : "#E8482C" }} />
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, width: 36, textAlign: "right" }}>
              {Math.round(c.mastery * 100)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2", position: "relative", overflow: "hidden" }}>
        <main className="flex-1 overflow-y-auto pb-24" style={{ position: "relative" }}>
          {mobileContent}
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", overflowY: "auto" }}>
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase" }}>LAST 30 DAYS · {month} 2026</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1, marginTop: 4 }}>
                Your progress <KStar size={22} />
              </div>
            </div>
          </div>

          <div>
            {/* Hero strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{ padding: "20px 28px 0", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 14 }}
            >
              {/* Retention hero */}
              <div style={{ padding: 18, background: "#E8482C", color: "#fff", border: "2.5px solid #1C1917", borderRadius: 14, boxShadow: "5px 5px 0 #1C1917", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 14, right: 14 }}>
                  <KStar size={22} color="#F4B400" />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5 }}>RETENTION</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 72, fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.9 }}>
                    {ratedCards.length > 0 ? `${retention}%` : "—"}
                  </div>
                </div>
                <div style={{ height: 50, display: "flex", alignItems: "flex-end", gap: 2, marginTop: 12 }}>
                  {sparkBars.map((b, i) => (
                    <div key={i} style={{ flex: 1, height: `${b * 100}%`, background: i === sparkBars.length - 2 ? "#fff" : "rgba(255,255,255,0.55)", border: "1px solid #1C1917", borderRadius: 2 }} />
                  ))}
                </div>
              </div>

              {[
                { v: String(streak), l: "STREAK", s: "days", c: "#F4B400", tc: "#1C1917" },
                { v: weekTimeDisplay, l: "TIME", s: "this week", c: "#3B5BDB", tc: "#fff" },
                { v: `${onTimePct}%`, l: "ON-TIME", s: "reviews", c: "#2B7A3E", tc: "#fff" },
              ].map((s, i) => (
                <div key={i} style={{ padding: 16, background: s.c, color: s.tc, border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, opacity: 0.85 }}>{s.l}</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 0.95, marginTop: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>{s.s}</div>
                </div>
              ))}
            </motion.div>

            {/* Heatmap + Best hour */}
            <div style={{ padding: "18px 28px 0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <div style={{ padding: 18, background: "#fff", border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800 }}>Activity</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>LAST 18 WEEKS</div>
                </div>
                <Heatmap sessions={sessions} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>
                  <span>Less</span>
                  <span>More</span>
                </div>
              </div>
              <div style={{ padding: 18, background: "#F4B400", border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5 }}>TOTAL CARDS</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 900, letterSpacing: -1.5, lineHeight: 0.95, marginTop: 4 }}>
                  {totalCards}
                </div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: 17, marginTop: 4 }}>
                  {completedSessions.length} sessions completed
                </div>
              </div>
            </div>

            {/* By course */}
            <div style={{ padding: "18px 28px 28px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 }}>By course</div>
              {byCourse.length === 0 ? (
                <p style={{ fontFamily: "var(--font-accent)", fontSize: 18, color: "#8A8278" }}>No courses yet.</p>
              ) : (
                <div style={{ background: "#fff", border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917", overflow: "hidden" }}>
                  {byCourse.map((c, i) => (
                    <div key={c._id} style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 16, borderTop: i === 0 ? "none" : "1.5px solid rgba(28,25,23,0.1)" }}>
                      <div style={{ width: 8, height: 36, background: c.color, border: "1.5px solid #1C1917", borderRadius: 3 }} />
                      <div style={{ width: 220, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>{c.code}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: "#FBF6EA", border: "1.5px solid #1C1917", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${c.mastery * 100}%`, height: "100%", background: c.mastery > 0.7 ? "#2B7A3E" : c.mastery > 0.5 ? "#F4B400" : "#E8482C" }} />
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, width: 36, textAlign: "right" }}>{Math.round(c.mastery * 100)}%</div>
                      </div>
                      <div style={{ width: 80, textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 800 }}>{c.topicCount}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#8A8278" }}>TOPICS</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
