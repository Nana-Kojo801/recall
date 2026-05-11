export type Rating = "hard" | "okay" | "easy";

export interface CardState {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: number;
}

const MIN_EASE = 1.3;

export function applyRating(card: CardState, rating: Rating): CardState {
  let { interval, easeFactor, repetitions } = card;
  const now = Date.now();

  if (rating === "hard") {
    interval = 10 * 60 * 1000; // 10 minutes
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
    repetitions = 0;
  } else if (rating === "okay") {
    interval = 60 * 60 * 1000; // 1 hour
    repetitions += 1;
  } else {
    // easy
    if (repetitions === 0) {
      interval = 24 * 60 * 60 * 1000; // 1 day
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.min(3.0, easeFactor + 0.1);
    repetitions += 1;
  }

  return {
    interval,
    easeFactor,
    repetitions,
    nextReview: now + interval,
  };
}

export function getNextReviewLabel(nextReview: number): string {
  const diff = nextReview - Date.now();
  if (diff <= 0) return "Now";
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(diff / 3600000);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(diff / 86400000);
  return `${days}d`;
}
