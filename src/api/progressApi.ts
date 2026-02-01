// src/api/progressApi.ts
import { http } from './http';
import {
  ProgressSummaryDto,
  ProgressAttemptDto,
  TrendPointDto,
} from './types/progress';

export const progressApi = {
  async getSummary(childId: number){
    const res = await http.get<ProgressSummaryDto>(
      `/progress/child/${childId}/summary`
    );
    return res.data;
  },

  async getLastAttempts(
    childId: number,
    limit = 10
  ) {
    const res = await http.get<ProgressAttemptDto[]>(
      `/progress/child/${childId}/last`,
      { params: { limit } }
    );
    return res.data;
  },

  async getTrend(
    childId: number,
    days = 14
  ): Promise<TrendPointDto[]> {
    try {
      const res = await http.get<TrendPointDto[]>(
        `/progress/child/${childId}/trend`,
        { params: { days } }
      );
      return res.data;
    } catch {
      // мок, щоб екран жив
      return mockTrend(days);
    }
  },
};

// ---------- MOCKS ----------

function mockTrend(days: number): TrendPointDto[] {
  const today = new Date();

  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - i));

    return {
      date: d.toISOString().slice(0, 10),
      value: 60 + Math.round(Math.random() * 30),
    };
  });
}
