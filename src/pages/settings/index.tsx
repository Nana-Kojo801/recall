import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

type ConvexUser = {
  name?: string;
  email?: string;
  imageUrl?: string;
  googleAccessToken?: string;
} | null | undefined;

function SettingsContent({
  signOut,
  user,
  onDeleteAccount,
}: {
  signOut: () => void;
  user: ConvexUser;
  onDeleteAccount: () => void;
}) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const calendarConnected = !!(user?.googleAccessToken);
  const googleEmail = user?.email;

  type Row =
    | { l: string; s?: string; chev: true; onPress?: () => void }
    | { l: string; danger: true; onPress?: () => void }
    | { l: string; s?: string; calendarRow: true };

  const GROUPS: Array<{ h: string; rows: Row[] }> = [
    {
      h: "Calendar & sync",
      rows: [
        { l: "Google Calendar", s: calendarConnected ? (googleEmail ?? "Connected") : "Not connected", calendarRow: true },
      ],
    },
    {
      h: "Account",
      rows: [
        { l: "Delete account", danger: true, onPress: onDeleteAccount },
        { l: "Sign out", danger: true },
      ],
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* Profile card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: 16, borderRadius: 14,
        background: "#C93FA9", border: "2.5px solid #1C1917", boxShadow: "4px 4px 0 #1C1917",
        marginBottom: 24,
      }}>
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt={user.name ?? ""} style={{ width: 48, height: 48, borderRadius: 10, border: "2px solid #1C1917" }} />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            background: "#fff", border: "2px solid #1C1917",
            fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 18, color: "#C93FA9",
          }}>
            {initials}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 18, color: "#fff", lineHeight: 1.1, margin: 0 }}>
            {user?.name ?? "You"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            {user?.email}
          </p>
        </div>
      </div>

      {GROUPS.map((g) => (
        <div key={g.h} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase", marginBottom: 8, paddingLeft: 4 }}>
            {g.h}
          </div>
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "2px solid #1C1917", boxShadow: "3px 3px 0 #1C1917" }}>
            {g.rows.map((r, ri) => {
              const isDanger = "danger" in r;
              const isCalendar = "calendarRow" in r;
              const hasChev = "chev" in r && r.chev;
              const onPress = "onPress" in r ? r.onPress : undefined;
              return (
                <div
                  key={r.l}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px",
                    borderTop: ri === 0 ? "none" : "1.5px solid rgba(28,25,23,0.1)",
                    cursor: (isDanger || onPress) ? "pointer" : undefined,
                  }}
                  onClick={
                    isDanger && r.l === "Sign out" ? () => signOut()
                    : isDanger && onPress ? () => onPress()
                    : onPress ? () => onPress()
                    : undefined
                  }
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isDanger ? "#E8482C" : "#1C1917", margin: 0 }}>{r.l}</p>
                    {"s" in r && r.s && (
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#8A8278", marginTop: 2 }}>{r.s}</p>
                    )}
                  </div>
                  {isCalendar && calendarConnected && (
                    <span style={{ padding: "2px 7px", background: "#2B7A3E", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, borderRadius: 4, border: "1px solid #1C1917" }}>
                      CONNECTED
                    </span>
                  )}
                  {hasChev && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#8A8278", marginTop: 8 }}>
        RECALL · v1.0 · {new Date().getFullYear()}
      </p>
    </div>
  );
}

export function SettingsPage() {
  const user = useQuery(api.users.getMe);
  const { signOut } = useAuthActions();
  const deleteAccountData = useMutation(api.users.deleteAccount);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteAccountData();
      await signOut();
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col md:hidden min-h-svh" style={{ background: "#F5EFE2" }}>
        <header className="px-5 pt-12 pb-4">
          <div className="text-[10px] font-bold tracking-[2px] uppercase px-2 py-0.5 rounded inline-block mb-2"
            style={{ fontFamily: "var(--font-mono)", background: "#1C1917", color: "#F5EFE2" }}>
            SETTINGS
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-serif)", color: "#1C1917", letterSpacing: -0.8, lineHeight: 1 }}>
              Settings
            </h1>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F4B400">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>
        </header>
        <motion.main
          className="flex-1 px-5 pb-28 pt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <SettingsContent signOut={() => void signOut()} user={user} onDeleteAccount={() => setDeleteOpen(true)} />
        </motion.main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, background: "#F5EFE2", overflowY: "auto" }}>
          <div style={{ borderBottom: "2px solid #1C1917", padding: "18px 28px 14px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#8A8278", textTransform: "uppercase" }}>
              SETTINGS
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 800, color: "#1C1917", letterSpacing: -0.5, lineHeight: 1, marginTop: 4 }}>
              Settings
            </div>
          </div>
          <motion.div
            style={{ padding: "28px 28px" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <SettingsContent signOut={() => void signOut()} user={user} onDeleteAccount={() => setDeleteOpen(true)} />
          </motion.div>
        </main>
      </div>

      {/* Delete account confirmation */}
      <BottomSheet open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete account?">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 14, color: "#4A4642", lineHeight: 1.5, margin: 0 }}>
            This will permanently delete your account and all data including courses, topics, and flashcards. <strong>This cannot be undone.</strong>
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" disabled={deleting} onClick={handleDeleteAccount}>
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
