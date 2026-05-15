"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericActionCtx } from "convex/server";
import type { DataModel, Doc, Id } from "./_generated/dataModel";

// ── Token management ─────────────────────────────────────────────────────────

async function refreshAccessToken(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token?: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<{ access_token: string; refresh_token?: string }>;
}

async function calendarRequest(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) throw new Error("TOKEN_EXPIRED");
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar API ${res.status}: ${text}`);
  }
  return method === "DELETE" ? null : res.json();
}

async function calendarWithRefresh(
  ctx: GenericActionCtx<DataModel>,
  userId: Id<"users">,
  user: Doc<"users">,
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  try {
    return await calendarRequest(user.googleAccessToken ?? "", method, path, body);
  } catch (err) {
    if (String(err).includes("TOKEN_EXPIRED") && user.googleRefreshToken) {
      const refreshed = await refreshAccessToken(user.googleRefreshToken);
      await ctx.runMutation(internal.users.updateGoogleTokens, {
        userId,
        googleAccessToken: refreshed.access_token,
        ...(refreshed.refresh_token ? { googleRefreshToken: refreshed.refresh_token } : {}),
      });
      return calendarRequest(refreshed.access_token, method, path, body);
    }
    throw err;
  }
}

// ── Calendar helpers ─────────────────────────────────────────────────────────

async function findFreeSlot(
  token: string,
  idealStartMs: number,
  durationMs: number,
): Promise<number> {
  const windowStart = idealStartMs - 2 * 60 * 60 * 1000;
  const windowEnd = idealStartMs + 2 * 60 * 60 * 1000;

  const freeBusy = (await calendarRequest(token, "POST", "/freeBusy", {
    timeMin: new Date(windowStart).toISOString(),
    timeMax: new Date(windowEnd).toISOString(),
    items: [{ id: "primary" }],
  })) as { calendars: { primary: { busy: { start: string; end: string }[] } } };

  const busy = freeBusy.calendars?.primary?.busy ?? [];
  const busyIntervals = busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));

  const candidates = [idealStartMs];
  for (let t = windowStart; t <= windowEnd - durationMs; t += 15 * 60 * 1000) {
    if (t !== idealStartMs) candidates.push(t);
  }

  for (const start of candidates.sort(
    (a, b) => Math.abs(a - idealStartMs) - Math.abs(b - idealStartMs),
  )) {
    const end = start + durationMs;
    const hasConflict = busyIntervals.some((b) => start < b.end && end > b.start);
    if (!hasConflict) return start;
  }

  return idealStartMs;
}

// ── Actions ──────────────────────────────────────────────────────────────────

export const deleteTopicEvents = action({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args): Promise<void> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return;
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    if (!user?.googleAccessToken) return;

    const sessions = await ctx.runQuery(api.programSessions.listByTopic, {
      topicId: args.topicId,
    });
    for (const s of (sessions as { calendarEventId?: string }[])) {
      if (s.calendarEventId) {
        try {
          await calendarWithRefresh(
            ctx,
            authUserId,
            user,
            "DELETE",
            `/calendars/primary/events/${s.calendarEventId}`,
          );
        } catch {
          // Non-fatal
        }
      }
    }
  },
});

export const getConnectionStatus = action({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    return !!(user?.googleAccessToken);
  },
});

export const fetchUpcomingEvents = action({
  args: { calendarId: v.optional(v.string()) },
  handler: async (ctx, { calendarId = "primary" }): Promise<unknown> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return { items: [], error: "oauth_expired" };
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    if (!user?.googleAccessToken) return { items: [], error: "oauth_expired" };

    const now = new Date().toISOString();
    const future = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const path = `/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${now}&timeMax=${future}&singleEvents=true&orderBy=startTime&maxResults=50`;

    try {
      return await calendarWithRefresh(ctx, authUserId, user, "GET", path);
    } catch (err) {
      if (String(err).includes("TOKEN_EXPIRED")) return { items: [], error: "oauth_expired" };
      throw err;
    }
  },
});

export const createProgramEvents = action({
  args: {
    programId: v.id("programs"),
    sessions: v.array(
      v.object({
        sessionId: v.string(),
        sessionNumber: v.number(),
        scheduledAt: v.number(),
        cardCount: v.number(),
      }),
    ),
    courseName: v.string(),
    topicName: v.string(),
  },
  handler: async (ctx, args): Promise<{ connected: boolean }> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return { connected: false };
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    if (!user?.googleAccessToken) return { connected: false };

    for (const session of args.sessions) {
      const title = `Engraam: ${args.courseName} · ${args.topicName} – Session ${session.sessionNumber}`;
      try {
        const durationMs = Math.max(10, session.cardCount) * 60 * 1000;
        const freshUser = ((await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null) ?? user;
        const token = freshUser.googleAccessToken ?? user.googleAccessToken ?? "";
        const freeStart = await findFreeSlot(token, session.scheduledAt, durationMs);

        const event = (await calendarWithRefresh(
          ctx,
          authUserId,
          freshUser,
          "POST",
          "/calendars/primary/events",
          {
            summary: title,
            description: `Spaced repetition session ${session.sessionNumber} - ${session.cardCount} cards to review`,
            start: { dateTime: new Date(freeStart).toISOString() },
            end: { dateTime: new Date(freeStart + durationMs).toISOString() },
            reminders: {
              useDefault: false,
              overrides: [{ method: "popup", minutes: 10 }],
            },
          },
        )) as { id: string };

        if (event.id) {
          await ctx.runMutation(api.programSessions.setCalendarEvent, {
            sessionId: session.sessionId as never,
            calendarEventId: event.id,
          });
          if (Math.abs(freeStart - session.scheduledAt) > 60_000) {
            await ctx.runMutation(api.programSessions.reschedule, {
              sessionId: session.sessionId as never,
              scheduledAt: freeStart,
            });
          }
        }
      } catch {
        // Non-fatal
      }
    }

    return { connected: true };
  },
});

export const updateSessionEvent = action({
  args: {
    eventId: v.string(),
    scheduledAt: v.number(),
    durationMinutes: v.number(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return;
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    if (!user?.googleAccessToken) return;

    const startMs = args.scheduledAt;
    const endMs = startMs + args.durationMinutes * 60 * 1000;

    try {
      await calendarWithRefresh(
        ctx,
        authUserId,
        user,
        "PUT",
        `/calendars/primary/events/${args.eventId}`,
        {
          summary: args.title,
          description: args.description,
          start: { dateTime: new Date(startMs).toISOString() },
          end: { dateTime: new Date(endMs).toISOString() },
          reminders: {
            useDefault: false,
            overrides: [{ method: "popup", minutes: 10 }],
          },
        },
      );
    } catch {
      // Non-fatal
    }
  },
});

export const deleteCalendarEvents = action({
  args: { calendarEventIds: v.array(v.string()) },
  handler: async (ctx, args): Promise<void> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return;
    const user = (await ctx.runQuery(api.users.getMe)) as Doc<"users"> | null;
    if (!user?.googleAccessToken) return;
    for (const eventId of args.calendarEventIds) {
      try {
        await calendarWithRefresh(ctx, authUserId, user, "DELETE", `/calendars/primary/events/${eventId}`);
      } catch {
        // Non-fatal — event may already be deleted
      }
    }
  },
});
