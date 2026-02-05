//src\screens\tabs\HomeEntry.tsx
import { useAuthStore } from "../../store/authStore";
import { HomeParentScreen } from "../parent/home/HomeParentScreen";
import { HomeLogopedScreen } from "../logoped/home/HomeLogopedScreen";

export function HomeEntry() {
  const role = useAuthStore((s) => s.role);

  if (role === "Logoped") {
    return <HomeLogopedScreen />;
  }

  return <HomeParentScreen />;
}
