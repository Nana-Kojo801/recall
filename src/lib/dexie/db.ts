import Dexie, { type Table } from "dexie";

export interface LocalCourse {
  id: string;
  userId: string;
  name: string;
  code: string;
  color: string;
  _creationTime: number;
  synced?: boolean;
}

export interface LocalTopic {
  id: string;
  courseId: string;
  userId: string;
  name: string;
  lastStudied?: number;
  nextReview?: number;
  _creationTime: number;
  synced?: boolean;
}

export interface LocalFlashcard {
  id: string;
  topicId: string;
  userId: string;
  front: string;
  back: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: number;
  lastRating?: string;
  _creationTime: number;
  synced?: boolean;
}

export interface SyncQueueItem {
  id?: number;
  type: "create_course" | "create_topic" | "rate_card" | "complete_session";
  payload: Record<string, unknown>;
  createdAt: number;
  retries: number;
}

export class RecallDB extends Dexie {
  courses!: Table<LocalCourse>;
  topics!: Table<LocalTopic>;
  flashcards!: Table<LocalFlashcard>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("recall-db");
    this.version(1).stores({
      courses: "id, userId",
      topics: "id, courseId, userId",
      flashcards: "id, topicId, userId, nextReview",
      syncQueue: "++id, type, createdAt",
    });
  }
}

export const db = new RecallDB();
