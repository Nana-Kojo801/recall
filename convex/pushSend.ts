"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import webpush from "web-push";

export const send = internalAction({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    icon: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    // Determine notification type from tag prefix
    const notifType = args.tag.startsWith("due-") ? "session_due"
      : (args.tag.startsWith("warn") ? "session_warning" : "general") as "session_due" | "session_warning" | "general";

    // Always create in-app notification
    await ctx.runMutation(internal.notifications.create, {
      userId: args.userId,
      title: args.title,
      body: args.body,
      type: notifType,
    });

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    if (!vapidPublicKey || !vapidPrivateKey) return;

    const sub = await ctx.runQuery(internal.push.getByUser, { userId: args.userId });
    if (!sub) return;

    webpush.setVapidDetails(
      process.env.VAPID_EMAIL ?? "mailto:admin@example.com",
      vapidPublicKey,
      vapidPrivateKey,
    );

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: args.title, body: args.body, icon: args.icon, tag: args.tag }),
      );
    } catch (e: unknown) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await ctx.runMutation(internal.push.deleteById, { id: sub._id });
      }
    }
  },
});
