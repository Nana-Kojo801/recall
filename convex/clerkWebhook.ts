import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

type ClerkEmailAddress = { email_address: string };

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses?: ClerkEmailAddress[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
    deleted?: boolean;
  };
};

export const handleWebhook = httpAction(async (ctx, req) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses?.[0]?.email_address;
    const nameParts = [first_name, last_name].filter(Boolean);
    const name = nameParts.length > 0 ? nameParts.join(" ") : undefined;

    await ctx.runMutation(internal.users.upsertFromClerk, {
      clerkId: id,
      email,
      name,
      imageUrl: image_url,
      webhookId: svixId ?? undefined,
    });
  } else if (event.type === "user.deleted") {
    await ctx.runMutation(internal.users.deleteByClerkId, {
      clerkId: event.data.id,
    });
  }

  return new Response(null, { status: 200 });
});
