import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { FlashCard } from "./components/flash-card";
import { RatingButtons } from "./components/rating-buttons";
import { ProgressBar } from "./components/progress-bar";
import { applyRating, type Rating } from "@/lib/spaced-repetition/sm2";
import { adjustNextSessionTime, formatSessionTime } from "@/lib/spaced-repetition/program";
import { Button } from "@/components/ui/button";

function formatElapsed(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function StudySessionPage() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const programId = searchParams.get("programId") as Id<"programs"> | null;
  const sessionId = searchParams.get("sessionId") as Id<"programSessions"> | null;
  const allMode = searchParams.get("all") === "1";
  const storageKey = `study-${topicId}-${programId ?? "free"}`;
  const sessionStartTime = useRef(Date.now());

  const course = useQuery(api.courses.get, { courseId: courseId as Id<"courses"> });
  const topic = useQuery(api.topics.get, { topicId: topicId as Id<"topics"> });
  const dueCards = useQuery(
    api.flashcards.getDueByTopic,
    !programId && !allMode ? { topicId: topicId as Id<"topics">, now: sessionStartTime.current } : "skip"
  );
  const allCards = useQuery(
    api.flashcards.listByTopic,
    (programId || allMode) ? { topicId: topicId as Id<"topics"> } : "skip"
  );
  const cards = (programId || allMode) ? allCards : dueCards;

  const activeProgram = useQuery(
    api.programs.getActiveByTopic,
    topicId ? { topicId: topicId as Id<"topics"> } : "skip"
  );
  const programSessions = useQuery(
    api.programSessions.listByProgram,
    programId ? { programId } : "skip"
  );

  const updateCard = useMutation(api.flashcards.updateAfterRating);
  const createSession = useMutation(api.studySessions.create);
  const completeSession = useMutation(api.studySessions.complete);
  const completeProgramSession = useMutation(api.programSessions.complete);
  const rescheduleSession = useMutation(api.programSessions.reschedule);
  const advanceProgram = useMutation(api.programs.advanceSession);
  const updateTopic = useMutation(api.topics.update);
  const updateCalEvent = useAction(api.googleCalendar.updateSessionEvent);

  const [studySessionId, setStudySessionId] = useState<Id<"studySessions"> | null>(null);
  const [currentIdx, setCurrentIdx] = useState(() => {
    try { return Math.max(0, parseInt(sessionStorage.getItem(storageKey) ?? "0", 10) || 0); }
    catch { return 0; }
  });
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [nextSessionInfo, setNextSessionInfo] = useState<{ scheduledAt: number; sessionNumber: number } | null>(null);
  const [frozenCards, setFrozenCards] = useState<NonNullable<typeof cards>>([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const ratingCounts = useRef({ hard: 0, okay: 0, easy: 0 });
  const pausedMsRef = useRef(0);
  const pauseStartRef = useRef<number | null>(null);

  // Freeze cards on first load — prevents mid-session reactive list changes
  useEffect(() => {
    if (cards !== undefined && !cardsLoaded) {
      setCardsLoaded(true);
      setFrozenCards(cards);
      if (cards.length > 0) {
        setCurrentIdx(i => Math.min(i, cards.length - 1));
      }
    }
  }, [cards, cardsLoaded]);

  // Pause timer when tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        pauseStartRef.current = Date.now();
      } else if (pauseStartRef.current !== null) {
        pausedMsRef.current += Date.now() - pauseStartRef.current;
        pauseStartRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Elapsed clock — subtracts paused time
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPause = pauseStartRef.current ? Date.now() - pauseStartRef.current : 0;
      const active = Date.now() - sessionStartTime.current - pausedMsRef.current - currentPause;
      setElapsedSecs(Math.floor(Math.max(0, active) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cardsLoaded && frozenCards.length > 0 && !studySessionId && courseId && topicId) {
      createSession({
        topicId: topicId as Id<"topics">,
        courseId: courseId as Id<"courses">,
      }).then(setStudySessionId);
    }
  }, [cardsLoaded, frozenCards, courseId, topicId, studySessionId, createSession]);

  const totalCards = frozenCards.length;
  const currentCard = frozenCards[currentIdx];
  const currentProgramSession = programSessions?.find(s => s._id === sessionId);

  const handleRate = async (rating: Rating) => {
    if (!currentCard) return;

    ratingCounts.current[rating]++;
    const newState = applyRating(
      { interval: currentCard.interval, easeFactor: currentCard.easeFactor, repetitions: currentCard.repetitions, nextReview: currentCard.nextReview },
      rating
    );

    updateCard({ cardId: currentCard._id, rating, ...newState }); // fire-and-forget

    if (currentIdx + 1 >= totalCards) {
      sessionStorage.removeItem(storageKey);

      // Show next session info immediately from existing data (no await)
      if (sessionId && programId) {
        const immediateNext = programSessions
          ?.filter(s => s.status === "upcoming" && s._id !== sessionId)
          .sort((a, b) => a.sessionNumber - b.sessionNumber)[0];
        if (immediateNext) {
          setNextSessionInfo({ scheduledAt: immediateNext.scheduledAt, sessionNumber: immediateNext.sessionNumber });
        }
      }
      setDone(true);

      void (async () => {
        if (studySessionId) await completeSession({ sessionId: studySessionId, cardsStudied: totalCards });
        if (topicId) await updateTopic({ topicId: topicId as Id<"topics">, lastStudied: Date.now(), nextReview: newState.nextReview });

        if (sessionId && programId) {
          await completeProgramSession({ sessionId });
          await advanceProgram({ programId });

          const { hard, okay, easy } = ratingCounts.current;
          const total = hard + okay + easy;
          const easyRatio = total > 0 ? easy / total : 0.5;

          const nextSession = programSessions
            ?.filter(s => s.status === "upcoming" && s._id !== sessionId)
            .sort((a, b) => a.sessionNumber - b.sessionNumber)[0];

          if (nextSession && activeProgram) {
            const adjustedAt = adjustNextSessionTime(
              nextSession.scheduledAt,
              Date.now(),
              activeProgram.endDate,
              easyRatio
            );

            if (Math.abs(adjustedAt - nextSession.scheduledAt) > 5 * 60 * 1000) {
              await rescheduleSession({ sessionId: nextSession._id, scheduledAt: adjustedAt });
              if (nextSession.calendarEventId && course && topic) {
                const durationMin = Math.max(10, nextSession.cardCount);
                await updateCalEvent({
                  eventId: nextSession.calendarEventId,
                  scheduledAt: adjustedAt,
                  durationMinutes: durationMin,
                  title: `Engram: ${course.code} - ${topic.name}`,
                  description: `Spaced repetition session ${nextSession.sessionNumber} - ${nextSession.cardCount} cards to review`,
                }).catch(() => {});
              }
              // Update with rescheduled time
              setNextSessionInfo({ scheduledAt: adjustedAt, sessionNumber: nextSession.sessionNumber });
            }
          }
        }
      })();
    } else {
      const nextIdx = currentIdx + 1;
      sessionStorage.setItem(storageKey, String(nextIdx));
      setCurrentIdx(nextIdx);
      setFlipped(false);
    }
  };

  // Done check FIRST — before reactive empty check
  if (done) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-svh px-5 gap-6"
        style={{ background: "#F5EFE2" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="w-24 h-24 rounded-[20px] flex items-center justify-center"
          style={{ background: "#F4B400", border: "2.5px solid #1C1917", boxShadow: "6px 6px 0 #1C1917" }}
          initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <div className="text-center">
          <h2 className="text-3xl font-black" style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.5 }}>Session complete!</h2>
          <p className="mt-1" style={{ fontFamily: "var(--font-accent)", fontSize: 18, color: "#4A4642" }}>
            {totalCards} card{totalCards !== 1 ? "s" : ""} reviewed
          </p>
          <div className="flex gap-3 mt-3 justify-center">
            {[
              { key: "easy", label: "Easy", color: "#2B7A3E" },
              { key: "okay", label: "Okay", color: "#F4B400" },
              { key: "hard", label: "Hard", color: "#E8482C" },
            ].map(({ key, label, color }) => (
              ratingCounts.current[key as keyof typeof ratingCounts.current] > 0 && (
                <span key={key} style={{ padding: "3px 10px", borderRadius: 6, background: color, color: key === "okay" ? "#1C1917" : "#fff", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, border: "1.5px solid #1C1917" }}>
                  {ratingCounts.current[key as keyof typeof ratingCounts.current]} {label}
                </span>
              )
            ))}
          </div>
        </div>

        {nextSessionInfo && (
          <div style={{ padding: "12px 16px", background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 12, boxShadow: "3px 3px 0 #1C1917", textAlign: "center", maxWidth: 300, width: "100%" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", opacity: 0.8, marginBottom: 4 }}>
              Next session
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800 }}>
              Session {nextSessionInfo.sessionNumber}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              {formatSessionTime(nextSessionInfo.scheduledAt)}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button variant="primary" onClick={() => navigate(`/courses/${courseId}/topics/${topicId}`)}>Back to Topic</Button>
          <Button variant="secondary" onClick={() => navigate("/")}>Home</Button>
        </div>
      </motion.div>
    );
  }

  // Loading
  if (!cardsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-svh" style={{ background: "#F5EFE2" }}>
        <div style={{ fontFamily: "var(--font-mono)", color: "#8A8278", fontSize: 13 }}>Loading cards...</div>
      </div>
    );
  }

  // Empty state
  if (frozenCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh px-5 gap-5" style={{ background: "#F5EFE2" }}>
        <div className="w-20 h-20 rounded-[18px] flex items-center justify-center"
          style={{ background: "#2B7A3E", border: "2.5px solid #1C1917", boxShadow: "5px 5px 0 #1C1917" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black" style={{ fontFamily: "var(--font-serif)", color: "#1C1917" }}>All caught up!</h2>
          <p className="text-sm mt-1" style={{ color: "#4A4642" }}>No cards due for review right now.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back to Topic</Button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        {/* Exit row */}
        <div className="flex px-4 pt-10 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Topic heading */}
        <div className="px-5 pb-2">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>
            {course?.code}{programId && currentProgramSession && ` · SESSION ${currentProgramSession.sessionNumber}`}
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 900, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1.1, margin: 0 }}>
            {topic?.name}
          </h1>
        </div>
        {/* Progress badge */}
        <div className="flex items-center justify-between px-5 pb-4">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#8A8278", letterSpacing: 1 }}>
            {programId && currentProgramSession ? `SESSION ${currentProgramSession.sessionNumber}` : "FREE STUDY"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ padding: "5px 10px", background: "#fff", color: "#8A8278", borderRadius: 8, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, border: "1.5px solid rgba(28,25,23,0.15)", letterSpacing: 0.5 }}>
              {formatElapsed(elapsedSecs)}
            </div>
            <div style={{ padding: "5px 12px", background: "#1C1917", color: "#F5EFE2", borderRadius: 8, fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 13, boxShadow: "2px 2px 0 rgba(28,25,23,0.25)", letterSpacing: 0.5 }}>
              {currentIdx + 1}<span style={{ opacity: 0.45, margin: "0 2px" }}>/</span>{totalCards}
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col px-5" style={{ minHeight: 0, paddingBottom: 28 }}>
          <div style={{ paddingRight: "6px" }}>
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div key={currentCard._id} className="w-full"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }} transition={{ type: "spring", damping: 22, stiffness: 220 }}>
                  <FlashCard front={currentCard.front} back={currentCard.back} onFlip={() => setFlipped(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ marginTop: 20 }}>
            <RatingButtons onRate={handleRate} visible={flipped} />
          </div>
        </main>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden flex-col" style={{ background: "#F5EFE2" }}>
        <div style={{ padding: "14px 28px", borderBottom: "2px solid #1C1917", display: "flex", alignItems: "center", gap: 16, background: "#FBF6EA", flexShrink: 0 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: "6px 12px", background: "#fff", color: "#1C1917", border: "2px solid #1C1917", borderRadius: 8, boxShadow: "2px 2px 0 #1C1917", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            ✕ Exit
          </button>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#8A8278", fontWeight: 700, textTransform: "uppercase" }}>
              {course?.code} / {topic?.name}{programId ? " · PROGRAM" : ""}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1, color: "#1C1917" }}>
              {topic?.name}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          {programId && currentProgramSession && (
            <div style={{ padding: "6px 14px", background: "#3B5BDB", color: "#fff", border: "2px solid #1C1917", borderRadius: 8, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13 }}>
              SESSION {currentProgramSession.sessionNumber}
            </div>
          )}
          <div style={{ padding: "6px 12px", background: "#fff", border: "2px solid #1C1917", borderRadius: 8, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "#1C1917", minWidth: 64, textAlign: "center" }}>
            ⏱ {formatElapsed(elapsedSecs)}
          </div>
          <div style={{ padding: "6px 12px", background: "#fff", border: "2px solid #1C1917", borderRadius: 8, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: "#1C1917" }}>
            {currentIdx + 1}/{totalCards}
          </div>
        </div>

        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 300px", minHeight: 0 }}>
          <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div key={currentCard._id} style={{ width: "100%", maxWidth: 640 }}
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }} transition={{ type: "spring", damping: 22, stiffness: 220 }}>
                  <FlashCard front={currentCard.front} back={currentCard.back} onFlip={() => setFlipped(true)} />
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ width: "100%", maxWidth: 640 }}>
              {flipped && (
                <div style={{ textAlign: "center", fontFamily: "var(--font-accent)", fontSize: 19, fontWeight: 700, color: "#8A8278", marginBottom: 10 }}>
                  How well did you know it?
                </div>
              )}
              <RatingButtons onRate={handleRate} visible={flipped} />
            </div>
          </div>

          <div style={{ borderLeft: "2px solid #1C1917", background: "#FBF6EA", padding: 20, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#8A8278", fontWeight: 700, textTransform: "uppercase" }}>THIS SESSION</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { v: currentIdx, l: "DONE", c: "#2B7A3E" },
                { v: totalCards - currentIdx, l: "LEFT", c: "#1C1917" },
              ].map((s) => (
                <div key={s.l} style={{ padding: 10, background: "#fff", border: "1.5px solid #1C1917", borderRadius: 8 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, background: "#3B5BDB", color: "#fff", border: "1.5px solid #1C1917", borderRadius: 10 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>PROGRESS</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                {totalCards > 0 ? Math.round((currentIdx / totalCards) * 100) : 0}%
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>{currentIdx} of {totalCards} cards</div>
            </div>
            {currentIdx > 0 && (
              <div style={{ padding: 12, background: "#fff", border: "1.5px solid #1C1917", borderRadius: 10 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, color: "#8A8278", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>RATINGS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { key: "easy", label: "Easy", color: "#2B7A3E" },
                    { key: "okay", label: "Okay", color: "#F4B400" },
                    { key: "hard", label: "Hard", color: "#E8482C" },
                  ].map(({ key, label, color }) => {
                    const count = ratingCounts.current[key as keyof typeof ratingCounts.current];
                    return (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, width: 30, color: "#8A8278" }}>{label}</span>
                        <div style={{ flex: 1, height: 6, background: "#F5EFE2", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${currentIdx > 0 ? (count / currentIdx) * 100 : 0}%`, height: "100%", background: color, transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#1C1917", width: 16, textAlign: "right" }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!flipped && currentCard && (
              <div style={{ padding: 12, background: "#fff", border: "1.5px solid #1C1917", borderRadius: 10 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1, color: "#8A8278", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>TIP</div>
                <div style={{ fontSize: 12, color: "#4A4642", lineHeight: 1.4 }}>Tap the card to reveal the answer, then rate how well you knew it.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
