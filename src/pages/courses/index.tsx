import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/../convex/_generated/api";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CoursesList } from "@/pages/home/components/courses-list";
import { PlusIcon } from "@/components/icons";
import { RightSheet } from "@/components/ui/right-sheet";
import { CourseForm } from "@/pages/new-course/components/course-form";

function DesktopCourseCard({
  course,
}: {
  course: { _id: string; name: string; code: string; color: string };
}) {
  const navigate = useNavigate();
  const topics = useQuery(api.topics.listByCourse, { courseId: course._id as never });
  const topicCount = topics?.length ?? 0;
  const dueCount = topics?.filter((t) => t.nextReview && t.nextReview <= Date.now()).length ?? 0;
  const mastery =
    topics && topics.length > 0
      ? Math.round(topics.reduce((sum, t) => (!t.lastStudied ? sum : sum + 60), 0) / topics.length)
      : 0;

  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      style={{
        background: "#fff", border: "2px solid #1C1917",
        borderRadius: 14, boxShadow: "4px 4px 0 #1C1917",
        overflow: "hidden", cursor: "pointer",
      }}
    >
      <div style={{ height: 54, background: course.color, borderBottom: "2px solid #1C1917", position: "relative" }}>
        <span style={{ position: "absolute", top: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          {course.code}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {course.name}
        </div>
        <div style={{ marginTop: 8, height: 4, background: "#FBF6EA", border: "1px solid #1C1917", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${mastery}%`, background: "#2B7A3E" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "#8A8278", fontWeight: 600 }}>
            {topicCount} {topicCount === 1 ? "topic" : "topics"}
          </span>
          {dueCount > 0 && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, background: "#E8482C", color: "#fff", border: "1px solid #1C1917", borderRadius: 4, padding: "2px 6px" }}>
              {dueCount} DUE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CoursesPage() {
  const navigate = useNavigate();
  const courses = useQuery(api.courses.list);
  const [newCourseOpen, setNewCourseOpen] = useState(false);

  // Debounce empty state to prevent stale-cache flash
  const [stableEmpty, setStableEmpty] = useState(false);
  useEffect(() => {
    if (courses !== undefined && courses.length === 0) {
      const t = setTimeout(() => setStableEmpty(true), 400);
      return () => clearTimeout(t);
    }
    setStableEmpty(false);
  }, [courses]);

  const isLoading = courses === undefined || (courses !== undefined && courses.length === 0 && !stableEmpty);
  const isEmpty = courses !== undefined && courses.length === 0 && stableEmpty;

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <header className="px-5 pt-12 pb-4">
          <p className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>
            YOUR LIBRARY
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.8, lineHeight: 1 }}>
              Courses
            </h1>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8482C">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>
        </header>
        <main className="flex-1 pb-28">
          <CoursesList />
        </main>
        <div className="fixed bottom-20 right-5 z-50">
          <button
            onClick={() => setNewCourseOpen(true)}
            className="w-14 h-14 flex items-center justify-center rounded-card transition-all duration-150 active:translate-x-px active:translate-y-px"
            style={{ background: "#E8482C", border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917", color: "#fff" }}
          >
            <PlusIcon size={22} />
          </button>
        </div>
        <BottomNav />
      </div>

      <RightSheet open={newCourseOpen} onOpenChange={setNewCourseOpen} title="New Course">
        <CourseForm />
      </RightSheet>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase", marginBottom: 4 }}>
                YOUR LIBRARY
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1 }}>
                Courses
              </div>
            </div>
            <button
              onClick={() => setNewCourseOpen(true)}
              style={{
                background: "#E8482C", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917",
                borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              + New course
            </button>
          </div>

          {/* Courses grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
            {isLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ height: 130, borderRadius: 14, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : isEmpty ? (
              <motion.div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, gap: 20 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <div style={{
                  width: 120, height: 120, borderRadius: 24, background: "#F4B400",
                  border: "3px solid #1C1917", boxShadow: "8px 8px 0 #1C1917",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: "rotate(-4deg)",
                }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5 }}>No courses yet.</div>
                  <div style={{ fontFamily: "var(--font-accent)", fontSize: 18, color: "#E8482C", marginTop: 4 }}>Let's fix that ✨</div>
                </div>
                <button
                  onClick={() => setNewCourseOpen(true)}
                  style={{
                    padding: "12px 24px", background: "#E8482C", color: "#fff",
                    border: "2px solid #1C1917", borderRadius: 10, boxShadow: "3px 3px 0 #1C1917",
                    fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  + Create your first course
                </button>
              </motion.div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, color: "#1C1917" }}>All courses</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278" }}>{courses!.length} COURSES</span>
                </div>
                <motion.div
                  style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {courses!.map((course, i) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
                    >
                      <DesktopCourseCard course={course} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
