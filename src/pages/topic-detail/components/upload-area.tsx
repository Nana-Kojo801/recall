import { useRef, useState, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { extractTextFromFile } from "@/lib/openrouter/client";
import { Button } from "@/components/ui/button";
import { generationState } from "@/lib/generation-state";

interface UploadAreaProps {
  topicId: Id<"topics">;
  onCancel?: () => void;
}

type UploadStatus = "idle" | "reading" | "uploading" | "ready" | "generating" | "done" | "error";

function initStatus(topicId: string): UploadStatus {
  if (generationState.topicId === topicId) {
    if (generationState.status === "generating") return "generating";
    if (generationState.status === "done") return "done";
    if (generationState.status === "error") return "error";
  }
  return "idle";
}

export function UploadArea({ topicId, onCancel }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>(() => initStatus(topicId));
  const [errorMsg, setErrorMsg] = useState(() =>
    generationState.topicId === topicId && generationState.status === "error"
      ? generationState.errorMsg : ""
  );
  const [cardCount, setCardCount] = useState(() =>
    generationState.topicId === topicId && generationState.status === "done"
      ? generationState.cardCount : 0
  );
  const [dragging, setDragging] = useState(false);
  const [focusHint, setFocusHint] = useState("");
  const [maxCards, setMaxCards] = useState<number>(0);
  const [fileName, setFileName] = useState("");

  const pendingUploadId = useRef<Id<"materialUploads"> | null>(null);
  const pendingText = useRef<string>("");

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createUploadRecord = useMutation(api.files.createUploadRecord);
  const generateFlashcards = useAction(api.ai.generateFlashcards);

  // Sync from global generation state when this topic's generation resolves
  useEffect(() => {
    return generationState.subscribe(() => {
      if (generationState.topicId !== topicId) return;
      if (generationState.status === "done") {
        setStatus("done");
        setCardCount(generationState.cardCount);
      } else if (generationState.status === "error") {
        setStatus("error");
        setErrorMsg(generationState.errorMsg);
      } else if (generationState.status === "idle") {
        setStatus("idle");
      }
    });
  }, [topicId]);

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "pptx", "docx", "txt"].includes(ext ?? "")) {
      setStatus("error");
      setErrorMsg("Unsupported file type. Use PDF, PPTX, DOCX, or TXT.");
      return;
    }
    setFileName(file.name);
    setStatus("reading");
    setErrorMsg("");
    try {
      const text = await extractTextFromFile(file);
      setStatus("uploading");
      const uploadUrl = await generateUploadUrl();
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { storageId } = await uploadRes.json();
      const uploadId = await createUploadRecord({ topicId, fileName: file.name, fileSize: file.size, storageId });
      pendingUploadId.current = uploadId;
      pendingText.current = text;
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleGenerate = () => {
    if (!pendingUploadId.current) return;
    setStatus("generating");
    const tid = topicId as string;
    generationState.start(tid);

    const p = generateFlashcards({
      topicId,
      uploadId: pendingUploadId.current,
      text: pendingText.current,
      focusHint: focusHint.trim() || undefined,
      maxCards: maxCards > 0 ? maxCards : undefined,
    }).then((fronts) => {
      generationState.done(fronts.length, tid);
    }).catch((err: unknown) => {
      generationState.fail(err instanceof Error ? err.message : "Generation failed", tid);
    }) as Promise<void>;

    generationState.keepAlive(p);
  };

  const handleCancel = () => {
    generationState.cancel();
    setStatus("idle");
    reset();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const reset = () => {
    generationState.reset();
    setStatus("idle");
    setFocusHint("");
    setMaxCards(0);
    setFileName("");
    setErrorMsg("");
    setCardCount(0);
    pendingUploadId.current = null;
    pendingText.current = "";
    if (inputRef.current) inputRef.current.value = "";
  };

  const isActive = status !== "generating" && status !== "done";
  const fileReady = status === "ready";
  const isBusy = status === "reading" || status === "uploading";

  return (
    <div className="flex flex-col gap-4">
      {/* Focus hint + max cards — always visible when active */}
      {isActive && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", marginBottom: 6 }}>
              Focus hint (optional)
            </label>
            <textarea
              value={focusHint}
              onChange={(e) => setFocusHint(e.target.value)}
              placeholder='e.g. "Focus on definitions" or "Prioritize key differences"'
              rows={2}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "2px solid rgba(28,25,23,0.2)", background: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, color: "#1C1917", resize: "none", outline: "none", lineHeight: 1.4, boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = "#1C1917")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(28,25,23,0.2)")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#8A8278", textTransform: "uppercase", marginBottom: 6 }}>
              Max flashcards (optional)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="number"
                min={1}
                max={300}
                placeholder="Auto"
                value={maxCards || ""}
                onChange={(e) => setMaxCards(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: 90, padding: "8px 10px", borderRadius: 8, border: "2px solid rgba(28,25,23,0.2)", background: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "#1C1917", outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = "#1C1917")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(28,25,23,0.2)")}
              />
              <span style={{ fontSize: 11, color: "#8A8278", fontFamily: "var(--font-mono)" }}>
                {maxCards > 0 ? `max ${maxCards} cards` : "unlimited (auto)"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone — always visible when active */}
      {isActive && (
        <div
          onClick={() => !isBusy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!isBusy) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-card transition-all duration-200"
          style={{
            background: dragging ? "rgba(232,72,44,0.06)" : fileReady ? "rgba(43,122,62,0.04)" : "#fff",
            border: `2px ${dragging ? "solid" : "dashed"} ${dragging ? "#E8482C" : fileReady ? "#2B7A3E" : "#1C1917"}`,
            boxShadow: dragging ? "4px 4px 0 #E8482C" : fileReady ? "2px 2px 0 #2B7A3E" : "2px 2px 0 rgba(28,25,23,0.15)",
            cursor: isBusy ? "default" : "pointer",
          }}
        >
          {isBusy ? (
            <>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="gen-dot w-2 h-2 rounded-full" style={{ background: "#E8482C", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-sm font-bold text-center" style={{ fontFamily: "var(--font-mono)", color: "#4A4642" }}>
                {status === "reading" ? "Reading file…" : "Uploading…"}
              </p>
            </>
          ) : fileReady ? (
            <>
              <div className="w-12 h-12 rounded-button flex items-center justify-center" style={{ background: "rgba(43,122,62,0.1)", border: "2px solid #2B7A3E", boxShadow: "2px 2px 0 #2B7A3E" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B7A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm" style={{ color: "#2B7A3E" }}>File ready</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>{fileName}</p>
                <p className="text-[10px] mt-1.5" style={{ fontFamily: "var(--font-mono)", color: "#8A8278", opacity: 0.7 }}>Click to change file</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-button flex items-center justify-center" style={{ background: "#F5EFE2", border: "2px solid #1C1917", boxShadow: "2px 2px 0 #1C1917" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8482C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm" style={{ color: "#1C1917" }}>Drop files or click to upload</p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}>PDF · PPTX · DOCX · TXT</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.pptx,.docx,.txt"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
            className="hidden"
          />
        </div>
      )}

      {/* Generate + Cancel — shown when active and not error */}
      {isActive && status !== "error" && (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" className="flex-1" onClick={() => { reset(); onCancel?.(); }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!fileReady}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>
      )}

      {/* Generating */}
      {status === "generating" && (
        <div style={{ padding: "18px 16px", background: "rgba(232,72,44,0.06)", border: "2px solid #E8482C", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="gen-dot w-2 h-2 rounded-full" style={{ background: "#E8482C", animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <p className="text-sm font-bold text-center" style={{ fontFamily: "var(--font-mono)", color: "#4A4642" }}>Brewing flashcards with AI…</p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#8A8278", textAlign: "center" }}>Safe to navigate away — we'll notify when done</p>
          <button
            onClick={handleCancel}
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#E8482C", background: "transparent", border: "1.5px solid #E8482C", borderRadius: 6, padding: "4px 12px", cursor: "pointer", marginTop: 2 }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Done */}
      {status === "done" && (
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-button"
          style={{ background: "rgba(43,122,62,0.1)", border: "2px solid #2B7A3E" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2B7A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm font-bold flex-1" style={{ color: "#2B7A3E" }}>{cardCount} flashcards created</span>
          <button onClick={reset} className="text-xs font-bold underline" style={{ color: "#8A8278" }}>Upload another</button>
        </motion.div>
      )}

      {/* Error */}
      {status === "error" && (
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-button"
          style={{ background: "rgba(232,72,44,0.1)", border: "2px solid #E8482C" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8482C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-sm font-semibold flex-1" style={{ color: "#E8482C" }}>{errorMsg}</span>
          <button onClick={reset} className="text-xs font-bold underline" style={{ color: "#8A8278" }}>Try again</button>
        </motion.div>
      )}
    </div>
  );
}
