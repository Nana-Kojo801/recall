import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("courses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(100);
  },
});

export const get = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const course = await ctx.db.get(args.courseId);
    if (!course || course.userId !== userId) return null;
    return course;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("courses", {
      userId,
      name: args.name,
      code: args.code,
      color: args.color,
    });
  },
});

export const update = mutation({
  args: {
    courseId: v.id("courses"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const course = await ctx.db.get(args.courseId);
    if (!course || course.userId !== userId) throw new Error("Not found");
    const { courseId, ...patch } = args;
    await ctx.db.patch(args.courseId, patch);
  },
});

export const remove = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const course = await ctx.db.get(args.courseId);
    if (!course || course.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.courseId);
  },
});

export const removeWithCascade = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const course = await ctx.db.get(args.courseId);
    if (!course || course.userId !== userId) throw new Error("Not found");

    const topics = await ctx.db.query("topics").withIndex("by_course", (q) => q.eq("courseId", args.courseId)).collect();
    for (const topic of topics) {
      const flashcards = await ctx.db.query("flashcards").withIndex("by_topic", (q) => q.eq("topicId", topic._id)).collect();
      for (const c of flashcards) await ctx.db.delete(c._id);

      const uploads = await ctx.db.query("materialUploads").withIndex("by_topic", (q) => q.eq("topicId", topic._id)).collect();
      for (const u of uploads) {
        if (u.storageId) await ctx.storage.delete(u.storageId);
        await ctx.db.delete(u._id);
      }

      const sessions = await ctx.db.query("studySessions").withIndex("by_topic", (q) => q.eq("topicId", topic._id)).collect();
      for (const s of sessions) await ctx.db.delete(s._id);

      const programs = await ctx.db.query("programs").withIndex("by_topic", (q) => q.eq("topicId", topic._id)).collect();
      for (const p of programs) {
        const pSessions = await ctx.db.query("programSessions").withIndex("by_program", (q) => q.eq("programId", p._id)).collect();
        for (const ps of pSessions) await ctx.db.delete(ps._id);
        await ctx.db.delete(p._id);
      }

      await ctx.db.delete(topic._id);
    }

    await ctx.db.delete(args.courseId);
  },
});
