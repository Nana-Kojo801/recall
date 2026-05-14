import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import type { Id } from "@/../convex/_generated/dataModel";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

type Card = {
  _id: Id<"flashcards">;
  topicId: Id<"topics">;
  front: string;
  back: string;
  lastRating?: "hard" | "okay" | "easy";
};

type Group = {
  topicId: Id<"topics">;
  topicName: string;
  courseId: Id<"courses">;
  courseName: string;
  courseColor: string;
  cards: Card[];
};

function RatingDot({ rating }: { rating?: "hard" | "okay" | "easy" }) {
  if (!rating) return null;
  const colors = { hard: "#E8482C", okay: "#F4B400", easy: "#2B7A3E" };
  return (
    <div
      style={{ width: 7, height: 7, borderRadius: "50%", background: colors[rating], border: "1px solid #1C1917", flexShrink: 0 }}
      title={rating}
    />
  );
}

function CardRow({ card }: { card: Card }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded((p) => !p)}
      style={{
        background: "#fff", border: "2px solid #1C1917", borderRadius: 10,
        boxShadow: "2px 2px 0 #1C1917", overflow: "hidden", cursor: "pointer",
      }}
    >
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
        <RatingDot rating={card.lastRating} />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#1C1917", lineHeight: 1.4, flex: 1 }}>
          {card.front}
        </p>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 2, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {expanded && (
        <div style={{ padding: "10px 14px", borderTop: "1.5px solid rgba(28,25,23,0.1)", background: "#FBF6EA" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#4A4642", lineHeight: 1.5 }}>{card.back}</p>
        </div>
      )}
    </div>
  );
}

function GroupSection({ group, index }: { group: Group; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: "easeOut" }}
    >
      <button
        onClick={() => navigate(`/courses/${group.courseId}/topics/${group.topicId}`)}
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 3, background: group.courseColor, border: "1px solid #1C1917", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 1.5, fontWeight: 700, color: "#8A8278", textTransform: "uppercase" }}>
          {group.courseName}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "#1C1917" }}>
          {group.topicName}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", background: "#FBF6EA", border: "1px solid rgba(28,25,23,0.15)", borderRadius: 4, padding: "1px 5px" }}>
          {group.cards.length}
        </span>
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {group.cards.map((card) => (
          <CardRow key={card._id} card={card} />
        ))}
      </div>
    </motion.div>
  );
}

