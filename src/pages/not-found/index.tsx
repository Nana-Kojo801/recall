import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100svh",
        background: "#F5EFE2", gap: 24, padding: 24, textAlign: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{
        width: 96, height: 96, borderRadius: 22,
        background: "#F4B400", border: "3px solid #1C1917",
        boxShadow: "6px 6px 0 #1C1917",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: "rotate(-6deg)",
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 900, color: "#1C1917", lineHeight: 1 }}>?</span>
      </div>

      <div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
          letterSpacing: 2, color: "#8A8278", textTransform: "uppercase", marginBottom: 8,
        }}>
          404 · PAGE NOT FOUND
        </div>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 900,
          color: "#1C1917", letterSpacing: -0.5, lineHeight: 1.1,
        }}>
          Lost in the void.
        </div>
        <div style={{ fontFamily: "var(--font-accent)", fontSize: 18, color: "#4A4642", marginTop: 6 }}>
          This page doesn't exist.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "11px 20px", background: "#fff", color: "#1C1917",
            border: "2px solid #1C1917", borderRadius: 10,
            boxShadow: "3px 3px 0 #1C1917",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Go back
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "11px 20px", background: "#1C1917", color: "#fff",
            border: "2px solid #1C1917", borderRadius: 10,
            boxShadow: "3px 3px 0 rgba(28,25,23,0.25)",
            fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}
