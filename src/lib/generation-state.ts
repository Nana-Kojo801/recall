import { playNotificationSound } from "./notification-sound";

type Status = "idle" | "generating" | "done" | "error";

interface Store {
  status: Status;
  topicId: string | null;
  cardCount: number;
  errorMsg: string;
  cancelled: boolean;
}

const s: Store = {
  status: "idle",
  topicId: null,
  cardCount: 0,
  errorMsg: "",
  cancelled: false,
};

// Module-level ref prevents Promise from being GC'd while in-flight
let _promise: Promise<void> | null = null;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(fn => fn());

export const generationState = {
  get status() { return s.status; },
  get topicId() { return s.topicId; },
  get cardCount() { return s.cardCount; },
  get errorMsg() { return s.errorMsg; },

  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },

  start(topicId: string) {
    s.status = "generating";
    s.topicId = topicId;
    s.cancelled = false;
    s.errorMsg = "";
    notify();
  },

  keepAlive(p: Promise<void>) {
    _promise = p;
    p.finally(() => { if (_promise === p) _promise = null; });
  },

  done(cardCount: number, topicId: string) {
    if (s.topicId !== topicId) return;
    if (s.cancelled) { this.cancel(); return; }
    s.status = "done";
    s.cardCount = cardCount;
    notify();
    playNotificationSound();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Flashcards ready!", {
        body: `${cardCount} flashcard${cardCount !== 1 ? "s" : ""} generated`,
        icon: "/icons/icon-192x192.png",
      });
    }
  },

  fail(errorMsg: string, topicId: string) {
    if (s.topicId !== topicId) return;
    if (s.cancelled) { this.cancel(); return; }
    s.status = "error";
    s.errorMsg = errorMsg;
    notify();
  },

  cancel() {
    s.cancelled = true;
    s.status = "idle";
    s.topicId = null;
    s.errorMsg = "";
    notify();
  },

  reset() {
    s.status = "idle";
    s.topicId = null;
    s.cardCount = 0;
    s.errorMsg = "";
    s.cancelled = false;
    notify();
  },
};
