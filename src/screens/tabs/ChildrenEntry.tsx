import { useAuthStore } from "../../store/authStore";
import { ParentChildrenScreen } from "../parent/children/ParentChildrenScreen";
import { LogopedChildrenScreen } from "../logoped/children/LogopedChildrenScreen";

export function ChildrenEntry() {
  const role = useAuthStore((s) => s.role);

  return role === "Logoped" ? (
    <LogopedChildrenScreen />
  ) : (
    <ParentChildrenScreen />
  );
}
