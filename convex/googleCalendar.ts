"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

async function clerkOAuthTokens(clerkId: string, secretKey: string) {
  const res = await fetch(
    `https://api.clerk.com/v1/users/${clerkId}/oauth_access_tokens/oauth_google`,
    { headers: { Authorization: `Bearer ${secretKey}` } }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Clerk API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<Array<{ token: string; scopes: string[] }>>;
}

async function getToken(clerkId: string, secretKey: string): Promise<string> {
  const tokens = await clerkOAuthTokens(clerkId, secretKey);
  if (!tokens.length || !tokens[0].token) {
    throw new Error("No Google OAuth token found");
  }
  return tokens[0].token;
}

async function calendarRequest(token: string, method: string, path: string, body?: unknown) {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar API ${res.status}: ${text}`);
  }
  return method === "DELETE" ? null : res.json();
}

async function findFreeSlot(
  token: string,
  idealStartMs: number,
  durationMs: number
): Promise<number> {
  const windowStart = idealStartMs - 2 * 60 * 60 * 1000;
  const windowEnd = idealStartMs + 2 * 60 * 60 * 1000;

  const freeBusy = await calendarRequest(token, "POST", "/freeBusy", {
    timeMin: new Date(windowStart).toISOString(),
    timeMax: new Date(windowEnd).toISOString(),
    items: [{ id: "primary" }],
  }) as { calendars: { primary: { busy: { start: string; end: string }[] } } };

  const busy = freeBusy.calendars?.primary?.busy ?? [];
  const busyIntervals = busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));

  // Try ideal time first, then scan forward from window start
  const candidates = [idealStartMs];
  for (let t = windowStart; t <= windowEnd - durationMs; t += 15 * 60 * 1000) {
    if (t !== idealStartMs) candidates.push(t);
  }

  for (const start of candidates.sort((a, b) => Math.abs(a - idealStartMs) - Math.abs(b - idealStartMs))) {
    const end = start + durationMs;
    const hasConflict = busyIntervals.some((b) => start < b.end && end > b.start);
    if (!hasConflict) return start;
  }

  return idealStartMs; // fallback to ideal if no free slot
}

export const deleteTopicEvents = action({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args): Promise<void> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return;
    let token: string;
    try {
      token = await getToken(identity.subject, secretKey);
    } catch {
      return;
    }
    const sessions = await ctx.runQuery(api.programSessions.listByTopic, { topicId: args.topicId });
    for (const s of sessions) {
      if (s.calendarEventId) {
        try {
          await calendarRequest(token, "DELETE", `/calendars/primary/events/${s.calendarEventId}`);
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return false;
    try {
      const tokens = await clerkOAuthTokens(identity.subject, secretKey);
      return tokens.length > 0 && tokens[0].token.length > 0;
    } catch {
      return false;
    }
  },
});

export const getCalendarToken = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("CLERK_SECRET_KEY not set in Convex env");
    return getToken(identity.subject, secretKey);
  },
});

export const fetchUpcomingEvents = action({
  args: { calendarId: v.optional(v.string()) },
  handler: async (ctx, { calendarId = "primary" }): Promise<unknown> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("CLERK_SECRET_KEY not set in Convex env");
    let token: string;
    try {
      token = await getToken(identity.subject, secretKey);
    } catch (err) {
      const msg = String(err);
      if (msg.includes("oauth_missing_refresh_token") || msg.includes("Cannot refresh") || msg.includes("422")) {
        return { items: [], error: "oauth_expired" };
      }
      throw err;
    }
    const now = new Date().toISOString();
    const future = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const url = `/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${now}&timeMax=${future}&singleEvents=true&orderBy=startTime&maxResults=50`;
    return calendarRequest(token, "GET", url);
  },
});

export const createProgramEvents = action({
  args: {
    programId: v.id("programs"),
    sessions: v.array(v.object({
      sessionId: v.string(),
      sessionNumber: v.number(),
      scheduledAt: v.number(),
      cardCount: v.number(),
    })),
    courseCode: v.string(),
    topicName: v.string(),
  },
  handler: async (ctx, args): Promise<{ connected: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return { connected: false };

    let token: string;
    try {
      token = await getToken(identity.subject, secretKey);
    } catch {
      return { connected: false };
    }

    const title = `Recall: ${args.courseCode} - ${args.topicName}`;

    for (const session of args.sessions) {
      try {
        const durationMs = Math.max(10, session.cardCount) * 60 * 1000;
        const freeStart = await findFreeSlot(token, session.scheduledAt, durationMs);

        const event = await calendarRequest(token, "POST", "/calendars/primary/events", {
          summary: title,
          description: `Spaced repetition session ${session.sessionNumber} - ${session.cardCount} cards to review`,
          start: { dateTime: new Date(freeStart).toISOString() },
          end: { dateTime: new Date(freeStart + durationMs).toISOString() },
          reminders: {
            useDefault: false,
            overrides: [{ method: "popup", minutes: 10 }],
          },
        }) as { id: string };

        if (event.id) {
          await ctx.runMutation(api.programSessions.setCalendarEvent, {
            sessionId: session.sessionId as never,
            calendarEventId: event.id,
          });
          // If free slot differs from scheduled, update Convex record
          if (Math.abs(freeStart - session.scheduledAt) > 60_000) {
            await ctx.runMutation(api.programSessions.reschedule, {
              sessionId: session.sessionId as never,
              scheduledAt: freeStart,
            });
          }
        }
      } catch {
        // Non-fatal: calendar event creation failed for this session
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return;

    let token: string;
    try {
      token = await getToken(identity.subject, secretKey);
    } catch {
      return;
    }

    const startMs = args.scheduledAt;
    const endMs = startMs + args.durationMinutes * 60 * 1000;

    try {
      await calendarRequest(token, "PUT", `/calendars/primary/events/${args.eventId}`, {
        summary: args.title,
        description: args.description,
        start: { dateTime: new Date(startMs).toISOString() },
        end: { dateTime: new Date(endMs).toISOString() },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 10 }],
        },
      });
    } catch {
      // Non-fatal
    }
  },
});
