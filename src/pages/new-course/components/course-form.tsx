import { useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./color-picker";

function KStar({ size = 18, color = "#F4B400" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

export function CourseForm() {
  const navigate = useNavigate();
  const createCourse = useMutation(api.courses.create);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#E8482C");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Course name is required");
    setLoading(true);
    setError("");
    try {
      const id = await createCourse({ name: name.trim(), color });
      navigate(`/courses/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* live preview card */}
      <div
        className="relative rounded-[14px] p-5 overflow-hidden"
        style={{ background: color, border: "2.5px solid #1C1917", boxShadow: "5px 5px 0 #1C1917" }}
      >
        <div className="absolute top-3 right-4 pointer-events-none opacity-60">
          <KStar size={20} color="#fff" />
        </div>
        <p
          className="text-[10px] font-bold tracking-[1.5px] uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.8)" }}
        >
          PREVIEW
        </p>
        <p
          className="mt-1 font-black text-2xl leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#fff", letterSpacing: -0.5 }}
        >
          {name || "Course name"}
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.75)" }}>
          0 topics · 0 cards · awaiting materials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="name"
          label="Course name"
          placeholder="e.g. Database Systems"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex flex-col gap-2">
          <label
            className="text-[10px] font-bold tracking-[1.5px] uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}
          >
            Color
          </label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {error && (
          <p
            className="text-xs font-bold"
            style={{ fontFamily: "var(--font-mono)", color: "#E8482C" }}
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="accent" className="flex-1" disabled={loading}>
            {loading ? "Creating…" : "Create course →"}
          </Button>
        </div>

        <p
          className="text-center text-sm"
          style={{ fontFamily: "var(--font-accent)", color: "#8A8278" }}
        >
          you can always edit this later ✨
        </p>
      </form>
    </div>
  );
}
