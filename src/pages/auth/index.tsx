import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const T = {
  bg: "#F5EFE2",
  bgSoft: "#FBF6EA",
  ink: "#1C1917",
  inkSoft: "#4A4642",
  inkMute: "#8A8278",
  accent: "#E8482C",
  accent2: "#F4B400",
  accent3: "#2B7A3E",
  fontSerif: '"Fraunces", serif',
  fontMono: '"JetBrains Mono", monospace',
  font: '"Archivo", system-ui, sans-serif',
};

function KStar({ c = T.ink, s = 14 }: { c?: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

function KSqui({ c = T.ink, w = 40 }: { c?: string; w?: number }) {
  return (
    <svg width={w} height={10} viewBox="0 0 40 10" fill="none">
      <path d="M1 5 Q 6 1 11 5 T 21 5 T 31 5 T 39 5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#fff" opacity="0.9"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#fff" opacity="0.9"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" opacity="0.9"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff" opacity="0.9"/>
    </svg>
  );
}

// Desktop right panel
function DesktopCardCluster() {
  return (
    <div style={{ flex: 1, position: "relative", background: T.bgSoft, overflow: "hidden" }}>
      {/* Card 1: vermilion, top-left, -8deg */}
      <div style={{ position: "absolute", top: 80, left: 60, transform: "rotate(-8deg)" }}>
        <div style={{
          width: 220, height: 270,
          background: T.accent, color: "#fff",
          border: `3px solid ${T.ink}`, boxShadow: `8px 8px 0 ${T.ink}`,
          borderRadius: 18, padding: 18,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: 1 }}>Q · 04</div>
          <div style={{ fontFamily: T.fontSerif, fontSize: 28, fontWeight: 700, lineHeight: 1.05 }}>
            Define 3rd Normal Form.
          </div>
          <KSqui c="#fff" w={48} />
        </div>
      </div>

      {/* Card 2: mustard, top-right, +6deg */}
      <div style={{ position: "absolute", top: 60, right: 60, transform: "rotate(6deg)" }}>
        <div style={{
          width: 220, height: 270,
          background: T.accent2,
          border: `3px solid ${T.ink}`, boxShadow: `8px 8px 0 ${T.ink}`,
          borderRadius: 18, padding: 18,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: 1 }}>Q · 07</div>
          <div style={{ fontFamily: T.fontSerif, fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: T.ink }}>
            What does ACID stand for?
          </div>
          <KStar c={T.ink} s={20} />
        </div>
      </div>

      {/* Card 3: green, bottom-center, -2deg */}
      <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%) rotate(-2deg)" }}>
        <div style={{
          width: 280, height: 130,
          background: T.accent3, color: "#fff",
          border: `3px solid ${T.ink}`, boxShadow: `8px 8px 0 ${T.ink}`,
          borderRadius: 18, padding: 16,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 22, fontWeight: 800 }}>✦ AI generated</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>from your slides, in seconds</div>
        </div>
      </div>
    </div>
  );
}

// Mobile card cluster
function MobileCardCluster() {
  return (
    <div style={{ position: "relative", height: 240, marginBottom: 28 }}>
      <div style={{ position: "absolute", left: 8, top: 30, transform: "rotate(-8deg)" }}>
        <div style={{
          width: 150, height: 180, borderRadius: 16,
          background: T.accent, border: `3px solid ${T.ink}`, boxShadow: `6px 6px 0 ${T.ink}`,
          padding: 16, color: "#fff", fontFamily: T.fontSerif, fontSize: 20, fontWeight: 600, lineHeight: 1.1,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1 }}>Q · 04</div>
          <div>Define<br />3NF.</div>
          <KSqui c="#fff" w={40} />
        </div>
      </div>

      <div style={{ position: "absolute", right: 10, top: 10, transform: "rotate(6deg)" }}>
        <div style={{
          width: 150, height: 180, borderRadius: 16,
          background: T.accent2, border: `3px solid ${T.ink}`, boxShadow: `6px 6px 0 ${T.ink}`,
          padding: 16, color: T.ink, fontFamily: T.fontSerif, fontSize: 19, fontWeight: 600, lineHeight: 1.1,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: 1 }}>Q · 07</div>
          <div>What does ACID stand for?</div>
          <KStar c={T.ink} s={16} />
        </div>
      </div>

      <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%) rotate(-2deg)" }}>
        <div style={{
          width: 160, height: 100, borderRadius: 14,
          background: T.accent3, border: `3px solid ${T.ink}`, boxShadow: `6px 6px 0 ${T.ink}`,
          padding: 12, color: "#fff",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6,
        }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 15, fontWeight: 600 }}>✦ AI generated</div>
        </div>
      </div>
    </div>
  );
}

