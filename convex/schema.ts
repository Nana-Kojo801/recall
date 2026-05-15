import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    // Optional for migration compat — not set on Convex Auth users
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    googleAccessToken: v.optional(v.string()),
    googleRefreshToken: v.optional(v.string()),
    lastWebhookId: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  courses: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string(),
  }).index("by_user", ["userId"]),

  topics: defineTable({
    courseId: v.id("courses"),
    userId: v.string(),
    name: v.string(),
    lastStudied: v.optional(v.number()),
    nextReview: v.optional(v.number()),
  })
    .index("by_course", ["courseId"])
    .index("by_user", ["userId"]),

  flashcards: defineTable({
    topicId: v.id("topics"),
    userId: v.string(),
    front: v.string(),
    back: v.string(),
    interval: v.number(),
    easeFactor: v.number(),
    repetitions: v.number(),
    nextReview: v.number(),
    lastRating: v.optional(v.union(v.literal("hard"), v.literal("okay"), v.literal("easy"))),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"])
    .index("by_topic_and_next_review", ["topicId", "nextReview"]),

  programs: defineTable({
    topicId: v.id("topics"),
    courseId: v.id("courses"),
    userId: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    currentSession: v.number(),
    totalSessions: v.number(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("paused"), v.literal("cancelled")),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"]),

  programSessions: defineTable({
    programId: v.id("programs"),
    topicId: v.id("topics"),
    userId: v.string(),
    sessionNumber: v.number(),
    scheduledAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(v.literal("upcoming"), v.literal("completed"), v.literal("missed")),
    calendarEventId: v.optional(v.string()),
    cardCount: v.number(),
  })
    .index("by_program", ["programId"])
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  studySessions: defineTable({
    topicId: v.id("topics"),
    userId: v.string(),
    courseId: v.id("courses"),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    cardsStudied: v.number(),
    calendarEventId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_topic", ["topicId"]),

  pushSubscriptions: defineTable({
    userId: v.string(),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    type: v.union(v.literal("session_due"), v.literal("session_warning"), v.literal("review_due"), v.literal("general")),
    isRead: v.boolean(),
    createdAt: v.number(),
    link: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "isRead"]),

  materialUploads: defineTable({
    topicId: v.id("topics"),
    userId: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error"),
    ),
    errorMessage: v.optional(v.string()),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"]),
});
