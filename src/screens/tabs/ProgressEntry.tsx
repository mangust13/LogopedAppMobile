// src/screens/tabs/ProgressEntry.tsx
import { useAuthStore } from "../../store/authStore";
import { ChildStatsScreen } from "../parent/stats/ChildProgressScreen";
import { LogopedStatsScreen } from "../logoped/stats/LogopedStatsScreen";

export function ProgressEntry() {
  const role = useAuthStore((s) => s.role);

  if (role === "Logoped") {
    return <LogopedStatsScreen />;
  }

  return <ChildStatsScreen />;
}