export function LibraryPage() {
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<"hard" | "okay" | "easy" | "unrated" | null>(null);

  const cards = useQuery(api.flashcards.listByUser);
  const topics = useQuery(api.topics.listByUser);
  const courses = useQuery(api.courses.list);

  const topicMap = useMemo(() => {
    const m = new Map<string, { name: string; courseId: Id<"courses"> }>();
    topics?.forEach((t) => m.set(t._id, { name: t.name, courseId: t.courseId }));
    return m;
  }, [topics]);

  const courseMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    courses?.forEach((c) => m.set(c._id, { name: c.name, color: c.color }));
    return m;
  }, [courses]);

  const grouped = useMemo<Group[]>(() => {
    if (!cards) return [];
    const q = search.toLowerCase();
    let filtered = q
      ? cards.filter(
          (c) =>
            c.front.toLowerCase().includes(q) ||
            c.back.toLowerCase().includes(q) ||
            (topicMap.get(c.topicId)?.name.toLowerCase().includes(q) ?? false)
        )
      : [...cards];

    if (filterCourse) {
      filtered = filtered.filter((c) => topicMap.get(c.topicId)?.courseId === filterCourse);
    }
    if (filterRating) {
      filtered = filterRating === "unrated"
        ? filtered.filter((c) => !c.lastRating)
        : filtered.filter((c) => c.lastRating === filterRating);
    }

    const map = new Map<string, Group>();
    filtered.forEach((card) => {
      const topic = topicMap.get(card.topicId);
      if (!topic) return;
      const course = courseMap.get(topic.courseId);
      if (!map.has(card.topicId)) {
        map.set(card.topicId, {
          topicId: card.topicId,
          topicName: topic.name,
          courseId: topic.courseId,
          courseName: course?.name ?? "—",
          courseColor: course?.color ?? "#8A8278",
          cards: [],
        });
      }
      map.get(card.topicId)!.cards.push(card as Card);
    });
    return Array.from(map.values());
  }, [cards, search, topicMap, courseMap, filterCourse, filterRating]);

  const isLoading = cards === undefined || topics === undefined || courses === undefined;
  const totalCards = cards?.length ?? 0;

  const searchBar = (
    <div style={{ padding: "12px 20px", position: "sticky", top: 0, background: "#F5EFE2", zIndex: 10, borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "2px solid #1C1917", borderRadius: 10, padding: "8px 14px", boxShadow: "2px 2px 0 #1C1917" }}>
        <SearchIcon />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards or topics…"
          style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "#1C1917" }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#8A8278", padding: 0, lineHeight: 1, fontSize: 14 }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );

  const RATING_COLORS: Record<string, string> = { hard: "#E8482C", okay: "#F4B400", easy: "#2B7A3E", unrated: "#8A8278" };
  const RATING_LABELS: Record<string, string> = { hard: "Hard", okay: "Okay", easy: "Easy", unrated: "Unrated" };

  const filterBar = !isLoading && (courses?.length ?? 0) > 0 && (
    <div style={{ padding: "6px 20px 8px", borderBottom: "1px solid rgba(28,25,23,0.08)", display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Course chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {[null, ...(courses ?? [])].map((c) => {
          const active = filterCourse === (c ? c._id : null);
          return (
            <button
              key={c?._id ?? "all-c"}
              onClick={() => setFilterCourse(c ? c._id : null)}
              style={{ padding: "4px 10px", borderRadius: 6, flexShrink: 0, border: "1.5px solid #1C1917", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, background: active ? (c?.color ?? "#1C1917") : "#fff", color: active ? "#fff" : "#1C1917", transition: "all 0.1s" }}
            >
              {c ? c.name : "All courses"}
            </button>
          );
        })}
      </div>
      {/* Rating chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {([null, "hard", "okay", "easy", "unrated"] as const).map((r) => {
          const active = filterRating === r;
          const bg = active ? (r ? RATING_COLORS[r] : "#1C1917") : "#fff";
          const fg = active ? (r === "okay" ? "#1C1917" : "#fff") : "#1C1917";
          return (
            <button
              key={r ?? "all-r"}
              onClick={() => setFilterRating(r)}
              style={{ padding: "4px 10px", borderRadius: 6, flexShrink: 0, border: "1.5px solid #1C1917", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, background: bg, color: fg, transition: "all 0.1s" }}
            >
              {r ? RATING_LABELS[r] : "All ratings"}
            </button>
          );
        })}
      </div>
    </div>
  );

  const cardList = (
    <>
      {searchBar}
      {filterBar}
      {isLoading ? (
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse" style={{ height: 80, borderRadius: 10, background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.08)" }} />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
          <p style={{ fontFamily: "var(--font-accent)", fontSize: 20, color: "#8A8278" }}>
            {search ? "No cards found" : "No flashcards yet"}
          </p>
          {!search && (
            <p style={{ fontSize: 13, color: "#8A8278", marginTop: 4 }}>
              Generate cards from a topic to see them here.
            </p>
          )}
        </div>
      ) : (
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
          {grouped.map((group, i) => (
            <GroupSection key={group.topicId} group={group} index={i} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <header className="px-5 pt-12 pb-4">
          <p className="text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>
            YOUR DECK
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.8, lineHeight: 1 }}>
                Library
              </h1>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F4B400">
                <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
              </svg>
            </div>
            {!isLoading && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#8A8278" }}>
                {totalCards} cards
              </span>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pb-24">{cardList}</main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase" }}>
                YOUR DECK
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1, marginTop: 4 }}>
                Library
              </div>
            </div>
            {!isLoading && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#8A8278" }}>
                {totalCards} CARDS TOTAL
              </span>
            )}
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cardList}
          </div>
        </main>
      </div>
    </>
  );
}
