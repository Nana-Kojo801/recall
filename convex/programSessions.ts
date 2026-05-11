import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBatch = mutation({
  args: {
    programId: v.id("programs"),
    topicId: v.id("topics"),
    sessions: v.array(v.object({
      sessionNumber: v.number(),
      scheduledAt: v.number(),
      cardCount: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const ids: string[] = [];
    for (const s of args.sessions) {
      const id = await ctx.db.insert("programSessions", {
        programId: args.programId,
        topicId: args.topicId,
        userId: identity.tokenIdentifier,
        sessionNumber: s.sessionNumber,
        scheduledAt: s.scheduledAt,
        cardCount: s.cardCount,
        status: "upcoming",
      });
      ids.push(id);
    }
    return ids;
  },
});

export const listByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("programSessions")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
  },
});

export const listByProgram = query({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("programSessions")
      .withIndex("by_program", (q) => q.eq("programId", args.programId))
      .collect();
  },
});

export const getAllUpcomingByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("programSessions")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", identity.tokenIdentifier).eq("status", "upcoming")
      )
      .collect();
  },
});

export const getUpcomingByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const now = Date.now();
    return ctx.db
      .query("programSessions")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", identity.tokenIdentifier).eq("status", "upcoming")
      )
      .filter((q) => q.gt(q.field("scheduledAt"), now))
      .take(5);
  },
});

export const getDueByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const now = Date.now();
    return ctx.db
      .query("programSessions")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", identity.tokenIdentifier).eq("status", "upcoming")
      )
      .filter((q) => q.lte(q.field("scheduledAt"), now))
      .take(20);
  },
});

export const complete = mutation({
  args: {
    sessionId: v.id("programSessions"),
    calendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.tokenIdentifier) throw new Error("Not found");
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
      ...(args.calendarEventId && { calendarEventId: args.calendarEventId }),
    });
  },
});

export const reschedule = mutation({
  args: {
    sessionId: v.id("programSessions"),
    scheduledAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.tokenIdentifier) throw new Error("Not found");
    await ctx.db.patch(args.sessionId, { scheduledAt: args.scheduledAt });
  },
});

export const setCalendarEvent = mutation({
  args: {
    sessionId: v.id("programSessions"),
    calendarEventId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.tokenIdentifier) throw new Error("Not found");
    await ctx.db.patch(args.sessionId, { calendarEventId: args.calendarEventId });
  },
});
