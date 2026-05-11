import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CourseForm } from "./components/course-form";
import { Sidebar } from "@/components/layout/sidebar";

export function NewCoursePage() {
  const navigate = useNavigate();

  const formContent = <CourseForm />;

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <header className="flex items-center gap-3 px-5 pt-12 pb-5" style={{ borderBottom: "2px solid rgba(28,25,23,0.12)" }}>
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 active:translate-x-px active:translate-y-px"
            style={{ background: "#fff", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <div className="text-[10px] font-bold tracking-[2px] uppercase px-2 py-0.5 rounded inline-block"
              style={{ fontFamily: "var(--font-mono)", background: "#1C1917", color: "#F5EFE2" }}>
              NEW COURSE
            </div>
            <h1 className="text-2xl font-black mt-0.5" style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.5 }}>
              Name your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">new course.</span>
                <span className="absolute -inset-x-1 bottom-1 z-0" style={{ height: 10, background: "#F4B400", transform: "rotate(-1deg)" }} />
              </span>
            </h1>
          </div>
        </header>
        <main className="flex-1 px-5 pt-6 pb-10">{formContent}</main>
      </div>

      {/* Desktop — sidebar blurred behind + right sheet */}
      <div className="hidden md:flex h-screen overflow-hidden" style={{ position: "relative" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Dimmed content behind sheet */}
        <div style={{ flex: 1, minWidth: 0, background: "#F5EFE2", opacity: 0.45, filter: "blur(1.5px)", overflow: "hidden" }}>
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase" }}>TODAY</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1, marginTop: 4 }}>
              Home
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <motion.div
          style={{ position: "absolute", inset: 0, left: 220, background: "rgba(28,25,23,0.38)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Sheet from right */}
        <AnimatePresence>
        <motion.div
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 540,
            background: "#F5EFE2", borderLeft: "3px solid #1C1917",
            boxShadow: "-20px 0 50px rgba(28,25,23,0.28)",
            display: "flex", flexDirection: "column",
            zIndex: 10,
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* Drag handle */}
          <div style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", width: 4, height: 64, borderRadius: 2, background: "rgba(28,25,23,0.2)" }} />

          {/* Sheet header */}
          <div style={{
            padding: "16px 22px", borderBottom: "2px solid #1C1917",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FBF6EA", flexShrink: 0,
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: 2, background: "#1C1917", color: "#F5EFE2", padding: "4px 10px", borderRadius: 4, fontWeight: 700 }}>
              NEW COURSE
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: "2px solid #1C1917",
                background: "#fff", cursor: "pointer", boxShadow: "2px 2px 0 #1C1917",
                display: "grid", placeItems: "center",
              }}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Sheet body */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 800, lineHeight: 1.0, letterSpacing: -0.8, color: "#1C1917", marginBottom: 20 }}>
              Name your{" "}
              <span style={{ display: "inline-block", position: "relative" }}>
                new course.
                <span style={{ position: "absolute", left: -4, right: -4, bottom: 4, height: 10, background: "#F4B400", zIndex: -1, transform: "rotate(-1deg)" }} />
              </span>
            </div>
            {formContent}
          </div>
        </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
