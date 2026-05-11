import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    webhookId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .collect();

    if (all.length > 0) {
      const primary = all[0];
      // Skip if already processed this exact webhook delivery
      if (args.webhookId && primary.lastWebhookId === args.webhookId) return;
      await ctx.db.patch(primary._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        lastWebhookId: args.webhookId,
      });
      // Clean up any duplicates created by concurrent inserts
      for (let i = 1; i < all.length; i++) {
        await ctx.db.delete(all[i]._id);
      }
    } else {
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        lastWebhookId: args.webhookId,
      });
    }
  },
});

export const deleteByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) await ctx.db.delete(user._id);
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const uid = identity.tokenIdentifier;

    // Delete storage files from materialUploads first
    const uploads = await ctx.db
      .query("materialUploads")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const u of uploads) {
      if (u.storageId) await ctx.storage.delete(u.storageId);
      await ctx.db.delete(u._id);
    }

    // Delete flashcards
    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const c of cards) await ctx.db.delete(c._id);

    // Delete programSessions
    const pSessions = await ctx.db
      .query("programSessions")
      .withIndex("by_user_and_status", (q) => q.eq("userId", uid))
      .collect();
    for (const s of pSessions) await ctx.db.delete(s._id);

    // Delete studySessions
    const sSessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const s of sSessions) await ctx.db.delete(s._id);

    // Delete programs
    const programs = await ctx.db
      .query("programs")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const p of programs) await ctx.db.delete(p._id);

    // Delete topics
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const t of topics) await ctx.db.delete(t._id);

    // Delete courses
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const c of courses) await ctx.db.delete(c._id);

    // Delete user record (keyed by clerkId = identity.subject)
    const userRow = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (userRow) await ctx.db.delete(userRow._id);
  },
});

// identity.subject is the Clerk user ID (matches clerkId)
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});
