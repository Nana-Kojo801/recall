import { useAction } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/../convex/_generated/api";

export function GoogleOAuthCallbackPage() {
  const navigate = useNavigate();
  const exchangeCode = useAction(api.googleCalendar.exchangeCode);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      setErrMsg(error ?? "No authorization code received");
      setStatus("error");
      return;
    }

    const redirectUri = `${window.location.origin}/oauth/google/callback`;
    exchangeCode({ code, redirectUri })
      .then(() => {
        setStatus("done");
        setTimeout(() => navigate("/settings"), 1500);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setErrMsg(msg);
        setStatus("error");
      });
  }, [exchangeCode, navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "#F5EFE2", gap: 16 }}>
      <div style={{ width: 56, height: 56, background: "#E8482C", border: "2.5px solid #1C1917", borderRadius: 12, display: "grid", placeItems: "center", boxShadow: "4px 4px 0 #1C1917" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 22, color: "#fff" }}>R</span>
      </div>
      {status === "loading" && (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#1C1917" }}>
          Connecting Google Calendar…
        </p>
      )}
      {status === "done" && (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#2B7A3E" }}>
          Connected! Redirecting…
        </p>
      )}
      {status === "error" && (
        <>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#E8482C" }}>
            Connection failed
          </p>
          {errMsg && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278", maxWidth: 360, textAlign: "center" }}>
              {errMsg}
            </p>
          )}
          <button
            onClick={() => navigate("/settings")}
            style={{ padding: "10px 20px", background: "#1C1917", color: "#fff", border: "none", borderRadius: 8, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Back to Settings
          </button>
        </>
      )}
    </div>
  );
}
