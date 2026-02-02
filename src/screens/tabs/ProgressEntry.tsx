// src/screens/tabs/ProgressEntry.tsx
import { useAuthStore } from "../../store/authStore";
import { ChildProgressScreen } from "../parent/progress/ChildProgressScreen";
import { LogopedStatsScreen } from "../logoped/analytics/LogopedStatsScreen";

export function ProgressEntry() {
  const role = useAuthStore((s) => s.role);

  if (role === "Logoped") {
    return <LogopedStatsScreen />;
  }

  return <ChildProgressScreen />;
}