export function AuthPage() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signIn("google");
    } catch {
      setLoading(false);
    }
  }

  const heroContent = (
    <>
      <div style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: 2, color: T.inkMute, fontWeight: 700, marginBottom: 12 }}>
        v1 · SPACED REPETITION
      </div>

      <h1 style={{
        fontFamily: T.fontSerif,
        fontSize: "clamp(38px, 5vw, 64px)",
        fontWeight: 900, lineHeight: 0.95, letterSpacing: -2,
        color: T.ink, margin: 0,
      }}>
        Cram less.
        <br />
        <span style={{ display: "inline-block", position: "relative" }}>
          <span style={{ position: "relative", zIndex: 1 }}>Know more.</span>
          <span style={{
            position: "absolute", left: -6, right: -6, bottom: 8, height: 14,
            background: T.accent2, zIndex: 0, transform: "rotate(-1deg)",
          }} />
        </span>
      </h1>

      <p style={{ fontSize: 16, lineHeight: 1.5, color: T.inkSoft, marginTop: 18, maxWidth: 440 }}>
        Drop your lecture slides. We'll turn them into flashcards, schedule reviews into your
        calendar, and keep them coming back at the right interval.
      </p>

      <div style={{ marginTop: 28, maxWidth: 400 }}>
        <button
          onClick={() => void handleGoogleSignIn()}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", height: 52, padding: "0 20px",
            background: loading ? "#C93D22" : T.accent,
            border: `2px solid ${T.ink}`,
            boxShadow: loading ? `1px 1px 0 ${T.ink}` : `3px 3px 0 ${T.ink}`,
            borderRadius: 10,
            color: "#fff",
            fontFamily: T.font,
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "transform 0.1s, box-shadow 0.1s",
            transform: loading ? "translate(2px, 2px)" : undefined,
            opacity: loading ? 0.85 : 1,
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = "#C93D22";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `2px 2px 0 ${T.ink}`;
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = T.accent;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `3px 3px 0 ${T.ink}`;
            }
          }}
        >
          <GoogleIcon />
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
      </div>

      <div style={{ marginTop: 14, fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, letterSpacing: 1 }}>
        FREE · NO CARD · STUDENT VERIFIED
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 16, fontFamily: T.fontMono, fontSize: 10, color: T.inkMute }}>
        <Link to="/terms" style={{ color: T.inkMute, textDecoration: "none" }}>Terms of Service</Link>
        <Link to="/privacy" style={{ color: T.inkMute, textDecoration: "none" }}>Privacy Policy</Link>
      </div>
    </>
  );

  return (
    <div style={{
      width: "100%",
      height: "100svh",
      display: "flex",
      fontFamily: T.font,
      color: T.ink,
      background: T.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* dot grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="authdot" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.8" fill="#1C1917" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#authdot)" />
        </svg>
      </div>

      {/* MOBILE layout */}
      <div
        className="flex flex-col md:hidden"
        style={{
          position: "relative", zIndex: 1,
          width: "100%", height: "100%",
          overflowY: "auto",
          padding: "20px 24px 40px",
        }}
      >
        {/* logo bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div style={{
            background: T.ink, color: T.bg,
            padding: "4px 10px", borderRadius: 4,
            fontFamily: T.fontMono, fontSize: 11, letterSpacing: 2, fontWeight: 700,
          }}>
            ENGRAM
          </div>
        </div>

        {/* decorations */}
        <div style={{ position: "absolute", top: 60, right: 26, zIndex: 2, pointerEvents: "none" }}>
          <KStar c={T.accent} s={26} />
        </div>
        <div style={{ position: "absolute", top: 120, left: 24, transform: "rotate(-14deg)", zIndex: 2, pointerEvents: "none" }}>
          <KSqui c={T.accent3} w={48} />
        </div>

        <MobileCardCluster />
        {heroContent}
      </div>

      {/* DESKTOP layout — no scroll, two-column */}
      <div
        className="hidden md:flex"
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        {/* Left panel */}
        <div style={{
          flex: 1.2,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRight: `2px solid ${T.ink}`,
          overflow: "hidden",
        }}>
          {/* decorations */}
          <div style={{ position: "absolute", top: 60, right: 60, pointerEvents: "none" }}>
            <KStar c={T.accent} s={28} />
          </div>
          <div style={{ position: "absolute", top: 130, right: 110, transform: "rotate(-12deg)", pointerEvents: "none" }}>
            <KSqui c={T.accent3} w={56} />
          </div>

          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img src="/favicon.svg" alt="Engram" style={{ width: 36, height: 36 }} />
            <div style={{ fontFamily: T.fontSerif, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
              Engram
            </div>
          </div>

          {/* hero */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 500 }}>
            {heroContent}
          </div>
        </div>

        {/* Right panel */}
        <DesktopCardCluster />
      </div>
    </div>
  );
}
