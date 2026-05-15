import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useParams } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { useRef, useEffect } from "react";
import { playNotificationSound } from "@/lib/notification-sound";
import { api } from "@/../convex/_generated/api";
import { AuthPage } from "./pages/auth";
import { HomePage } from "./pages/home";
import { CourseDetailPage } from "./pages/course-detail";
import { TopicDetailPage } from "./pages/topic-detail";
import { StudySessionPage } from "./pages/study-session";
import { NewCoursePage } from "./pages/new-course";
import { LibraryPage } from "./pages/library";
import { CalendarPage } from "./pages/calendar";
import { SettingsPage } from "./pages/settings";
import { CoursesPage } from "./pages/courses";
import { StatsPage } from "./pages/stats";
import { PrivacyPage } from "./pages/privacy";
import { TermsPage } from "./pages/terms";

// Tracks FIRED notifications — prevents duplicates across remounts
const _notifiedDue = new Set<string>();
const _notifiedReviews = new Set<string>();
// Tracks PENDING timers — cleared on unmount so they get rescheduled on remount
const _pendingWarnings = new Set<string>();
const _pendingDue = new Set<string>();

function SessionNotifier() {
  const dueSessions = useQuery(api.programSessions.getDueByUser);
  const upcomingSessions = useQuery(api.programSessions.getUpcomingByUser);
  const topics = useQuery(api.topics.listByUser);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!dueSessions || !topics || !("Notification" in window) || Notification.permission !== "granted") return;
    for (const session of dueSessions) {
      const key = `due-${session._id}`;
      if (_notifiedDue.has(key)) continue;
      const topic = topics.find((t) => t._id === session.topicId);
      if (!topic) continue;
      playNotificationSound();
      new Notification("Study session due now", {
        body: `Session ${session.sessionNumber} for ${topic.name} is ready`,
        icon: "/session-notif.svg",
        tag: key,
      });
      _notifiedDue.add(key);
    }
  }, [dueSessions, topics]);

  useEffect(() => {
    if (!topics || !("Notification" in window) || Notification.permission !== "granted") return;
    const now = Date.now();
    for (const topic of topics) {
      if (!topic.nextReview || topic.nextReview > now) continue;
      const key = `review-${topic._id}-${topic.nextReview}`;
      if (_notifiedReviews.has(key)) continue;
      playNotificationSound();
      new Notification("Review due now", {
        body: `${topic.name} is ready for review`,
        icon: "/review-notif.svg",
        tag: key,
      });
      _notifiedReviews.add(key);
    }
  }, [topics]);

  useEffect(() => {
    if (!upcomingSessions || !topics) return;
    const now = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cancelFns: Array<() => void> = [];
    function scheduleOnce(key: string, pendingSet: Set<string>, firedSet: Set<string> | null, msUntil: number, notify: () => void) {
      if (pendingSet.has(key) || firedSet?.has(key)) return;
      if (msUntil <= 0) return;
      pendingSet.add(key);
      const t = setTimeout(() => {
        pendingSet.delete(key);
        if (firedSet) firedSet.add(key);
        if (!("Notification" in window) || Notification.permission !== "granted") return;
        notify();
      }, msUntil);
      timers.push(t);
      cancelFns.push(() => { clearTimeout(t); pendingSet.delete(key); });
    }

    for (const session of upcomingSessions) {
      const topic = topics?.find((tp) => tp._id === session.topicId);
      const name = topic?.name ?? "your topic";

      scheduleOnce(`warn10-${session._id}`, _pendingWarnings, null, session.scheduledAt - 10 * 60 * 1000 - now, () => {
        playNotificationSound();
        new Notification("Study session in 10 minutes", {
          body: `Session ${session.sessionNumber} for ${name} starts in 10 minutes`,
          icon: "/session-notif.svg",
          tag: `warn10-${session._id}`,
        });
      });

      scheduleOnce(`warn5-${session._id}`, _pendingWarnings, null, session.scheduledAt - 5 * 60 * 1000 - now, () => {
        playNotificationSound();
        new Notification("Study session in 5 minutes", {
          body: `Session ${session.sessionNumber} for ${name} starts in 5 minutes`,
          icon: "/session-notif.svg",
          tag: `warn5-${session._id}`,
        });
      });

      scheduleOnce(`due-${session._id}`, _pendingDue, _notifiedDue, session.scheduledAt - now, () => {
        playNotificationSound();
        new Notification("Study session due now", {
          body: `Session ${session.sessionNumber} for ${name} is ready`,
          icon: "/session-notif.svg",
          tag: `due-${session._id}`,
        });
      });
    }
    return () => cancelFns.forEach(fn => fn());
  }, [upcomingSessions, topics]);

  return null;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getMe);
  const everAuthenticated = useRef(false);
  if (isAuthenticated) everAuthenticated.current = true;

  if (isLoading && !everAuthenticated.current) return <LoadingScreen />;
  if (!isAuthenticated && !isLoading) return <Navigate to="/auth" replace />;
  // Session exists but user doc was deleted — ghost session
  if (isAuthenticated && !isLoading && user === null) return <Navigate to="/auth" replace />;
  return <><SessionNotifier />{children}</>;
}

function LoadingScreen() {
  return (
    <div
      className="flex items-center justify-center min-h-svh"
      style={{ background: "#F5EFE2" }}
    >
      <style>{`@keyframes logoBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}`}</style>
      <div className="flex flex-col items-center gap-5">
        <img
          src="/favicon.svg"
          alt="Engram"
          style={{ width: 56, height: 56, animation: "logoBeat 1.1s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

function StudySessionWrapper() {
  const [searchParams] = useSearchParams();
  const { topicId } = useParams();
  return <StudySessionPage key={`${topicId}-${searchParams.get("sessionId") ?? "free"}-${searchParams.get("all") ?? "0"}`} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/courses" element={<RequireAuth><CoursesPage /></RequireAuth>} />
        <Route path="/library" element={<RequireAuth><LibraryPage /></RequireAuth>} />
        <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
        <Route path="/stats" element={<RequireAuth><StatsPage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="/courses/new" element={<RequireAuth><NewCoursePage /></RequireAuth>} />
        <Route path="/courses/:courseId" element={<RequireAuth><CourseDetailPage /></RequireAuth>} />
        <Route path="/courses/:courseId/topics/:topicId" element={<RequireAuth><TopicDetailPage /></RequireAuth>} />
        <Route path="/courses/:courseId/topics/:topicId/study" element={<RequireAuth><StudySessionWrapper /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
