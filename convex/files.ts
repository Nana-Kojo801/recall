import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return ctx.storage.generateUploadUrl();
  },
});

export const createUploadRecord = mutation({
  args: {
    topicId: v.id("topics"),
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return ctx.db.insert("materialUploads", {
      topicId: args.topicId,
      userId: identity.tokenIdentifier,
      fileName: args.fileName,
      fileSize: args.fileSize,
      storageId: args.storageId,
      status: "processing",
    });
  },
});

export const updateStatus = mutation({
  args: {
    uploadId: v.id("materialUploads"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("done"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    await ctx.db.patch(args.uploadId, {
      status: args.status,
      errorMessage: args.errorMessage,
    });
  },
});

export const listByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return ctx.db
      .query("materialUploads")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .take(20);
  },
});

export const remove = mutation({
  args: { uploadId: v.id("materialUploads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const upload = await ctx.db.get(args.uploadId);
    if (!upload || upload.userId !== identity.tokenIdentifier) throw new Error("Not found");
    if (upload.storageId) {
      await ctx.storage.delete(upload.storageId);
    }
    await ctx.db.delete(args.uploadId);
  },
});
