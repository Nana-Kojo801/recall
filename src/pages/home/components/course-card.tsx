import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

interface CourseCardProps {
  course: {
    _id: Id<"courses">;
    name: string;
    code: string;
    color: string;
  };
  index: number;
}

export function CourseCard({ course, index }: CourseCardProps) {
  const navigate = useNavigate();
  const topics = useQuery(api.topics.listByCourse, { courseId: course._id });

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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      onClick={() => navigate(`/courses/${course._id}`)}
      className="cursor-pointer active:translate-x-px active:translate-y-px transition-transform duration-100"
    >
      <div
        className="bg-white rounded-[14px] overflow-hidden"
        style={{ border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917" }}
      >
        {/* color band */}
        <div
          className="h-12 relative flex items-end px-4 pb-1"
          style={{ background: course.color, borderBottom: "2px solid #1C1917" }}
        >
          <span
            className="absolute top-2.5 right-3 text-[10px] font-bold tracking-[1px]"
            style={{
              fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.9)",
            }}
          >
            {course.code}
          </span>
        </div>

        <div className="px-4 py-3">
          <h3
            className="font-bold text-[15px] leading-tight truncate"
            style={{ fontFamily: "var(--font-serif)", color: "#1C1917" }}
          >
            {course.name}
          </h3>

          {/* mastery bar */}
          <div
            className="mt-2.5 h-1.5 rounded-full overflow-hidden"
            style={{ background: "#F5EFE2", border: "1px solid rgba(28,25,23,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${mastery}%`, background: "#2B7A3E" }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold" style={{ color: "#8A8278" }}>
              {topicCount} {topicCount === 1 ? "topic" : "topics"}
            </span>
            {dueCount > 0 && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded"
                style={{
                  fontFamily: "var(--font-mono)", background: "#E8482C",
                  color: "#fff", border: "1px solid #1C1917",
                }}
              >
                {dueCount} DUE
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
