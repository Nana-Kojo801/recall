import { useClerk, useUser } from "@clerk/react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

function ConnectGoogleCalendarButton() {
  const { openUserProfile } = useClerk();
  return (
    <button
      onClick={() => openUserProfile()}
      style={{
        padding: "4px 10px", background: "#3B5BDB", color: "#fff",
        fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
        borderRadius: 4, border: "1px solid #1C1917", cursor: "pointer",
      }}
    >
      CONNECT
    </button>
  );
}

type TogglesState = {
  dailyReminder: boolean;
  soundOnFlip: boolean;
  hardestFirst: boolean;
  autoResolve: boolean;
  twoWaySync: boolean;
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        position: "relative", flexShrink: 0,
        width: 38, height: 22, borderRadius: 11,
        background: on ? "#2B7A3E" : "#fff",
        border: "2px solid #1C1917",
        boxShadow: "1.5px 1.5px 0 #1C1917",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute", top: 1, width: 16, height: 16, borderRadius: "50%",
          left: on ? 16 : 1,
          background: "#fff", border: "1.5px solid #1C1917",
          transition: "left 0.15s",
        }}
      />
    </div>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i;
  const label = h === 0 ? "12:00 AM" : h < 12 ? `${h}:00 AM` : h === 12 ? "12:00 PM" : `${h - 12}:00 PM`;
  return { value: h, label };
});

function SettingsContent({
  signOut,
  user,
  toggles,
  onToggle,
  onDeleteAccount,
}: {
  signOut: () => void;
  user: ReturnType<typeof useUser>["user"];
  toggles: TogglesState;
  onToggle: (key: keyof TogglesState) => void;
  onDeleteAccount: () => void;
}) {
  const { openUserProfile } = useClerk();
  const [blockHoursOpen, setBlockHoursOpen] = useState(false);
  const [blockStart, setBlockStart] = useState(22);
  const [blockEnd, setBlockEnd] = useState(7);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const googleAccount = user?.externalAccounts?.find((a) => a.provider === "google");
  const calendarConnected = !!googleAccount;
  const googleEmail = googleAccount?.emailAddress;

  type Row =
    | { l: string; s?: string; toggleKey: keyof TogglesState }
    | { l: string; s?: string; chev: true; onPress?: () => void }
    | { l: string; danger: true; onPress?: () => void }
    | { l: string; s?: string; calendarRow: true };

  const blockLabel = `Never after ${blockStart}:00 or before ${blockEnd}:00`;

  const GROUPS: Array<{ h: string; rows: Row[] }> = [
    {
      h: "Study",
      rows: [
        { l: "Daily reminder", s: "8:00 AM", toggleKey: "dailyReminder" },
        { l: "Sound on flip", s: "Soft tick", toggleKey: "soundOnFlip" },
        { l: "Hardest-first ordering", toggleKey: "hardestFirst" },
      ],
    },
    {
      h: "Calendar & sync",
      rows: [
        { l: "Google Calendar", s: googleEmail ?? "Not connected", calendarRow: true },
        { l: "Auto-resolve conflicts", s: "Search ±2 hr window for free slot", toggleKey: "autoResolve" },
        { l: "Block-out hours", s: blockLabel, chev: true as true, onPress: () => setBlockHoursOpen(true) },
        { l: "Two-way sync", s: "Reflect calendar deletions in Recall", toggleKey: "twoWaySync" },
      ],
    },
    {
      h: "Account",
      rows: [
        { l: "Export library", s: "CSV / Anki", chev: true },
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
          <img src={user.imageUrl} alt={user.fullName ?? ""} style={{ width: 48, height: 48, borderRadius: 10, border: "2px solid #1C1917" }} />
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
            {user?.fullName ?? "You"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            {user?.primaryEmailAddress?.emailAddress}
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
              const isToggle = "toggleKey" in r;
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
                    cursor: (isToggle || isDanger || onPress) ? "pointer" : undefined,
                  }}
                  onClick={
                    isDanger && r.l === "Sign out" ? () => signOut()
                    : isDanger && onPress ? () => onPress()
                    : isToggle ? () => onToggle(r.toggleKey as keyof TogglesState)
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
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ padding: "2px 7px", background: "#2B7A3E", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, borderRadius: 4, border: "1px solid #1C1917" }}>
                        CONNECTED
                      </span>
                      <button
                        onClick={() => openUserProfile()}
                        style={{ padding: "2px 8px", background: "#fff", color: "#1C1917", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, borderRadius: 4, border: "1.5px solid #1C1917", cursor: "pointer" }}
                      >
                        MANAGE →
                      </button>
                    </div>
                  )}
                  {isCalendar && !calendarConnected && (
                    <ConnectGoogleCalendarButton />
                  )}
                  {isToggle && (
                    <Toggle
                      on={toggles[r.toggleKey as keyof TogglesState]}
                      onClick={() => onToggle(r.toggleKey as keyof TogglesState)}
                    />
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

      {/* Block-out hours sheet */}
      <BottomSheet open={blockHoursOpen} onOpenChange={setBlockHoursOpen} title="Block-out hours">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontSize: 13, color: "#4A4642", margin: 0, lineHeight: 1.5 }}>
            Recall will never schedule reviews outside these hours.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Do not schedule after
              </label>
              <select
                value={blockStart}
                onChange={(e) => setBlockStart(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #1C1917", background: "#fff", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, cursor: "pointer", appearance: "none" }}
              >
                {HOURS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Do not schedule before
              </label>
              <select
                value={blockEnd}
                onChange={(e) => setBlockEnd(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid #1C1917", background: "#fff", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, cursor: "pointer", appearance: "none" }}
              >
                {HOURS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Button variant="primary" onClick={() => setBlockHoursOpen(false)}>Save</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

export function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const deleteAccountData = useMutation(api.users.deleteAccount);
  const [toggles, setToggles] = useState<TogglesState>({
    dailyReminder: true,
    soundOnFlip: false,
    hardestFirst: true,
    autoResolve: true,
    twoWaySync: false,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleToggle(key: keyof TogglesState) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteAccountData();
      await user.delete();
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
          <SettingsContent signOut={signOut} user={user} toggles={toggles} onToggle={handleToggle} onDeleteAccount={() => setDeleteOpen(true)} />
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
            <SettingsContent signOut={signOut} user={user} toggles={toggles} onToggle={handleToggle} onDeleteAccount={() => setDeleteOpen(true)} />
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
