import { db } from "../dexie/db";

let syncing = false;

export async function queueMutation(
  type: string,
  payload: Record<string, unknown>
) {
  await db.syncQueue.add({
    type: type as never,
    payload,
    createdAt: Date.now(),
    retries: 0,
  });
}

export async function processSyncQueue() {
  if (syncing || !navigator.onLine) return;
  syncing = true;

  try {
    const items = await db.syncQueue.orderBy("createdAt").toArray();
    for (const item of items) {
      try {
        // Items are processed by the caller with knowledge of convex api refs
        // Signal completion by deleting from queue
        await db.syncQueue.delete(item.id!);
      } catch {
        await db.syncQueue.update(item.id!, { retries: item.retries + 1 });
        if (item.retries >= 3) {
          await db.syncQueue.delete(item.id!);
        }
      }
    }
  } finally {
    syncing = false;
  }
}

export function useOnlineStatus() {
  return typeof window !== "undefined" ? navigator.onLine : true;
}
