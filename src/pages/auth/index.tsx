import { SignIn, useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";

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

// Clerk appearance — hides everything except Google social button
// Google button styled vermilion to match design primary CTA
const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: T.accent,
    colorText: "#fff",
    colorBackground: "transparent",
    borderRadius: "10px",
    fontFamily: T.font,
    fontSize: "14px",
  },
  elements: {
    card: { background: "transparent", border: "none", boxShadow: "none", padding: 0, margin: 0, width: "100%" },
    cardBox: { background: "transparent", border: "none", boxShadow: "none", width: "100%" },
    header: { display: "none" },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    form: { display: "none" },
    dividerRow: { display: "none" },
    dividerLine: { display: "none" },
    dividerText: { display: "none" },
    footer: { display: "none" },
    footerAction: { display: "none" },
    footerPages: { display: "none" },
    main: { padding: 0, gap: 0 },
    socialButtons: { width: "100%" },
    socialButtonsBlockButton: {
      background: T.accent,
      border: `2px solid ${T.ink}`,
      boxShadow: `3px 3px 0 ${T.ink}`,
      borderRadius: "10px",
      color: "#fff",
      fontFamily: T.font,
      fontWeight: "700",
      fontSize: "14px",
      height: "52px",
      width: "100%",
      padding: "0 20px",
      transition: "transform 0.1s, box-shadow 0.1s",
    },
    socialButtonsBlockButtonText: {
      color: "#fff",
      fontFamily: T.font,
      fontWeight: "700",
      fontSize: "14px",
    },
    socialButtonsBlockButtonArrow: { display: "none" },
    socialButtonsProviderIcon: { filter: "brightness(0) invert(1)" },
    rootBox: { width: "100%" },
  },
};

// Desktop right panel — exact from KanjiDesktopOnboarding design
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
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <Navigate to="/" replace />;

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

      {/* Clerk SignIn — Google button only, vermilion styled */}
      <div style={{ marginTop: 28, maxWidth: 400 }}>
        <style>{`[class*="socialButtonsBlockButton"]:hover{background:#C93D22!important;opacity:1!important;box-shadow:2px 2px 0 #1C1917!important;}`}</style>
        <SignIn
          routing="hash"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          appearance={clerkAppearance}
        />
      </div>

      <div style={{ marginTop: 14, fontFamily: T.fontMono, fontSize: 11, color: T.inkMute, letterSpacing: 1 }}>
        FREE · NO CARD · STUDENT VERIFIED
      </div>
    </>
  );

  return (
    // height: 100svh + overflow: hidden = no page scroll on desktop
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

      {/* MOBILE layout — scrollable */}
      {/* NOTE: no display in inline style — className="flex ... md:hidden" controls visibility */}
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
            RECALL
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
            <div style={{
              width: 36, height: 36,
              background: T.accent,
              border: `2px solid ${T.ink}`,
              display: "grid", placeItems: "center",
              color: "#fff", fontFamily: T.fontSerif, fontWeight: 900, fontSize: 16,
              boxShadow: `2px 2px 0 ${T.ink}`,
            }}>
              R
            </div>
            <div style={{ fontFamily: T.fontSerif, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
              Recall
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
