import { http } from "./http";

export type StreakDto = {
  currentStreak: number;
  longestStreak: number;
  activeToday: boolean;
  totalActiveDays: number;
};

export type InactiveChildDto = {
  childId: number;
  daysInactive: number;
};

export const activityApi = {
  track: async (childId: number, activityType: "Game" | "Exercise") => {
    await http.post("/progress/activity/track", { childId, activityType });
  },

  getStreak: async (childId: number): Promise<StreakDto> => {
    const res = await http.get<StreakDto>("/progress/activity/streak", {
      params: { childId },
    });
    return res.data;
  },

  getActiveDates: async (childId: number): Promise<string[]> => {
    const res = await http.get<string[]>("/progress/activity/dates", {
      params: { childId },
    });
    return res.data;
  },

  getInactiveChildren: async (
    childIds: number[],
    thresholdDays: number = 3,
  ): Promise<InactiveChildDto[]> => {
    const res = await http.post<InactiveChildDto[]>(
      "/progress/activity/inactive",
      {
        childIds,
        thresholdDays,
      },
    );
    return res.data;
  },
};
