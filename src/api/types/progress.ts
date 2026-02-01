// src/api/types/progress.ts

export type ProgressSummaryDto = {
  childId: number;
  totalAttempts: number;
  avgAccuracy: number;
  lastActivityAt?: string | null;
};

export type ProgressAttemptDto = {
  id: number;
  exerciseId: number;
  exerciseName: string;
  accuracy?: number | null;
  createdAt: string;
};

export type TrendPointDto = {
  date: string; // ISO or YYYY-MM-DD
  value: number;
};
