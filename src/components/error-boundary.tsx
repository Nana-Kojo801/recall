import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100svh", background: "#F5EFE2", gap: 20, padding: 24, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#E8482C", border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917", display: "grid", placeItems: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: "#8A8278", marginTop: 6 }}>Pull to refresh or tap Reload.</div>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "12px 28px", background: "#1C1917", color: "#fff", border: "2px solid #1C1917", borderRadius: 10, boxShadow: "3px 3px 0 rgba(28,25,23,0.25)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
