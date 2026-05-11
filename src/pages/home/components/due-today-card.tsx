import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useNavigate } from "react-router-dom";

function KStar({ size = 20, color = "#1C1917" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

export function DueTodayCard() {
  const navigate = useNavigate();
  const topics = useQuery(api.topics.listByUser);
  const now = Date.now();

  const dueTopics = topics?.filter((t) => t.nextReview && t.nextReview <= now) ?? [];
  const dueCount = dueTopics.length;

  if (dueCount === 0) return null;

  const firstDue = dueTopics[0];

  return (
    <div
      className="relative rounded-[18px] p-5 overflow-hidden"
      style={{
        background: "#F4B400",
        border: "2.5px solid #1C1917",
        boxShadow: "5px 5px 0 #1C1917",
      }}
    >
      <div className="absolute top-4 right-5 pointer-events-none">
        <KStar size={22} color="#1C1917" />
      </div>

      <p
        className="text-[10px] font-bold tracking-[2px] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "#1C1917" }}
      >
        DUE TODAY
      </p>

      <div className="flex items-baseline gap-3 mt-1">
        <span
          className="leading-none"
          style={{
            fontFamily: "var(--font-serif)", fontSize: 72, fontWeight: 900,
            letterSpacing: -3, color: "#1C1917", lineHeight: 0.9,
          }}
        >
          {dueCount}
        </span>
        <div>
          <p
            className="font-bold text-base"
            style={{ fontFamily: "var(--font-serif)", color: "#1C1917" }}
          >
            {dueCount === 1 ? "topic" : "topics"} · ~{Math.ceil(dueCount * 2)} min
          </p>
          <p className="text-xs font-semibold" style={{ color: "#4A4642" }}>
            review due
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {firstDue && (
          <button
            onClick={() =>
              navigate(`/courses/${firstDue.courseId}/topics/${firstDue._id}/study`)
            }
            className="flex-1 py-3 rounded-[10px] font-bold text-sm transition-all duration-150 active:translate-x-px active:translate-y-px"
            style={{
              background: "#1C1917", color: "#F5EFE2",
              border: "none", boxShadow: "2px 2px 0 rgba(0,0,0,0.25)",
            }}
          >
            ▶ Start session
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-3 rounded-[10px] font-bold text-sm transition-all duration-150 active:translate-x-px active:translate-y-px"
          style={{
            background: "#fff", color: "#1C1917",
            border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917",
          }}
        >
          ⏰ Schedule
        </button>
      </div>
    </div>
  );
}
