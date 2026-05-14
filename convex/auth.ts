import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
      // Forward OAuth tokens via the profile so createOrUpdateUser can store them.
      // The profile function receives (googleProfile, tokens) from Auth.js.
      profile(googleProfile, tokens) {
        return {
          id: String(googleProfile.sub),
          name: googleProfile.name as string | undefined,
          email: googleProfile.email as string | undefined,
          image: googleProfile.picture as string | undefined,
          googleAccessToken: (tokens as Record<string, unknown>).access_token as string | undefined,
          googleRefreshToken: (tokens as Record<string, unknown>).refresh_token as string | undefined,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const { existingUserId, profile } = args;
      const email = profile.email as string | undefined;
      const googleAccessToken = profile.googleAccessToken as string | undefined;
      const googleRefreshToken = profile.googleRefreshToken as string | undefined;

      const tokenUpdates = {
        googleAccessToken,
        ...(googleRefreshToken ? { googleRefreshToken } : {}),
      };

      if (existingUserId) {
        const existing = await ctx.db.get(existingUserId);
        await ctx.db.patch(existingUserId, {
          name: profile.name as string | undefined,
          email,
          imageUrl: profile.image as string | undefined,
          googleAccessToken: tokenUpdates.googleAccessToken,
          ...(googleRefreshToken
            ? { googleRefreshToken }
            : { googleRefreshToken: (existing as Record<string, unknown> | null)?.googleRefreshToken as string | undefined }),
        });
        return existingUserId;
      }

      // Migration path: find existing Clerk-era user by email
      if (email) {
        const existingByEmail = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", email))
          .first();

        if (existingByEmail) {
          await ctx.db.patch(existingByEmail._id, {
            name: profile.name as string | undefined,
            imageUrl: profile.image as string | undefined,
            googleAccessToken: tokenUpdates.googleAccessToken,
            ...(googleRefreshToken
              ? { googleRefreshToken }
              : {}),
          });

          // Remap old Clerk userId to new Convex Auth tokenIdentifier
          const clerkId = (existingByEmail as Record<string, unknown>).clerkId as string | undefined;
          if (clerkId) {
            const clerkIssuer = "https://living-gelding-70.clerk.accounts.dev";
            const oldTokenId = `${clerkIssuer}|${clerkId}`;
            const newTokenId = `${process.env.CONVEX_SITE_URL}|${existingByEmail._id}`;

            // Inline remap: update userId across all tables
            const tables = [
              "courses",
              "topics",
              "flashcards",
              "programs",
              "studySessions",
              "materialUploads",
            ] as const;

            for (const table of tables) {
              const docs = await ctx.db
                .query(table)
                .filter((q) => q.eq(q.field("userId"), oldTokenId))
                .collect();
              for (const doc of docs) {
                await ctx.db.patch(doc._id, { userId: newTokenId });
              }
            }

            // programSessions: filter by userId (no typed index access in this ctx)
            const pSessions = await ctx.db
              .query("programSessions")
              .filter((q) => q.eq(q.field("userId"), oldTokenId))
              .collect();
            for (const s of pSessions) {
              await ctx.db.patch(s._id, { userId: newTokenId });
            }
          }

          return existingByEmail._id;
        }
      }

      return ctx.db.insert("users", {
        name: profile.name as string | undefined,
        email,
        imageUrl: profile.image as string | undefined,
        ...tokenUpdates,
      });
    },
  },
});
