import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { UploadArea } from "./components/upload-area";
import { RightSheet } from "@/components/ui/right-sheet";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  computeSessionSchedule,
  DURATION_OPTIONS,
  formatSessionTime,
} from "@/lib/spaced-repetition/program";
import { generationState } from "@/lib/generation-state";

const RATING_BG: Record<string, string> = {
  easy: "#2B7A3E",
  okay: "#F4B400",
  hard: "#E8482C",
};

function TopicPageSkeleton() {
  return (
    <>
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <div className="animate-pulse relative px-5 pt-12 pb-6 overflow-hidden" style={{ background: "#D8CEBF", borderBottom: "2.5px solid rgba(28,25,23,0.12)", minHeight: 180 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.3)", marginBottom: 20 }} />
          <div style={{ width: 80, height: 10, borderRadius: 4, background: "rgba(255,255,255,0.35)", marginBottom: 10 }} />
          <div style={{ width: 240, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.3)", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 40, height: 24, borderRadius: 4, background: "rgba(255,255,255,0.25)" }} />
            <div style={{ width: 40, height: 24, borderRadius: 4, background: "rgba(255,255,255,0.25)" }} />
          </div>
        </div>
        <main style={{ flex: 1, padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse" style={{ height: 64, borderRadius: 12, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.08)" }} />
          ))}
        </main>
      </div>
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", overflowY: "auto" }}>
          <div className="animate-pulse" style={{ height: 200, background: "#D8CEBF", borderBottom: "2.5px solid rgba(28,25,23,0.12)", padding: "28px 28px 24px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.3)", marginBottom: 20 }} />
            <div style={{ width: 280, height: 44, borderRadius: 6, background: "rgba(255,255,255,0.3)" }} />
          </div>
          <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignContent: "start" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse" style={{ height: 64, borderRadius: 12, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.08)" }} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

// ─── Program Setup Modal ───────────────────────────────────────────────────

type DurationKey = "1d" | "3d" | "1w" | "2w" | "1mo" | "custom";

const DURATION_PRESETS: { key: DurationKey; label: string; ms: number }[] = [
  { key: "1d",  label: "1 day",    ms: DURATION_OPTIONS[0].ms },
  { key: "3d",  label: "3 days",   ms: DURATION_OPTIONS[1].ms },
  { key: "1w",  label: "1 week",   ms: DURATION_OPTIONS[2].ms },
  { key: "2w",  label: "2 weeks",  ms: DURATION_OPTIONS[3].ms },
  { key: "1mo", label: "1 month",  ms: DURATION_OPTIONS[4].ms },
];

