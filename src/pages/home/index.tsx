import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/../convex/_generated/api";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { formatSessionTime } from "@/lib/spaced-repetition/program";

function KStar({ size = 16, color = "#E8482C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

function FlameIcon({ size = 20, color = "#E8482C" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 8 7 8 11C8 13.209 9.791 15 12 15C14.209 15 16 13.209 16 11C16 9 14.5 6.5 14.5 6.5C14.5 6.5 14 9 12.5 10C12.5 10 13 7.5 12 2Z"/>
      <path d="M7 14C7 14 5 15.5 5 18C5 20.761 7.239 23 10 23H14C16.761 23 19 20.761 19 18C19 15.5 17 14 17 14C17 14 16.5 16 15 17C15 17 15.5 14 14 12C14 12 13 15 11 16C11 16 11 13.5 9 12C9 12 8.5 14 7 14Z"/>
    </svg>
  );
}

function DotPattern({ cols = 6, rows = 4, color = "#1C1917" }: { cols?: number; rows?: number; color?: string }) {
  const gap = 8;
  return (
    <svg width={cols * gap} height={rows * gap}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * gap + 2} cy={r * gap + 2} r={1.5} fill={color} />
        ))
      )}
    </svg>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDateLabel() {
  const parts = new Date()
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase()
    .split(" ");
  return `${parts[0]} · ${parts[1]} ${parts[2]}`;
}

function MobileCourseRow({
  course,
  index,
}: {
  course: { _id: string; name: string; code: string; color: string };
  index: number;
}) {
  const navigate = useNavigate();
  const topics = useQuery(api.topics.listByCourse, { courseId: course._id as never });
  const topicCount = topics?.length ?? 0;
  const dueCount =
    topics?.filter((t) => t.nextReview && t.nextReview <= Date.now()).length ?? 0;
  const initial = course.name[0]?.toUpperCase() ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: "easeOut" }}
      onClick={() => navigate(`/courses/${course._id}`)}
      style={{
        padding: 14, borderRadius: 16, background: "#fff",
        border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917",
        display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
      }}
    >
      <div style={{
        width: 54, height: 54, borderRadius: 12,
        background: course.color, border: "2px solid #1C1917",
        display: "grid", placeItems: "center",
        color: "#fff", fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 18,
        flexShrink: 0,
      }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700,
          lineHeight: 1.1, color: "#1C1917",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {course.name}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>{course.code}</span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: "#8A8278", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#4A4642" }}>{topicCount} topics</span>
        </div>
      </div>
      <div style={{
        padding: "4px 8px", borderRadius: 8, flexShrink: 0,
        background: dueCount > 0 ? "#1C1917" : "#fff",
        color: dueCount > 0 ? "#F5EFE2" : "#8A8278",
        border: "1.5px solid #1C1917",
        fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
      }}>
        {dueCount} due
      </div>
    </motion.div>
  );
}

