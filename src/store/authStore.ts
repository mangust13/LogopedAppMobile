import { create } from "zustand";
import { tokenStorage } from "../storage/tokenStorage";
import { jwtDecode } from "jwt-decode";

type UserRole = "User" | "Logoped";

type AuthState = {
  token: string | null;
  role: UserRole | null;
  email: string | null;
  isHydrated: boolean;
  setAuth: (
    token: string,
    role: UserRole,
    email?: string | null,
  ) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  isTokenValid: () => boolean;
};

const decodeEmailFromToken = (token: string): string | null => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
      return null;
    }

    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    if (typeof atob !== "function") {
      return null;
    }
    const payloadString = atob(padded);
    const payload = JSON.parse(payloadString) as {
      email?: string;
      sub?: string;
      unique_name?: string;
    };

    return payload.email ?? payload.unique_name ?? payload.sub ?? null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  role: null,
  email: null,
  isHydrated: false,

  setAuth: async (token, role, email) => {
    await tokenStorage.save(token, role);
    set({ token, role, email: email ?? decodeEmailFromToken(token) });
  },

  logout: async () => {
    await tokenStorage.clear();
    set({ token: null, role: null, email: null });
  },

  hydrate: async () => {
    const data = await tokenStorage.load();
    if (data) {
      set({
        token: data.token,
        role: data.role,
        email: decodeEmailFromToken(data.token),
      });
    }
    set({ isHydrated: true });
  },

  isTokenValid: () => {
    const { token } = get();
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },
}));
