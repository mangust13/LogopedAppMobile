// src\screens\games\GamesEntry.tsx

import { GamesStack } from "../../navigation/games/GamesStack";
import { useAuthStore } from "../../store/authStore";

export function GamesEntry() {
  const role = useAuthStore((s) => s.role);
  return <GamesStack actor={role === "Logoped" ? "Logoped" : "User"} />;
}
