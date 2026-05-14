import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(500);
  },
});

export const listByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("flashcards")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .take(500);
  },
});

export const getDueByTopic = query({
  args: { topicId: v.id("topics"), now: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("flashcards")
      .withIndex("by_topic_and_next_review", (q) =>
        q.eq("topicId", args.topicId).lte("nextReview", args.now)
      )
      .take(50);
  },
});

export const bulkCreate = mutation({
  args: {
    topicId: v.id("topics"),
    cards: v.array(v.object({ front: v.string(), back: v.string() })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const now = Date.now();
    const ids = [];
    for (const card of args.cards) {
      const id = await ctx.db.insert("flashcards", {
        topicId: args.topicId,
        userId,
        front: card.front,
        back: card.back,
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: now,
      });
      ids.push(id);
    }
    return ids;
  },
});

export const updateAfterRating = mutation({
  args: {
    cardId: v.id("flashcards"),
    rating: v.union(v.literal("hard"), v.literal("okay"), v.literal("easy")),
    interval: v.number(),
    easeFactor: v.number(),
    repetitions: v.number(),
    nextReview: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const card = await ctx.db.get(args.cardId);
    if (!card || card.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.cardId, {
      interval: args.interval,
      easeFactor: args.easeFactor,
      repetitions: args.repetitions,
      nextReview: args.nextReview,
      lastRating: args.rating,
    });
  },
});

export const remove = mutation({
  args: { cardId: v.id("flashcards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const card = await ctx.db.get(args.cardId);
    if (!card || card.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.cardId);
  },
});

export const removeAll = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
    for (const card of cards) {
      if (card.userId !== userId) continue;
      await ctx.db.delete(card._id);
    }

    const pSessions = await ctx.db
      .query("programSessions")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
    for (const s of pSessions) {
      if (s.userId !== userId) continue;
      await ctx.db.delete(s._id);
    }

    const programs = await ctx.db
      .query("programs")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
    for (const p of programs) {
      if (p.userId !== userId) continue;
      await ctx.db.delete(p._id);
    }
  },
});
