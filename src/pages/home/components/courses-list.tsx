import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/../convex/_generated/api";
import { CourseCard } from "./course-card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusIcon } from "@/components/icons";

export function CoursesList() {
  const navigate = useNavigate();
  const courses = useQuery(api.courses.list);
  // Debounce empty state — Convex may serve stale [] from cache before real data arrives.
  // Only show empty state after courses has been [] for 400ms without updating.
  const [stableEmpty, setStableEmpty] = useState(false);

  useEffect(() => {
    if (courses !== undefined && courses.length === 0) {
      const t = setTimeout(() => setStableEmpty(true), 400);
      return () => clearTimeout(t);
    }
    setStableEmpty(false);
  }, [courses]);

  const isLoading = courses === undefined || (courses !== undefined && courses.length === 0 && !stableEmpty);
  const isEmpty = courses !== undefined && courses.length === 0 && stableEmpty;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 pt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-card animate-pulse"
            style={{ background: "rgba(28,25,23,0.06)", border: "2px solid rgba(28,25,23,0.1)" }}
          />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div
        className="flex flex-col items-center gap-5 px-5 pt-12 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* empty state box */}
        <div
          className="relative w-36 h-36 rounded-3xl flex items-center justify-center"
          style={{
            background: "#F4B400",
            border: "3px solid #1C1917",
            boxShadow: "8px 8px 0 #1C1917",
            transform: "rotate(-4deg)",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          <span
            className="absolute -top-3 -right-4 text-[10px] font-bold px-2 py-1 rounded"
            style={{
              background: "#fff", border: "2px solid #1C1917",
              fontFamily: "var(--font-mono)", boxShadow: "2px 2px 0 #1C1917",
            }}
          >
            EMPTY
          </span>
        </div>

        <div className="text-center">
          <h2
            className="text-2xl font-black"
            style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.5 }}
          >
            No courses yet.
          </h2>
          <p
            className="text-base mt-1"
            style={{ fontFamily: "var(--font-accent)", color: "#E8482C", fontSize: 18 }}
          >
            Let's fix that ✨
          </p>
          <p className="text-sm mt-2 max-w-65" style={{ color: "#4A4642" }}>
            Create a course and drop in your syllabus or lecture slides.
          </p>
        </div>

        <button
          onClick={() => navigate("/courses/new")}
          className="flex items-center gap-2 px-6 py-3 rounded-button font-bold text-sm transition-all duration-150 active:translate-x-px active:translate-y-px"
          style={{
            background: "#E8482C", color: "#fff",
            border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917",
          }}
        >
          <PlusIcon size={16} />
          Create your first course
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 pt-4">
      <div
        className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1"
        style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}
      >
        {courses!.length} COURSE{courses!.length !== 1 ? "S" : ""}
      </div>
      {courses!.map((course, i) => (
        <CourseCard key={course._id} course={course} index={i} />
      ))}
    </div>
  );
}
