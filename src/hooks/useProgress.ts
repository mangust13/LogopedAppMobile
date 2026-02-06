import { useEffect, useState } from "react";
import { progressApi } from "../api/progressApi";
import {
  ProgressAttemptDto,
  ProgressSummaryDto,
  TrendPointDto,
} from "../api/types/progress";

type UseProgressResult = {
  summary: ProgressSummaryDto | null;
  last: ProgressAttemptDto[];
  trend: TrendPointDto[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useProgress(childId?: number): UseProgressResult {
  const [summary, setSummary] = useState<ProgressSummaryDto | null>(null);
  const [last, setLast] = useState<ProgressAttemptDto[]>([]);
  const [trend, setTrend] = useState<TrendPointDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const [summaryRes, lastRes, trendRes] = await Promise.all([
        progressApi.getSummary(id),
        progressApi.getLastAttempts(id),
        progressApi.getTrend(id),
      ]);

      setSummary(summaryRes);
      setLast(lastRes);
      setTrend(trendRes);
    } catch {
      setError("Не вдалося завантажити прогрес");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childId === undefined) {
      setSummary(null);
      setLast([]);
      setTrend([]);
      setLoading(false);
      setError(null);
      return;
    }

    load(childId);
  }, [childId]);

  return {
    summary,
    last,
    trend,
    loading,
    error,
    refresh: () => {
      if (childId !== undefined) {
        load(childId);
      }
    },
  };
}
