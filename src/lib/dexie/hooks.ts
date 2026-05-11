import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

export function useLocalCourses(userId: string) {
  return useLiveQuery(() => db.courses.where("userId").equals(userId).toArray(), [userId]);
}

export function useLocalTopics(courseId: string) {
  return useLiveQuery(() => db.topics.where("courseId").equals(courseId).toArray(), [courseId]);
}

export function useLocalFlashcards(topicId: string) {
  return useLiveQuery(() => db.flashcards.where("topicId").equals(topicId).toArray(), [topicId]);
}

export function useDueFlashcards(topicId: string) {
  const now = Date.now();
  return useLiveQuery(
    () => db.flashcards.where("topicId").equals(topicId).and((c) => c.nextReview <= now).toArray(),
    [topicId]
  );
}
