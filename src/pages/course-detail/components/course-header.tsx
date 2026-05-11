import { useNavigate } from "react-router-dom";

interface CourseHeaderProps {
  course: { name: string; code: string; color: string };
  topicCount: number;
  cardCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CourseHeader({ course, topicCount, cardCount, onEdit, onDelete }: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className="relative px-5 pt-12 pb-6 overflow-hidden"
      style={{ background: course.color, borderBottom: "2.5px solid #1C1917" }}
    >
      <div className="absolute top-8 right-8 pointer-events-none opacity-40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 active:translate-x-px active:translate-y-px"
          style={{ background: "rgba(255,255,255,0.25)", border: "1.5px solid rgba(255,255,255,0.6)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 active:translate-x-px active:translate-y-px"
                style={{ background: "rgba(255,255,255,0.25)", border: "1.5px solid rgba(255,255,255,0.6)" }}
                title="Edit course"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 active:translate-x-px active:translate-y-px"
                style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.5)" }}
                title="Delete course"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <span
        className="text-[10px] font-bold tracking-[2px] uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.85)" }}
      >
        {course.code}
      </span>
      <h1
        className="mt-1 font-black leading-none"
        style={{ fontFamily: "var(--font-serif)", fontSize: 34, letterSpacing: -1, color: "#fff", lineHeight: 0.95 }}
      >
        {course.name}
      </h1>

      <div className="flex gap-6 mt-4">
        {[
          { v: topicCount, l: "TOPICS" },
          { v: cardCount, l: "CARDS" },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-2xl font-black leading-none" style={{ fontFamily: "var(--font-serif)", color: "#fff" }}>
              {s.v}
            </div>
            <div className="text-[9px] font-bold tracking-[1.5px] mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.75)" }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