function ProgramSetupModal({
  open,
  onOpenChange,
  topicId,
  courseId,
  courseName,
  topicName,
  cardCount,
  onStarted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  topicId: Id<"topics">;
  courseId: Id<"courses">;
  courseName: string;
  topicName: string;
  cardCount: number;
  onStarted: (programId: Id<"programs">, firstSessionId: Id<"programSessions">) => void;
}) {
  const [durationKey, setDurationKey] = useState<DurationKey>("1w");
  const [customDate, setCustomDate] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [calWarning, setCalWarning] = useState(false);

  const createProgram = useMutation(api.programs.create);
  const createSessions = useMutation(api.programSessions.createBatch);
  const createCalendarEvents = useAction(api.googleCalendar.createProgramEvents);

  const now = Date.now();
  const endMs = (() => {
    if (durationKey === "custom") {
      const d = new Date(customDate).getTime();
      return isNaN(d) ? now + DURATION_OPTIONS[2].ms : d;
    }
    return now + (DURATION_PRESETS.find((p) => p.key === durationKey)?.ms ?? DURATION_OPTIONS[2].ms);
  })();

  const NUM_SESSIONS = 6;
  const schedule = computeSessionSchedule(now, endMs, NUM_SESSIONS);

  const minDate = new Date(now + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  async function handleConfirm() {
    setScheduling(true);
    try {
      const programId = await createProgram({
        topicId,
        courseId,
        startDate: now,
        endDate: endMs,
        totalSessions: NUM_SESSIONS,
      });

      const sessionData = schedule.map((scheduledAt, i) => ({
        sessionNumber: i + 1,
        scheduledAt,
        cardCount,
      }));

      const sessionIds = await createSessions({
        programId,
        topicId,
        sessions: sessionData,
      });

      // Try calendar events (non-blocking)
      try {
        const result = await createCalendarEvents({
          programId,
          sessions: sessionIds.map((id, i) => ({
            sessionId: id,
            sessionNumber: i + 1,
            scheduledAt: schedule[i],
            cardCount,
          })),
          courseName,
          topicName,
        });
        if (!result.connected) setCalWarning(true);
      } catch {
        setCalWarning(true);
      }

      onStarted(programId, sessionIds[0] as Id<"programSessions">);
    } finally {
      setScheduling(false);
    }
  }

  return (
    <RightSheet open={open} onOpenChange={onOpenChange} title="Study Program">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Duration presets */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", marginBottom: 8 }}>
            Duration
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DURATION_PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setDurationKey(p.key)}
                style={{
                  padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                  border: "2px solid #1C1917",
                  background: durationKey === p.key ? "#1C1917" : "#fff",
                  color: durationKey === p.key ? "#fff" : "#1C1917",
                  boxShadow: durationKey === p.key ? "2px 2px 0 rgba(28,25,23,0.3)" : "none",
                  transition: "all 0.1s",
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setDurationKey("custom")}
              style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                border: "2px solid #1C1917",
                background: durationKey === "custom" ? "#1C1917" : "#fff",
                color: durationKey === "custom" ? "#fff" : "#1C1917",
                boxShadow: durationKey === "custom" ? "2px 2px 0 rgba(28,25,23,0.3)" : "none",
              }}
            >
              Custom
            </button>
          </div>

          {durationKey === "custom" && (
            <input
              type="date"
              value={customDate}
              min={minDate}
              onChange={(e) => setCustomDate(e.target.value)}
              style={{
                marginTop: 10, width: "100%", padding: "10px 12px",
                borderRadius: 8, border: "2px solid #1C1917",
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                background: "#fff", cursor: "pointer",
              }}
            />
          )}
        </div>

        {/* Session schedule preview */}
        <div style={{ background: "#FBF6EA", border: "2px solid #1C1917", borderRadius: 12, padding: 14, boxShadow: "3px 3px 0 #1C1917" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", marginBottom: 10 }}>
            {NUM_SESSIONS} sessions scheduled
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {schedule.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? "#E8482C" : "#1C1917",
                  display: "grid", placeItems: "center",
                  color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 13, color: "#1C1917", fontWeight: i === 0 ? 700 : 500 }}>
                  {i === 0 ? "Now — starts immediately" : formatSessionTime(t)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {calWarning && (
          <div style={{ padding: "10px 12px", background: "rgba(59,91,219,0.1)", border: "1.5px solid #3B5BDB", borderRadius: 8, fontSize: 12, color: "#3B5BDB", fontWeight: 600 }}>
            Google Calendar not connected — sessions tracked in app only. Connect in Settings.
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" disabled={scheduling} onClick={handleConfirm}>
            {scheduling ? "Scheduling…" : "Start Program →"}
          </Button>
        </div>
      </div>
    </RightSheet>
  );
}

// ─── Session Schedule List ─────────────────────────────────────────────────

function SessionScheduleList({ programId }: { programId: Id<"programs"> }) {
  const sessions = useQuery(api.programSessions.listByProgram, { programId });

  if (!sessions) return null;

  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const now = Date.now();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sorted.map((s) => {
        const isDue = s.status === "upcoming" && s.scheduledAt <= now;
        const isCompleted = s.status === "completed";
        const isFuture = s.status === "upcoming" && s.scheduledAt > now;
        return (
          <div
            key={s._id}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: isDue ? "rgba(232,72,44,0.08)" : "#fff",
              border: `1.5px solid ${isDue ? "#E8482C" : isCompleted ? "#2B7A3E" : "rgba(28,25,23,0.15)"}`,
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: isCompleted ? "#2B7A3E" : isDue ? "#E8482C" : "rgba(28,25,23,0.12)",
              display: "grid", placeItems: "center",
            }}>
              {isCompleted ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: isDue ? "#fff" : "#8A8278" }}>
                  {s.sessionNumber}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isCompleted ? "#2B7A3E" : "#1C1917" }}>
                Session {s.sessionNumber}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", marginTop: 1 }}>
                {isCompleted ? "Completed" : formatSessionTime(s.scheduledAt)}
              </div>
            </div>
            {isDue && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, background: "#E8482C", color: "#fff", border: "1px solid #1C1917", borderRadius: 4, padding: "2px 6px" }}>
                DUE NOW
              </span>
            )}
            {isFuture && s.calendarEventId && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B5BDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export function TopicDetailPage() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>();
  const navigate = useNavigate();

  const course = useQuery(api.courses.get, { courseId: courseId as Id<"courses"> });
  const topic = useQuery(api.topics.get, { topicId: topicId as Id<"topics"> });
  const cards = useQuery(api.flashcards.listByTopic, { topicId: topicId as Id<"topics"> });
  const activeProgram = useQuery(api.programs.getActiveByTopic, { topicId: topicId as Id<"topics"> });

  const updateTopic = useMutation(api.topics.update);
  const removeTopic = useMutation(api.topics.remove);
  const removeCard = useMutation(api.flashcards.remove);
  const removeAllCards = useMutation(api.flashcards.removeAll);
  const removeUpload = useMutation(api.files.remove);
  const deleteTopicCalEvents = useAction(api.googleCalendar.deleteTopicEvents);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [programOpen, setProgramOpen] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAllCards, setDeletingAllCards] = useState(false);
  const [deletingUploadId, setDeletingUploadId] = useState<string | null>(null);
  const [freeStudyOpen, setFreeStudyOpen] = useState(false);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [genStatus, setGenStatus] = useState(() =>
    topicId && generationState.topicId === topicId ? generationState.status : "idle"
  );

  useEffect(() => {
    if (!topicId) return;
    return generationState.subscribe(() => {
      setGenStatus(generationState.topicId === topicId ? generationState.status : "idle");
    });
  }, [topicId]);

  // Must be before any early return — Rules of Hooks
  const programSessions = useQuery(
    api.programSessions.listByProgram,
    activeProgram ? { programId: activeProgram._id } : "skip"
  );
  const uploads = useQuery(api.files.listByTopic, { topicId: topicId as Id<"topics"> });

  const cardCount = cards?.length ?? 0;
  const mastery = cards?.length
    ? Math.round(
        cards.reduce((sum, c) => {
          if (c.lastRating === "easy") return sum + 100;
          if (c.lastRating === "okay") return sum + 60;
          if (c.lastRating === "hard") return sum + 20;
          return sum;
        }, 0) / cards.length
      )
    : 0;

  if (!topic || !course) return <TopicPageSkeleton />;

  function handleOpenEdit() {
    setEditName(topic!.name);
    setEditOpen(true);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || !topicId) return;
    setEditSaving(true);
    try {
      await updateTopic({ topicId: topicId as Id<"topics">, name: editName.trim() });
      setEditOpen(false);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete() {
    if (!topicId) return;
    setDeleting(true);
    try {
      await removeTopic({ topicId: topicId as Id<"topics"> });
      navigate(`/courses/${courseId}`);
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteCard(cardId: string) {
    setDeletingCardId(cardId);
    try {
      await removeCard({ cardId: cardId as Id<"flashcards"> });
    } finally {
      setDeletingCardId(null);
    }
  }

  function handleProgramStarted(programId: Id<"programs">, firstSessionId: Id<"programSessions">) {
    setProgramOpen(false);
    navigate(`/courses/${courseId}/topics/${topicId}/study?programId=${programId}&sessionId=${firstSessionId}`);
  }

  async function handleDeleteAllCards() {
    if (!topicId) return;
    setDeletingAllCards(true);
    try {
      await deleteTopicCalEvents({ topicId: topicId as Id<"topics"> }).catch(() => {});
      await removeAllCards({ topicId: topicId as Id<"topics"> });
      setDeleteAllOpen(false);
    } finally {
      setDeletingAllCards(false);
    }
  }

  async function handleDeleteUpload(uploadId: string) {
    setDeletingUploadId(uploadId);
    try {
      await removeUpload({ uploadId: uploadId as Id<"materialUploads"> });
    } finally {
      setDeletingUploadId(null);
    }
  }

  function startStudy() {
    if (activeProgram && dueSession) {
      navigate(`/courses/${courseId}/topics/${topicId}/study?programId=${activeProgram._id}&sessionId=${dueSession._id}`);
    } else {
      setFreeStudyOpen(true);
    }
  }

  // Due session detection
  const now = Date.now();
  const dueSession = programSessions?.find(
    (s) => s.status === "upcoming" && s.scheduledAt <= now
  );

  const cardsList = cards && cards.length > 0 && (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {cards.map((card, i) => (
          <motion.div
            key={card._id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
            transition={{ delay: i * 0.02 }}
            style={{ padding: 16, borderRadius: 12, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-sm font-bold" style={{ color: "#1C1917", margin: 0 }}>{card.front}</p>
                <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "#8A8278", margin: 0 }}>{card.back}</p>
                {card.lastRating && (
                  <div className="mt-2">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: RATING_BG[card.lastRating],
                        color: card.lastRating === "okay" ? "#1C1917" : "#fff",
                        border: "1px solid #1C1917",
                      }}
                    >
                      {card.lastRating.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteCard(card._id)}
                disabled={deletingCardId === card._id}
                style={{
                  width: 26, height: 26, flexShrink: 0, borderRadius: 6,
                  background: "#fff", border: "1.5px solid rgba(28,25,23,0.2)",
                  display: "grid", placeItems: "center", cursor: "pointer",
                  opacity: deletingCardId === card._id ? 0.5 : 1,
                }}
                aria-label="Delete flashcard"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E8482C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <header className="relative px-5 pt-12 pb-6 overflow-hidden" style={{ background: course.color, borderBottom: "2.5px solid #1C1917" }}>
          <div className="absolute top-8 right-8 pointer-events-none opacity-30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)", border: "1.5px solid rgba(255,255,255,0.6)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleOpenEdit} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                ✏ Edit
              </button>
              <button onClick={() => setDeleteOpen(true)} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>

          <h1 className="font-black" style={{ fontFamily: "var(--font-serif)", fontSize: 28, letterSpacing: -0.5, color: "#fff", lineHeight: 1 }}>
            {topic.name}
          </h1>

          <div className="flex items-center gap-4 mt-3">
            <div>
              <div className="text-xl font-black leading-none" style={{ fontFamily: "var(--font-serif)", color: "#fff" }}>{cardCount}</div>
              <div className="text-[9px] font-bold tracking-[1.5px] mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.75)" }}>CARDS</div>
            </div>
            <div>
              <div className="text-xl font-black leading-none" style={{ fontFamily: "var(--font-serif)", color: "#fff" }}>{mastery}%</div>
              <div className="text-[9px] font-bold tracking-[1.5px] mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.75)" }}>MASTERY</div>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.4)" }}>
                <div className="h-full rounded-full" style={{ width: `${mastery}%`, background: "#fff" }} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 pt-5 pb-10 flex flex-col gap-5">
          {/* Generation banner */}
          {genStatus === "generating" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 14px", background: "rgba(232,72,44,0.08)", border: "2px solid #E8482C", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="gen-dot w-1.5 h-1.5 rounded-full" style={{ background: "#E8482C", animationDelay: `${i*0.2}s` }} />)}
              </div>
              <span style={{ flex: 1, color: "#E8482C", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>Generating flashcards…</span>
              <span style={{ fontSize: 10, color: "#8A8278", fontFamily: "var(--font-mono)" }}>Safe to leave</span>
            </motion.div>
          )}

          {/* Due Now banner */}
          {dueSession && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 14px", background: "#E8482C", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ flex: 1, color: "#fff", fontSize: 13, fontWeight: 700 }}>Session {dueSession.sessionNumber} is due now</span>
              <button onClick={startStudy} style={{ padding: "5px 10px", background: "#fff", color: "#E8482C", border: "1.5px solid #1C1917", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                Study
              </button>
            </motion.div>
          )}

          {cardCount > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={startStudy}
                className="w-full py-4 font-black text-base relative flex items-center justify-center gap-2 transition-all duration-150 active:translate-x-px active:translate-y-px"
                style={{ background: "#1C1917", color: "#F5EFE2", border: "2.5px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 rgba(28,25,23,0.25)", fontFamily: "var(--font-serif)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {activeProgram && dueSession ? "Continue Program" : "Study Now"}
                <span className="absolute right-4 text-xs font-bold opacity-50" style={{ fontFamily: "var(--font-mono)" }}>{cardCount}</span>
              </button>

              {!activeProgram && (
                <button
                  onClick={() => setProgramOpen(true)}
                  className="w-full py-3 font-bold text-sm flex items-center justify-center gap-2"
                  style={{ background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", fontFamily: "var(--font-sans)", cursor: "pointer" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Start Study Program
                </button>
              )}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => setUploadSheetOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fff", color: "#1C1917", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "2px 2px 0 #1C1917", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
                Upload Material
              </button>
              {uploads && uploads.length > 0 && (
                <button onClick={() => setFilesOpen(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 #1C1917", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {uploads.length} file{uploads.length !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </motion.div>

          {/* Active program session list */}
          {activeProgram && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                <h2 className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>
                  Study Program
                </h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>
                  ends {new Date(activeProgram.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <SessionScheduleList programId={activeProgram._id} />
            </motion.div>
          )}

          {cards && cards.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                <h2 className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>
                  Flashcards · {cardCount}
                </h2>
                <button onClick={() => setDeleteAllOpen(true)} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#E8482C", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Delete all
                </button>
              </div>
              {cardsList}
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", overflowY: "auto" }}>
          {/* Hero */}
          <div style={{ background: course.color, color: "#fff", padding: "28px 28px 24px", borderBottom: "2.5px solid #1C1917", position: "relative", overflow: "hidden" }}>
            <svg style={{ position: "absolute", top: 28, right: 40, opacity: 0.3 }} width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.25)", border: "1.5px solid rgba(255,255,255,0.6)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, opacity: 0.85 }}>
                  {course.name}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 900, lineHeight: 0.95, letterSpacing: -1.5, marginTop: 8 }}>
                  {topic.name}
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 16, alignItems: "flex-end" }}>
                  {[{ v: cardCount, l: "CARDS" }, { v: `${mastery}%`, l: "MASTERY" }].map((s) => (
                    <div key={s.l}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: -0.8 }}>{s.v}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, opacity: 0.85 }}>{s.l}</div>
                    </div>
                  ))}
                  <div style={{ width: 200, height: 8, background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 4, overflow: "hidden", alignSelf: "center" }}>
                    <div style={{ width: `${mastery}%`, height: "100%", background: "#fff" }} />
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleOpenEdit} style={{ padding: "9px 14px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      ✏ Edit
                    </button>
                    <button onClick={() => setDeleteOpen(true)} style={{ padding: "9px 14px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Delete
                    </button>
                    {cardCount > 0 && !activeProgram && (
                      <button
                        onClick={() => setProgramOpen(true)}
                        style={{ padding: "9px 14px", background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Start Study Program
                      </button>
                    )}
                    {cardCount > 0 && (
                      <button
                        onClick={startStudy}
                        style={{ padding: "9px 16px", background: "#1C1917", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        {activeProgram && dueSession ? "Continue Program" : "Study Now"} · {cardCount} cards
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignContent: "start" }}>
            {/* Left: flashcards */}
            <div>
              {/* Generation banner */}
              {genStatus === "generating" && (
                <div style={{ marginBottom: 12, padding: "12px 14px", background: "rgba(232,72,44,0.08)", border: "2px solid #E8482C", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="gen-dot w-1.5 h-1.5 rounded-full" style={{ background: "#E8482C", animationDelay: `${i*0.2}s` }} />)}
                  </div>
                  <span style={{ flex: 1, color: "#E8482C", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)" }}>Generating flashcards…</span>
                  <span style={{ fontSize: 10, color: "#8A8278", fontFamily: "var(--font-mono)" }}>Safe to leave</span>
                </div>
              )}

              {/* Due now banner */}
              {dueSession && (
                <div style={{ marginBottom: 12, padding: "12px 14px", background: "#E8482C", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "3px 3px 0 #1C1917", display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ flex: 1, color: "#fff", fontSize: 13, fontWeight: 700 }}>Session {dueSession.sessionNumber} is due now</span>
                  <button onClick={startStudy} style={{ padding: "5px 10px", background: "#fff", color: "#E8482C", border: "1.5px solid #1C1917", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    Study now
                  </button>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, color: "#1C1917" }}>Flashcards</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278" }}>{cardCount} CARDS</span>
                  {cardCount > 0 && (
                    <button onClick={() => setDeleteAllOpen(true)} style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#E8482C", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Delete all
                    </button>
                  )}
                </div>
              </div>

              {cards === undefined ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 64, borderRadius: 12, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)" }} />
                  ))}
                </div>
              ) : cards.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 40 }}>
                  <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#8A8278" }}>No cards yet</p>
                  <p style={{ fontSize: 13, marginTop: 4, color: "#8A8278" }}>Upload material to generate flashcards automatically.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <AnimatePresence>
                    {cards.map((card) => (
                      <motion.div
                        key={card._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: 14, borderRadius: 12, background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917" }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", margin: 0 }}>{card.front}</p>
                            <p style={{ fontSize: 12, color: "#8A8278", marginTop: 6, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {card.back}
                            </p>
                            {card.lastRating && (
                              <div style={{ marginTop: 8 }}>
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, border: "1px solid #1C1917", background: RATING_BG[card.lastRating], color: card.lastRating === "okay" ? "#1C1917" : "#fff" }}>
                                  {card.lastRating.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            disabled={deletingCardId === card._id}
                            style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 6, background: "#FBF6EA", border: "1.5px solid rgba(28,25,23,0.15)", display: "grid", placeItems: "center", cursor: "pointer", opacity: deletingCardId === card._id ? 0.5 : 1 }}
                            aria-label="Delete flashcard"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8482C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Right: upload + program/stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setUploadSheetOpen(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#fff", color: "#1C1917", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "2px 2px 0 #1C1917", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                  </svg>
                  Upload Material
                </button>
                {uploads && uploads.length > 0 && (
                  <button onClick={() => setFilesOpen(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 #1C1917", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {uploads.length} file{uploads.length !== 1 ? "s" : ""}
                  </button>
                )}
              </div>

              {/* Active program */}
              {activeProgram && (
                <div style={{ background: "#fff", border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917", padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 800, color: "#1C1917" }}>Study Program</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>
                      ends {new Date(activeProgram.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <SessionScheduleList programId={activeProgram._id} />
                </div>
              )}

              {cardCount > 0 && (
                <div style={{ padding: 14, background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 14, boxShadow: "4px 4px 0 #1C1917" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>MASTERY</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{mastery}%</div>
                  <div style={{ marginTop: 10, height: 8, background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${mastery}%`, height: "100%", background: "#fff" }} />
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6 }}>{cardCount} cards total</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit topic sheet */}
      <RightSheet open={editOpen} onOpenChange={setEditOpen} title="Edit Topic">
        <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input id="edit-topic-name" label="Topic name" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
          <Button type="submit" variant="primary" disabled={editSaving}>{editSaving ? "Saving…" : "Save changes"}</Button>
        </form>
      </RightSheet>

      {/* Program setup */}
      {course && topic && (
        <ProgramSetupModal
          open={programOpen}
          onOpenChange={setProgramOpen}
          topicId={topicId as Id<"topics">}
          courseId={courseId as Id<"courses">}
          courseName={course.name}
          topicName={topic.name}
          cardCount={cardCount}
          onStarted={handleProgramStarted}
        />
      )}

      {/* Delete topic confirmation */}
      <BottomSheet open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete topic?">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#4A4642", lineHeight: 1.5, margin: 0 }}>
            This will permanently delete <strong>{topic.name}</strong> and all its flashcards. This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete all flashcards confirmation */}
      <BottomSheet open={deleteAllOpen} onOpenChange={setDeleteAllOpen} title="Delete all flashcards?">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#4A4642", lineHeight: 1.5, margin: 0 }}>
            This will permanently delete all <strong>{cardCount} flashcard{cardCount !== 1 ? "s" : ""}</strong> for this topic. This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteAllOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={deletingAllCards} onClick={handleDeleteAllCards}>
              {deletingAllCards ? "Deleting…" : "Delete all"}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Free study drawer */}
      <BottomSheet open={freeStudyOpen} onOpenChange={setFreeStudyOpen} title="Study Now">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#4A4642", lineHeight: 1.6, margin: 0 }}>
            {activeProgram
              ? "No sessions are due right now. You can still review all your cards in a free study session."
              : "You don't have a study program set up. Start a free session to review all cards now."}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" className="flex-1" onClick={() => setFreeStudyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => {
              setFreeStudyOpen(false);
              navigate(`/courses/${courseId}/topics/${topicId}/study?all=1`);
            }}>
              Study Now →
            </Button>
          </div>
          {!activeProgram && cardCount > 0 && (
            <button
              onClick={() => { setFreeStudyOpen(false); setProgramOpen(true); }}
              style={{ padding: "10px", borderRadius: 10, background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Create Study Program Instead
            </button>
          )}
        </div>
      </BottomSheet>

      {/* Upload material sheet */}
      <RightSheet open={uploadSheetOpen} onOpenChange={setUploadSheetOpen} title="Upload Material">
        <UploadArea topicId={topicId as Id<"topics">} onCancel={() => setUploadSheetOpen(false)} />
      </RightSheet>

      {/* Uploaded files sheet */}
      <RightSheet open={filesOpen} onOpenChange={setFilesOpen} title="Uploaded Files">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!uploads || uploads.length === 0 ? (
            <p style={{ fontSize: 13, color: "#8A8278", margin: 0 }}>No files uploaded yet.</p>
          ) : (
            uploads.map((u) => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", border: "1.5px solid #1C1917", borderRadius: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.fileName}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278" }}>
                      {u.fileSize ? `${(u.fileSize / 1024).toFixed(0)} KB` : ""}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, border: "1px solid",
                      background: u.status === "done" ? "#2B7A3E" : u.status === "error" ? "#E8482C" : "#F4B400",
                      color: u.status === "done" || u.status === "error" ? "#fff" : "#1C1917",
                      borderColor: "#1C1917",
                    }}>
                      {u.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteUpload(u._id)}
                  disabled={deletingUploadId === u._id}
                  style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 6, background: "#FBF6EA", border: "1.5px solid rgba(28,25,23,0.15)", display: "grid", placeItems: "center", cursor: "pointer", opacity: deletingUploadId === u._id ? 0.5 : 1 }}
                  aria-label="Delete file"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8482C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </RightSheet>
    </>
  );
}
