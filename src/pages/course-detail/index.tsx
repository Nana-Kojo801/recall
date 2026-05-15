import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { CourseHeader } from "./components/course-header";
import { TopicRow } from "./components/topic-row";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { RightSheet } from "@/components/ui/right-sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import { Sidebar } from "@/components/layout/sidebar";
import { ColorPicker } from "@/pages/new-course/components/color-picker";

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function DesktopTopicRow({ topic, courseColor, index }: { topic: { _id: Id<"topics">; name: string; lastStudied?: number; nextReview?: number }; courseColor: string; index: number }) {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const dueCount = topic.nextReview && topic.nextReview <= Date.now() ? 1 : 0;
  const mastery = topic.lastStudied ? 0.6 : 0;
  const badgeColors = ["#2B7A3E", "#F4B400", "#3B5BDB", "#E8482C", "#C93FA9"];
  const badgeBg = badgeColors[index % 5];
  const badgeText = badgeBg === "#F4B400" ? "#1C1917" : "#fff";

  return (
    <div
      onClick={() => navigate(`/courses/${courseId}/topics/${topic._id}`)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: 14, borderRadius: 12, background: "#fff",
        border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917",
        cursor: "pointer",
      }}
    >
      <div style={{
        width: 42, height: 42, background: badgeBg, border: "1.5px solid #1C1917", borderRadius: 8,
        display: "grid", placeItems: "center", color: badgeText,
        fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 800, flexShrink: 0,
      }}>
        {index + 1}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700, color: "#1C1917" }}>
            {topic.name}
          </span>
          {dueCount > 0 && (
            <span style={{
              padding: "2px 7px", background: "#E8482C", color: "#fff",
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
              borderRadius: 4, border: "1px solid #1C1917",
            }}>
              due
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ flex: 1, maxWidth: 340, height: 6, background: "#FBF6EA", border: "1px solid #1C1917", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${mastery * 100}%`, height: "100%", background: mastery > 0.7 ? "#2B7A3E" : mastery > 0.4 ? "#F4B400" : "#E8482C" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", width: 32 }}>
            {Math.round(mastery * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const courseQuery = useQuery(api.courses.get, { courseId: courseId as Id<"courses"> });
  const topicsQuery = useQuery(api.topics.listByCourse, { courseId: courseId as Id<"courses"> });

  const courseRef = useRef<typeof courseQuery>(undefined);
  const topicsRef = useRef<typeof topicsQuery>(undefined);
  if (courseQuery !== undefined) courseRef.current = courseQuery;
  if (topicsQuery !== undefined) topicsRef.current = topicsQuery;
  const course = courseRef.current;
  const topics = topicsRef.current;

  const createTopic = useMutation(api.topics.create);
  const updateCourse = useMutation(api.courses.update);
  const removeCourse = useMutation(api.courses.removeWithCascade);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim() || !courseId) return;
    setCreating(true);
    try {
      await createTopic({ courseId: courseId as Id<"courses">, name: topicName.trim() });
      setTopicName("");
      setSheetOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = () => {
    if (!course) return;
    setEditName(course.name);
    setEditColor(course.color);
    setEditSheetOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !editName.trim()) return;
    setEditSaving(true);
    try {
      await updateCourse({ courseId: courseId as Id<"courses">, name: editName.trim(), color: editColor });
      setEditSheetOpen(false);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    setDeleting(true);
    try {
      await removeCourse({ courseId: courseId as Id<"courses"> });
      navigate("/courses");
    } finally {
      setDeleting(false);
    }
  };

  // Skeleton — course not yet loaded
  if (course === undefined) {
    return (
      <>
        <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
          <div className="animate-pulse relative px-5 pt-12 pb-6" style={{ background: "#D8CEBF", borderBottom: "2.5px solid rgba(28,25,23,0.12)", minHeight: 200 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.3)", marginBottom: 24 }} />
            <div style={{ width: 56, height: 10, borderRadius: 4, background: "rgba(255,255,255,0.35)", marginBottom: 12 }} />
            <div style={{ width: 220, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.3)", marginBottom: 20 }} />
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ width: 32, height: 28, borderRadius: 4, background: "rgba(255,255,255,0.25)" }} />
              <div style={{ width: 32, height: 28, borderRadius: 4, background: "rgba(255,255,255,0.25)" }} />
            </div>
          </div>
          <main className="flex-1 px-5 pt-5 pb-28">
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-card animate-pulse" style={{ background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.08)" }} />
              ))}
            </div>
          </main>
        </div>
        <div className="hidden md:flex h-screen overflow-hidden">
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="animate-pulse" style={{ height: 210, background: "#D8CEBF", borderBottom: "2.5px solid rgba(28,25,23,0.12)", flexShrink: 0, padding: "28px 28px 32px" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: 70, height: 11, borderRadius: 4, background: "rgba(255,255,255,0.3)", marginBottom: 14 }} />
                  <div style={{ width: 320, height: 48, borderRadius: 6, background: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse" style={{ height: 70, borderRadius: 12, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.08)" }} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  const dueCount = topics?.filter((t) => t.nextReview && t.nextReview <= Date.now()).length ?? 0;

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <CourseHeader
          course={course}
          topicCount={topics?.length ?? 0}
          cardCount={0}
          onEdit={handleOpenEdit}
          onDelete={() => setDeleteOpen(true)}
        />

        <motion.main
          className="flex-1 px-5 pt-5 pb-28"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {topics === undefined ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-card animate-pulse" style={{ background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)" }} />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <motion.div className="flex flex-col items-center gap-4 pt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#8A8278" }}>No topics yet</p>
              <Button variant="accent" size="pill" onClick={() => setSheetOpen(true)}>
                <PlusIcon size={16} /> Add Topic
              </Button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {topics.map((topic, i) => (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
                >
                  <TopicRow topic={topic} courseColor={course.color} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.main>

        <div className="fixed bottom-8 right-5 z-40">
          <button
            onClick={() => setSheetOpen(true)}
            className="w-14 h-14 flex items-center justify-center rounded-card transition-all duration-150 active:translate-x-px active:translate-y-px"
            style={{ background: course.color, color: "#fff", border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917" }}
          >
            <PlusIcon size={22} />
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <motion.div
            style={{
              background: course.color, color: "#fff",
              padding: "28px 28px 32px",
              borderBottom: "2.5px solid #1C1917",
              position: "relative", overflow: "hidden", flexShrink: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <svg style={{ position: "absolute", top: 28, right: 40 }} width="28" height="28" viewBox="0 0 24 24" fill="#F4B400">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <button
                onClick={() => navigate("/courses")}
                style={{
                  width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.25)",
                  border: "1.5px solid rgba(255,255,255,0.6)", display: "grid", placeItems: "center",
                  cursor: "pointer", flexShrink: 0, color: "#fff",
                }}
              >
                <BackIcon />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.5, marginTop: 8 }}>
                  {course.name}
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
                  {[
                    { v: topics?.length ?? 0, l: "TOPICS" },
                    { v: dueCount, l: "DUE" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -0.8 }}>{s.v}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, opacity: 0.85 }}>{s.l}</div>
                    </div>
                  ))}
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: 8, alignSelf: "flex-end" }}>
                    <button
                      onClick={handleOpenEdit}
                      style={{
                        padding: "9px 14px", background: "rgba(255,255,255,0.2)", color: "#fff",
                        border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8,
                        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      ✏ Edit
                    </button>
                    <button
                      onClick={() => setDeleteOpen(true)}
                      style={{
                        padding: "9px 14px", background: "rgba(255,255,255,0.15)", color: "#fff",
                        border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 8,
                        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSheetOpen(true)}
                      style={{
                        padding: "9px 14px", background: "#fff", color: "#1C1917",
                        border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 #1C1917",
                        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      + Add topic
                    </button>
                    {dueCount > 0 && (
                      <button
                        onClick={() => topics?.[0] && navigate(`/courses/${courseId}/topics/${topics[0]._id}/study`)}
                        style={{
                          padding: "9px 14px", background: "#1C1917", color: "#fff",
                          border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        ▶ Study all due
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, color: "#1C1917" }}>Topics</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278" }}>
                {topics?.length ?? 0} TOPICS
              </span>
            </div>
            {topics === undefined ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 70, borderRadius: 12, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)" }} />
                ))}
              </div>
            ) : topics.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 48 }}>
                <p style={{ fontFamily: "var(--font-accent)", fontSize: 22, color: "#8A8278" }}>No topics yet</p>
                <button
                  onClick={() => setSheetOpen(true)}
                  style={{
                    marginTop: 16, padding: "11px 20px",
                    background: "#E8482C", color: "#fff",
                    border: "2px solid #1C1917", borderRadius: 10, boxShadow: "3px 3px 0 #1C1917",
                    fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  + Add your first topic
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topics.map((topic, i) => (
                  <motion.div
                    key={topic._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
                  >
                    <DesktopTopicRow topic={topic} courseColor={course.color} index={i} />
                  </motion.div>
                ))}
                <button
                  onClick={() => setSheetOpen(true)}
                  style={{
                    padding: 14, borderRadius: 12, background: "transparent",
                    border: "2px dashed #1C1917", color: "#1C1917",
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Add topic
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New topic sheet */}
      <RightSheet open={sheetOpen} onOpenChange={setSheetOpen} title="New Topic">
        <form onSubmit={handleCreateTopic} className="flex flex-col gap-4">
          <Input id="topic-name-d" label="Topic name" placeholder="e.g. Normalization" value={topicName} onChange={(e) => setTopicName(e.target.value)} autoFocus />
          <Button type="submit" variant="primary" disabled={creating}>{creating ? "Creating…" : "Create Topic"}</Button>
        </form>
      </RightSheet>

      {/* Edit course sheet */}
      <RightSheet open={editSheetOpen} onOpenChange={setEditSheetOpen} title="Edit Course">
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
          <Input id="edit-name" label="Course name" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
          <Input id="edit-code" label="Course code" value={editCode} onChange={(e) => setEditCode(e.target.value)} />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>Color</label>
            <ColorPicker value={editColor} onChange={setEditColor} />
          </div>
          <Button type="submit" variant="primary" disabled={editSaving}>{editSaving ? "Saving…" : "Save changes"}</Button>
        </form>
      </RightSheet>

      {/* Delete confirm sheet */}
      <BottomSheet open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete course?">
        <div className="flex flex-col gap-4">
          <p style={{ fontSize: 14, color: "#4A4642", lineHeight: 1.5 }}>
            This will permanently delete <strong>{course.name}</strong> and all its topics and flashcards. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
