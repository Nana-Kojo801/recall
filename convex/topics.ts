import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(200);
  },
});

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("topics")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .take(100);
  },
});

export const get = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const topic = await ctx.db.get(args.topicId);
    if (!topic || topic.userId !== userId) return null;
    return topic;
  },
});

export const create = mutation({
  args: {
    courseId: v.id("courses"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("topics", {
      courseId: args.courseId,
      userId,
      name: args.name,
    });
  },
});

export const update = mutation({
  args: {
    topicId: v.id("topics"),
    name: v.optional(v.string()),
    lastStudied: v.optional(v.number()),
    nextReview: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const topic = await ctx.db.get(args.topicId);
    if (!topic || topic.userId !== userId) throw new Error("Not found");
    const { topicId, ...patch } = args;
    await ctx.db.patch(args.topicId, patch);
  },
});

export const remove = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const topic = await ctx.db.get(args.topicId);
    if (!topic || topic.userId !== userId) throw new Error("Not found");

    const flashcards = await ctx.db.query("flashcards").withIndex("by_topic", (q) => q.eq("topicId", args.topicId)).collect();
    for (const c of flashcards) await ctx.db.delete(c._id);

    const uploads = await ctx.db.query("materialUploads").withIndex("by_topic", (q) => q.eq("topicId", args.topicId)).collect();
    for (const u of uploads) {
      if (u.storageId) await ctx.storage.delete(u.storageId);
      await ctx.db.delete(u._id);
    }

    const sessions = await ctx.db.query("studySessions").withIndex("by_topic", (q) => q.eq("topicId", args.topicId)).collect();
    for (const s of sessions) await ctx.db.delete(s._id);

    const programs = await ctx.db.query("programs").withIndex("by_topic", (q) => q.eq("topicId", args.topicId)).collect();
    for (const p of programs) {
      const pSessions = await ctx.db.query("programSessions").withIndex("by_program", (q) => q.eq("programId", p._id)).collect();
      for (const ps of pSessions) await ctx.db.delete(ps._id);
      await ctx.db.delete(p._id);
    }

    await ctx.db.delete(args.topicId);
  },
});
