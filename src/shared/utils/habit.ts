// src/shared/utils/habit.ts
import { ProgressAttemptDto } from "../../api/types/progress";

export function buildHabit(attempts: ProgressAttemptDto[], days = 7) {
  const today = new Date();
  const map = new Map<string, number>();

  attempts.forEach((a) => {
    const d = a.createdAt.slice(0, 10);
    map.set(d, (map.get(d) ?? 0) + 1);
  });

  const result = [];
  let streak = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    let state: "done" | "missed" | "today" | "future";

    if (key > today.toISOString().slice(0, 10)) {
      state = "future";
    } else if (key === today.toISOString().slice(0, 10)) {
      state = map.has(key) ? "done" : "today";
    } else {
      state = map.has(key) ? "done" : "missed";
    }

    result.push({ date: key, state });
  }

  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i].state === "done") streak++;
    else break;
  }

  return { days: result, streak };
}
