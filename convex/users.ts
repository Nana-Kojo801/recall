import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

export const updateGoogleTokens = internalMutation({
  args: {
    userId: v.id("users"),
    googleAccessToken: v.string(),
    googleRefreshToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: { googleAccessToken: string; googleRefreshToken?: string } = {
      googleAccessToken: args.googleAccessToken,
    };
    if (args.googleRefreshToken) patch.googleRefreshToken = args.googleRefreshToken;
    await ctx.db.patch(args.userId, patch);
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    // Clean up auth tables so re-signup doesn't hit orphaned references
    const authAccountEntries = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const entry of authAccountEntries) await ctx.db.delete(entry._id);

    const authSessionEntries = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const entry of authSessionEntries) await ctx.db.delete(entry._id);

    const uploads = await ctx.db
      .query("materialUploads")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const u of uploads) {
      if (u.storageId) await ctx.storage.delete(u.storageId);
      await ctx.db.delete(u._id);
    }

    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const c of cards) await ctx.db.delete(c._id);

    for (const status of ["upcoming", "completed", "missed"] as const) {
      const sessions = await ctx.db
        .query("programSessions")
        .withIndex("by_user_and_status", (q) => q.eq("userId", userId).eq("status", status))
        .collect();
      for (const s of sessions) await ctx.db.delete(s._id);
    }

    const sSessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const s of sSessions) await ctx.db.delete(s._id);

    const programs = await ctx.db
      .query("programs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const p of programs) await ctx.db.delete(p._id);

    const topics = await ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const t of topics) await ctx.db.delete(t._id);

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const c of courses) await ctx.db.delete(c._id);

    await ctx.db.delete(userId);
  },
});

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    webhookId: v.optional(v.string()),
  },
  handler: async (_ctx, _args) => {},
});

export const deleteByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (_ctx, _args) => {},
});
