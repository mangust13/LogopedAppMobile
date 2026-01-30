import { create } from "zustand";
import { tokenStorage } from "../storage/tokenStorage";

type UserRole = "User" | "Logoped";

type AuthState = {
  token: string | null;
  role: UserRole | null;
  isHydrated: boolean;
  setAuth: (token: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isHydrated: false,

  setAuth: async (token, role) => {
    await tokenStorage.save(token, role);
    set({ token, role });
  },

  logout: async () => {
    await tokenStorage.clear();
    set({ token: null, role: null });
  },

  hydrate: async () => {
    const data = await tokenStorage.load();
    if (data) {
      set({ token: data.token, role: data.role });
    }
    set({ isHydrated: true });
  },
}));
