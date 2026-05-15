/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as courses from "../courses.js";
import type * as files from "../files.js";
import type * as flashcards from "../flashcards.js";
import type * as googleCalendar from "../googleCalendar.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as programSessions from "../programSessions.js";
import type * as programs from "../programs.js";
import type * as push from "../push.js";
import type * as pushSend from "../pushSend.js";
import type * as studySessions from "../studySessions.js";
import type * as topics from "../topics.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  courses: typeof courses;
  files: typeof files;
  flashcards: typeof flashcards;
  googleCalendar: typeof googleCalendar;
  http: typeof http;
  migrations: typeof migrations;
  notifications: typeof notifications;
  programSessions: typeof programSessions;
  programs: typeof programs;
  push: typeof push;
  pushSend: typeof pushSend;
  studySessions: typeof studySessions;
  topics: typeof topics;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
