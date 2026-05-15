import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    topicId: v.id("topics"),
    courseId: v.id("courses"),
    startDate: v.number(),
    endDate: v.number(),
    totalSessions: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("programs", {
      topicId: args.topicId,
      courseId: args.courseId,
      userId,
      startDate: args.startDate,
      endDate: args.endDate,
      currentSession: 1,
      totalSessions: args.totalSessions,
      status: "active",
    });
  },
});

export const getActiveByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(1);
    return programs[0] ?? null;
  },
});

export const advanceSession = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const program = await ctx.db.get(args.programId);
    if (!program || program.userId !== userId) throw new Error("Not found");
    const next = program.currentSession + 1;
    if (next > program.totalSessions) {
      await ctx.db.patch(args.programId, { status: "completed" });
    } else {
      await ctx.db.patch(args.programId, { currentSession: next });
    }
  },
});

export const complete = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const program = await ctx.db.get(args.programId);
    if (!program || program.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.programId, { status: "completed" });
  },
});

export const cancel = mutation({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const program = await ctx.db.get(args.programId);
    if (!program || program.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.programId, { status: "cancelled" });
  },
});
