"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateFlashcards = action({
  args: {
    topicId: v.id("topics"),
    uploadId: v.id("materialUploads"),
    text: v.string(),
    focusHint: v.optional(v.string()),
    maxCards: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<string[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    if (!args.text.trim()) {
      await ctx.runMutation(api.files.updateStatus, {
        uploadId: args.uploadId,
        status: "error",
        errorMessage: "Could not extract text from file. Try a text-based PDF or .txt file.",
      });
      throw new Error("No text could be extracted from the uploaded file.");
    }

    const focusLine = args.focusHint?.trim()
      ? `\n\nAdditional instruction: ${args.focusHint.trim()}`
      : "";

    const countInstruction = args.maxCards
      ? `Generate at most ${args.maxCards} flashcards, focusing on the most important concepts.`
      : "Do not limit yourself to a fixed count — generate as many cards as needed for complete coverage.";

    const prompt = `You are a study assistant. Generate flashcards from the following lecture material that comprehensively cover every significant concept, definition, process, and fact in the document. ${countInstruction}${focusLine}

Return ONLY a JSON array in this exact format, no other text:
[
  {"front": "Question or concept", "back": "Answer or explanation"},
  ...
]

Keep answers concise but complete. Every key term, definition, relationship, and process should have its own card.

Lecture material:
${args.text.slice(0, 8000)}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VITE_APP_URL ?? "https://recall.app",
        "X-Title": "Recall - AI Flashcards",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      await ctx.runMutation(api.files.updateStatus, {
        uploadId: args.uploadId,
        status: "error",
        errorMessage: `AI request failed: ${response.status} ${response.statusText}`,
      });
      throw new Error(`OpenRouter error: ${response.status} ${response.statusText} — ${errBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    let cards: { front: string; back: string }[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      }
    } catch {
      await ctx.runMutation(api.files.updateStatus, {
        uploadId: args.uploadId,
        status: "error",
        errorMessage: "Failed to parse AI response",
      });
      throw new Error("Failed to parse flashcards from AI response");
    }

    const filtered = cards.filter((c) => c.front && c.back);
    const finalCards = args.maxCards ? filtered.slice(0, args.maxCards) : filtered;
    await ctx.runMutation(api.flashcards.bulkCreate, {
      topicId: args.topicId,
      cards: finalCards,
    });

    await ctx.runMutation(api.files.updateStatus, {
      uploadId: args.uploadId,
      status: "done",
    });

    return finalCards.map((c) => c.front);
  },
});
