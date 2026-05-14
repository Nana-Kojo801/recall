import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    topicId: v.id("topics"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("studySessions", {
      topicId: args.topicId,
      courseId: args.courseId,
      userId,
      startedAt: Date.now(),
      cardsStudied: 0,
    });
  },
});

export const complete = mutation({
  args: {
    sessionId: v.id("studySessions"),
    cardsStudied: v.number(),
    calendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.sessionId, {
      completedAt: Date.now(),
      cardsStudied: args.cardsStudied,
      calendarEventId: args.calendarEventId,
    });
  },
});
