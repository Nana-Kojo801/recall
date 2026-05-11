import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

interface TopicRowProps {
  topic: {
    _id: Id<"topics">;
    courseId: Id<"courses">;
    name: string;
    lastStudied?: number;
    nextReview?: number;
  };
  courseColor: string;
  index: number;
}

function getMastery(cards: { lastRating?: string }[]): number {
  if (!cards.length) return 0;
  const total = cards.reduce((sum, c) => {
    if (c.lastRating === "easy") return sum + 100;
    if (c.lastRating === "okay") return sum + 60;
    if (c.lastRating === "hard") return sum + 20;
    return sum;
  }, 0);
  return Math.round(total / cards.length);
}

export function TopicRow({ topic, courseColor, index }: TopicRowProps) {
  const navigate = useNavigate();
  const cards = useQuery(api.flashcards.listByTopic, { topicId: topic._id });
  const cardCount = cards?.length ?? 0;
  const mastery = getMastery(cards ?? []);
  const isDue = topic.nextReview && topic.nextReview <= Date.now();

  const lastStudiedLabel = topic.lastStudied
    ? new Date(topic.lastStudied).toLocaleDateString("en", { month: "short", day: "numeric" })
    : "Never";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/courses/${topic.courseId}/topics/${topic._id}`)}
      className="flex items-center gap-4 p-4 rounded-[14px] bg-white cursor-pointer transition-all duration-100 active:translate-x-px active:translate-y-px"
      style={{ border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917" }}
    >
      {/* numbered badge */}
      <div
        className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 font-black text-base"
        style={{
          background: courseColor, border: "1.5px solid #1C1917",
          color: "#fff", fontFamily: "var(--font-serif)",
        }}
      >
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-bold text-sm truncate"
            style={{ fontFamily: "var(--font-serif)", color: "#1C1917" }}
          >
            {topic.name}
          </span>
          {isDue && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{
                fontFamily: "var(--font-mono)", background: "#E8482C",
                color: "#fff", border: "1px solid #1C1917",
              }}
            >
              DUE
            </span>
          )}
        </div>

        {/* mastery bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-1"
          style={{ background: "#F5EFE2", border: "1px solid rgba(28,25,23,0.15)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${mastery}%`,
              background: mastery > 70 ? "#2B7A3E" : mastery > 40 ? "#F4B400" : "#E8482C",
            }}
          />
        </div>

        <p
          className="text-[10px] font-semibold"
          style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}
        >
          {cardCount} cards · Last studied {lastStudiedLabel} · {mastery}%
        </p>
      </div>

      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </motion.div>
  );
}
