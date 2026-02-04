//src\screens\tabs\ProfileEntry.tsx
import { useAuthStore } from "../../store/authStore";
import { ParentProfileScreen } from "../parent/profile/ParentProfileScreen";
import { LogopedProfileScreen } from "../logoped/profile/LogopedProfileScreen";

export function ProfileEntry() {
  const role = useAuthStore((s) => s.role);

  if (role === "Logoped") {
    return <LogopedProfileScreen />;
  }

  return <ParentProfileScreen />;
}
