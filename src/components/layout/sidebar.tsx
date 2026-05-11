import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useUser } from "@clerk/react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { id: "today", label: "Today", icon: "✦", path: "/" },
  { id: "courses", label: "Courses", icon: "▤", path: "/courses" },
  { id: "calendar", label: "Calendar", icon: "▦", path: "/calendar" },
  { id: "library", label: "Library", icon: "❐", path: "/library" },
  { id: "stats", label: "Stats", icon: "△", path: "/stats" },
  { id: "settings", label: "Settings", icon: "⚙", path: "/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useUser();
  const courses = useQuery(api.courses.list);
  const topics = useQuery(api.topics.listByUser);

  const now = Date.now();
  const dueCount = topics?.filter((t) => t.nextReview && t.nextReview <= now).length ?? 0;

  const active =
    pathname === "/" ? "today"
    : pathname.startsWith("/calendar") ? "calendar"
    : pathname.startsWith("/library") ? "library"
    : pathname.startsWith("/stats") ? "stats"
    : pathname.startsWith("/settings") ? "settings"
    : pathname.startsWith("/courses") ? "courses"
    : "today";

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: "#FBF6EA",
      borderRight: "2px solid #1C1917",
      display: "flex", flexDirection: "column",
      padding: "18px 14px",
      height: "100%",
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 6px 18px" }}>
        <div style={{
          width: 30, height: 30,
          background: "#E8482C", border: "2px solid #1C1917",
          display: "grid", placeItems: "center",
          color: "#fff", fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 14,
        }}>R</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>
          Recall
        </div>
      </div>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((n) => {
          const isActive = active === n.id || (n.id === "courses" && active === "courses");
          return (
            <div
              key={n.id}
              onClick={() => navigate(n.path)}
              style={{
                padding: "8px 10px", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 10,
                background: isActive ? "#1C1917" : "transparent",
                color: isActive ? "#F5EFE2" : "#1C1917",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span style={{ width: 16, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {n.icon}
              </span>
              {n.label}
              {n.id === "courses" && courses && courses.length > 0 && (
                <span style={{
                  marginLeft: "auto", padding: "1px 6px",
                  background: "#E8482C", color: "#fff",
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  borderRadius: 4,
                  border: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : "#1C1917"}`,
                }}>
                  {courses.length}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Course color dots */}
      {courses && courses.length > 0 && (
        <>
          <div style={{
            marginTop: 18, padding: "0 6px",
            fontFamily: "var(--font-mono)", fontSize: 10, color: "#8A8278", letterSpacing: 1,
          }}>
            COURSES
          </div>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
            {courses.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/courses/${c._id}`)}
                style={{
                  padding: "6px 10px", display: "flex", alignItems: "center", gap: 10,
                  fontSize: 12.5, color: "#4A4642", borderRadius: 6, cursor: "pointer",
                }}
              >
                <div style={{
                  width: 12, height: 12, background: c.color,
                  border: "1.5px solid #1C1917", borderRadius: 3, flexShrink: 0,
                }} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Today card */}
      {dueCount > 0 && (
        <div style={{
          padding: 12, background: "#F4B400",
          border: "2px solid #1C1917", borderRadius: 10,
          boxShadow: "3px 3px 0 #1C1917",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 8, right: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1C1917">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 1, fontWeight: 700 }}>
            TODAY · DUE
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: -1, marginTop: 2 }}>
            {dueCount}
          </div>
          <div style={{ fontSize: 11, color: "#1C1917", marginTop: -2 }}>
            {dueCount === 1 ? "topic" : "topics"} due
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%", marginTop: 8, padding: "8px",
              background: "#1C1917", color: "#fff",
              border: "none", borderRadius: 6,
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}
          >
            Start session →
          </button>
        </div>
      )}

      {/* User profile */}
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "0 6px" }}>
        {user?.imageUrl ? (
          <img
            src={user.imageUrl} alt=""
            style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #1C1917" }}
          />
        ) : (
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "#C93FA9", border: "1.5px solid #1C1917",
            display: "grid", placeItems: "center",
            color: "#fff", fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: 12,
          }}>
            {initials}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.fullName ?? "You"}
          </div>
          <div style={{ fontSize: 10, color: "#8A8278", fontFamily: "var(--font-mono)" }}>Recall</div>
        </div>
      </div>
    </div>
  );
}
