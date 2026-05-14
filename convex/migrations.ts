import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// One-time migration: remap all userId fields from Clerk tokenIdentifier to Convex Auth tokenIdentifier.
// Called automatically in auth.ts createOrUpdateUser on first sign-in after migration.
export const remapUserId = internalMutation({
  args: { oldId: v.string(), newId: v.string() },
  handler: async (ctx, { oldId, newId }) => {
    const [courses, topics, flashcards, programs, studySessions, materialUploads] =
      await Promise.all([
        ctx.db.query("courses").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
        ctx.db.query("topics").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
        ctx.db.query("flashcards").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
        ctx.db.query("programs").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
        ctx.db.query("studySessions").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
        ctx.db.query("materialUploads").withIndex("by_user", (q) => q.eq("userId", oldId)).collect(),
      ]);

    // programSessions uses composite index — query each status
    const [upcomingSessions, completedSessions, missedSessions] = await Promise.all([
      ctx.db
        .query("programSessions")
        .withIndex("by_user_and_status", (q) => q.eq("userId", oldId).eq("status", "upcoming"))
        .collect(),
      ctx.db
        .query("programSessions")
        .withIndex("by_user_and_status", (q) => q.eq("userId", oldId).eq("status", "completed"))
        .collect(),
      ctx.db
        .query("programSessions")
        .withIndex("by_user_and_status", (q) => q.eq("userId", oldId).eq("status", "missed"))
        .collect(),
    ]);

    const allDocs = [
      ...courses,
      ...topics,
      ...flashcards,
      ...programs,
      ...studySessions,
      ...materialUploads,
      ...upcomingSessions,
      ...completedSessions,
      ...missedSessions,
    ];

    for (const doc of allDocs) {
      await ctx.db.patch(doc._id, { userId: newId });
    }
  },
});