function DesktopCourseCard({
  course,
}: {
  course: { _id: string; name: string; code: string; color: string };
}) {
  const navigate = useNavigate();
  const topics = useQuery(api.topics.listByCourse, { courseId: course._id as never });

  const topicCount = topics?.length ?? 0;
  const dueCount =
    topics?.filter((t) => t.nextReview && t.nextReview <= Date.now()).length ?? 0;

  const mastery =
    topics && topics.length > 0
      ? Math.round(
          topics.reduce((sum, t) => {
            if (!t.lastStudied) return sum;
            return sum + 60;
          }, 0) / topics.length
        )
      : 0;

  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      style={{
        background: "#fff",
        border: "2px solid #1C1917",
        borderRadius: 14,
        boxShadow: "4px 4px 0 #1C1917",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: 54,
          background: course.color,
          borderBottom: "2px solid #1C1917",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {course.code}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#1C1917",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {course.name}
        </div>
        <div
          style={{
            marginTop: 8,
            height: 4,
            background: "#FBF6EA",
            border: "1px solid #1C1917",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${mastery}%`,
              background: "#2B7A3E",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#8A8278", fontWeight: 600 }}>
            {topicCount} {topicCount === 1 ? "topic" : "topics"}
          </span>
          {dueCount > 0 && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                background: "#E8482C",
                color: "#fff",
                border: "1px solid #1C1917",
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              {dueCount} DUE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getMe);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : firstName[0]?.toUpperCase() ?? "?";

  const topics = useQuery(api.topics.listByUser);
  const courses = useQuery(api.courses.list);
  const dueProgramSessions = useQuery(api.programSessions.getDueByUser);
  const upcomingProgramSessions = useQuery(api.programSessions.getUpcomingByUser);
  const sessions = useQuery(api.studySessions.listByUser);

  const [stableCoursesEmpty, setStableCoursesEmpty] = useState(false);
  useEffect(() => {
    if (courses !== undefined && courses.length === 0) {
      const t = setTimeout(() => setStableCoursesEmpty(true), 400);
      return () => clearTimeout(t);
    }
    setStableCoursesEmpty(false);
  }, [courses]);

  const now = Date.now();
  const dueTopics = topics?.filter((t) => t.nextReview && t.nextReview <= now) ?? [];
  const firstDuePS = dueProgramSessions?.[0];
  const firstDuePSTopic = firstDuePS ? topics?.find(t => t._id === firstDuePS.topicId) : null;
  const dueCount = dueTopics.length + (dueProgramSessions?.length ?? 0);
  const firstDue = dueTopics[0];

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

  const upcomingWithTopic = useMemo(() => {
    if (!upcomingProgramSessions || !topics) return [];
    return upcomingProgramSessions.map(s => ({
      ...s,
      topic: topics.find(t => t._id === s.topicId),
    })).filter(s => s.topic);
  }, [upcomingProgramSessions, topics]);

  const hasInProgressSession = (() => {
    try {
      if (firstDuePS) {
        return parseInt(sessionStorage.getItem(`study-${firstDuePS.topicId}-${firstDuePS.programId}`) ?? "0", 10) > 0;
      }
      if (firstDue) {
        return parseInt(sessionStorage.getItem(`study-${firstDue._id}-free`) ?? "0", 10) > 0;
      }
      return false;
    } catch { return false; }
  })();

  function navigateToFirstDue() {
    if (firstDuePS && firstDuePSTopic) {
      navigate(`/courses/${firstDuePSTopic.courseId}/topics/${firstDuePS.topicId}/study?programId=${firstDuePS.programId}&sessionId=${firstDuePS._id}`);
    } else if (firstDue) {
      navigate(`/courses/${firstDue.courseId}/topics/${firstDue._id}/study`);
    }
  }

  const studiedTopics = topics?.filter((t) => t.lastStudied) ?? [];
  const retentionPct =
    topics && topics.length > 0
      ? Math.round((studiedTopics.length / topics.length) * 100)
      : 0;

  const coursesLoading =
    courses === undefined || (courses !== undefined && courses.length === 0 && !stableCoursesEmpty);
  const coursesEmpty = courses !== undefined && courses.length === 0 && stableCoursesEmpty;

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2", fontFamily: "var(--font-sans)" }}>
        {/* dot grid bg */}
        <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hmdot" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hmdot)" />
          </svg>
        </div>

        {/* Scrollable content */}
        <div className="relative flex-1 overflow-y-auto pb-28">
          {/* Header */}
          <div style={{ padding: "20px 22px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278", letterSpacing: 1 }}>
                  {getDateLabel()}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 700, lineHeight: 1.0, marginTop: 2, letterSpacing: -0.5, color: "#1C1917" }}>
                  Hi, {firstName}
                  <span style={{ display: "inline-block", marginLeft: 6, transform: "translateY(-4px)" }}>
                    <KStar size={22} color="#F4B400" />
                  </span>
                </div>
              </div>
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name ?? ""}
                  style={{ width: 46, height: 46, borderRadius: 14, border: "2.5px solid #1C1917", boxShadow: "3px 3px 0 #1C1917", objectFit: "cover" }}
                />
              ) : (
                <div style={{
                  width: 46, height: 46, borderRadius: 14, background: "#C93FA9",
                  border: "2.5px solid #1C1917", boxShadow: "3px 3px 0 #1C1917",
                  display: "grid", placeItems: "center",
                  color: "#fff", fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 16,
                }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Due Today card */}
            <div style={{
              marginTop: 18, padding: 18, borderRadius: 20,
              background: "#F4B400", border: "2.5px solid #1C1917",
              boxShadow: "5px 5px 0 #1C1917", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 10, right: 14, opacity: 0.3 }}>
                <DotPattern cols={6} rows={4} color="#1C1917" />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, color: "#1C1917" }}>DUE TODAY</div>
              {dueCount === 0 ? (
                <div style={{ fontFamily: "var(--font-accent)", fontSize: 24, color: "#1C1917", marginTop: 8 }}>
                  All caught up! ✦
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 52, fontWeight: 900, color: "#1C1917", lineHeight: 1, letterSpacing: -2 }}>
                      {dueCount}
                    </div>
                    <div style={{ fontSize: 13, color: "#1C1917" }}>topics · ~{Math.ceil(dueCount * 2)} min</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={navigateToFirstDue}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 10,
                        background: "#1C1917", color: "#fff", border: "2.5px solid #1C1917",
                        fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
                      }}
                    >
                      ▶ {hasInProgressSession ? "Continue session" : "Start studying"}
                    </button>
                    <button
                      onClick={() => navigate("/calendar")}
                      style={{
                        padding: "10px 12px", borderRadius: 10,
                        background: "#fff", color: "#1C1917", border: "2.5px solid #1C1917",
                        fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 12, cursor: "pointer",
                      }}
                    >
                      9:30
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Streak + Retention row */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <div style={{
                flex: 1, padding: "10px 14px", borderRadius: 14,
                background: "#fff", border: "2px solid #1C1917",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <FlameIcon size={20} color="#E8482C" />
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, lineHeight: 1, color: "#1C1917" }}>{streak}</div>
                  <div style={{ fontSize: 10, color: "#8A8278", fontFamily: "var(--font-mono)" }}>STREAK</div>
                </div>
              </div>
              <div style={{
                flex: 1, padding: "10px 14px", borderRadius: 14,
                background: "#fff", border: "2px solid #1C1917",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <KStar size={20} color="#F4B400" />
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, lineHeight: 1, color: "#1C1917" }}>{retentionPct}%</div>
                  <div style={{ fontSize: 10, color: "#8A8278", fontFamily: "var(--font-mono)" }}>RETAINED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming sessions */}
          {upcomingWithTopic.length > 0 && (
            <div style={{ padding: "16px 22px 0" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, color: "#8A8278", marginBottom: 8 }}>UPCOMING SESSIONS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcomingWithTopic.map(s => (
                  <div key={s._id} style={{ padding: "10px 14px", background: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "2px 2px 0 #1C1917", display: "flex", alignItems: "center", gap: 10 }}
                    onClick={() => s.topic && navigate(`/courses/${s.topic.courseId}/topics/${s.topicId}`)}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#3B5BDB", border: "1.5px solid #1C1917", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.sessionNumber}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.topic?.name}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", marginTop: 1 }}>{formatSessionTime(s.scheduledAt)}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses section */}
          <div style={{ padding: "22px 22px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "#1C1917" }}>Courses</div>
            {courses && courses.length > 0 && (
              <div style={{
                padding: "3px 8px", borderRadius: 6,
                background: "#1C1917", color: "#F5EFE2",
                fontSize: 11, fontFamily: "var(--font-mono)",
              }}>
                {courses.length}
              </div>
            )}
          </div>

          <div style={{ padding: "0 22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {coursesLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    height: 82, borderRadius: 16, background: "rgba(28,25,23,0.06)",
                    border: "2px solid rgba(28,25,23,0.1)", animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                ))}
              </>
            ) : coursesEmpty ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 24, paddingBottom: 8, textAlign: "center" }}
              >
                <div style={{
                  width: 120, height: 120, borderRadius: 24, background: "#F4B400",
                  border: "3px solid #1C1917", boxShadow: "8px 8px 0 #1C1917",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: "rotate(-4deg)", position: "relative",
                }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                  <span style={{
                    position: "absolute", top: -12, right: -16, fontSize: 10, fontWeight: 700,
                    padding: "3px 7px", borderRadius: 5, background: "#fff",
                    border: "2px solid #1C1917", fontFamily: "var(--font-mono)", boxShadow: "2px 2px 0 #1C1917",
                    transform: "rotate(-6deg)",
                  }}>EMPTY</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5 }}>No courses yet.</div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: 18, color: "#E8482C", marginTop: 4 }}>Let's fix that!</div>
                </div>
                <button onClick={() => navigate("/courses")} style={{ padding: "11px 22px", background: "#1C1917", color: "#fff", border: "2.5px solid #1C1917", borderRadius: 12, boxShadow: "4px 4px 0 rgba(28,25,23,0.25)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Go to Courses →
                </button>
              </motion.div>
            ) : (
              <>
                {courses!.map((course, i) => (
                  <MobileCourseRow key={course._id} course={course} index={i} />
                ))}
              </>
            )}

          </div>

          <div style={{ height: 16 }} />
        </div>

        <BottomNav />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: "auto",
            background: "#F5EFE2",
          }}
        >
          {/* Header */}
          <div
            style={{
              borderBottom: "2px solid #1C1917",
              padding: "18px 28px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#8A8278",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {getDateLabel()}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#1C1917",
                  letterSpacing: -0.5,
                  lineHeight: 1,
                }}
              >
                {getGreeting()}, {firstName}.
              </div>
            </div>
          </div>

          {/* Content grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              padding: 28,
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 20,
            }}
          >
            {/* Due Today big card */}
            <div
              style={{
                background: "#F4B400",
                border: "2.5px solid #1C1917",
                borderRadius: 18,
                boxShadow: "6px 6px 0 #1C1917",
                padding: 24,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 16, right: 20, pointerEvents: "none" }}>
                <KStar size={20} color="#1C1917" />
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#1C1917",
                }}
              >
                DUE TODAY
              </div>

              {dueCount === 0 ? (
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 32,
                    color: "#1C1917",
                    marginTop: 16,
                  }}
                >
                  All caught up! ✦
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 4 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 92,
                        fontWeight: 900,
                        letterSpacing: -3,
                        lineHeight: 0.9,
                        color: "#1C1917",
                      }}
                    >
                      {dueCount}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#1C1917",
                        }}
                      >
                        topics · ~{Math.ceil(dueCount * 2)} min
                      </div>
                      <div style={{ fontSize: 13, color: "#4A4642" }}>due for review</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button
                      onClick={navigateToFirstDue}
                      style={{
                        background: "#1C1917",
                        color: "#fff",
                        border: "2px solid #1C1917",
                        boxShadow: "2px 2px 0 rgba(0,0,0,0.25)",
                        borderRadius: 10,
                        padding: "11px 16px",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ▶ {hasInProgressSession ? "Continue session" : "Start session"}
                    </button>
                    <button
                      style={{
                        background: "#fff",
                        color: "#1C1917",
                        border: "2px solid #1C1917",
                        boxShadow: "2px 2px 0 #1C1917",
                        borderRadius: 10,
                        padding: "11px 16px",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ⏰ Schedule
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Streak card */}
              <div
                style={{
                  background: "#fff",
                  border: "2px solid #1C1917",
                  borderRadius: 14,
                  boxShadow: "4px 4px 0 #1C1917",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#1C1917",
                  }}
                >
                  Streak
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 40,
                    fontWeight: 900,
                    color: "#1C1917",
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  {streak} day{streak !== 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        background: "#FBF6EA",
                        border: "1.5px solid #1C1917",
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-accent)",
                    fontSize: 15,
                    color: "#4A4642",
                    marginTop: 8,
                  }}
                >
                  keep it going!
                </div>
              </div>

              {/* Stats card */}
              <div
                style={{
                  background: "#3B5BDB",
                  border: "2px solid #1C1917",
                  borderRadius: 14,
                  boxShadow: "4px 4px 0 #1C1917",
                  padding: 16,
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    opacity: 0.8,
                  }}
                >
                  TOTAL TOPICS
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 40,
                    fontWeight: 900,
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  {topics?.length ?? 0}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                  topics studied
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming sessions */}
          {upcomingWithTopic.length > 0 && (
            <div style={{ padding: "0 28px 18px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#8A8278", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Upcoming Sessions</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {upcomingWithTopic.map(s => (
                  <div key={s._id} style={{ padding: "12px 14px", background: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                    onClick={() => s.topic && navigate(`/courses/${s.topic.courseId}/topics/${s.topicId}`)}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "#3B5BDB", border: "1.5px solid #1C1917", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff" }}>{s.sessionNumber}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.topic?.name}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", marginTop: 2 }}>{formatSessionTime(s.scheduledAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses row */}
          <div style={{ padding: "0 28px 28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1C1917",
                }}
              >
                Your courses
              </span>
              {courses && courses.length > 0 && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#8A8278",
                    fontWeight: 700,
                  }}
                >
                  {courses.length}
                </span>
              )}
            </div>

            {coursesLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ height: 130, borderRadius: 14, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : coursesEmpty ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 0", textAlign: "center" }}>
                <div style={{ width: 100, height: 100, borderRadius: 20, background: "#F4B400", border: "3px solid #1C1917", boxShadow: "6px 6px 0 #1C1917", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-3deg)" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5 }}>No courses yet</div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: 16, color: "#8A8278", marginTop: 4 }}>Create your first course to get started</div>
                </div>
                <button onClick={() => navigate("/courses")} style={{ padding: "12px 24px", background: "#1C1917", color: "#fff", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "3px 3px 0 rgba(28,25,23,0.25)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Go to Courses →
                </button>
              </motion.div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 14,
                }}
              >
                {courses!.map((course) => (
                  <DesktopCourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
