import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return ctx.db.insert("studySessions", {
      topicId: args.topicId,
      courseId: args.courseId,
      userId: identity.tokenIdentifier,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.tokenIdentifier) throw new Error("Not found");
    await ctx.db.patch(args.sessionId, {
      completedAt: Date.now(),
      cardsStudied: args.cardsStudied,
      calendarEventId: args.calendarEventId,
    });
  },
});
