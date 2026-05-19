// src/store/authStore.ts
import { create } from "zustand";
import { tokenStorage } from "../storage/tokenStorage";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/authApi";
import { setHttpToken, setUnauthorizedHandler } from "../api/http";
import { userApi } from "../api/userApi";

type UserRole = "User" | "Logoped";

type AuthState = {
  token: string | null;
  role: UserRole | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isHydrated: boolean;
  setAuth: (
    token: string,
    role: UserRole,
    email?: string | null,
  ) => Promise<void>;
  setProfile: (firstName: string | null, lastName: string | null) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hydrate: () => Promise<void>;
  isTokenValid: () => boolean;
};

const decodeEmailFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<{
      email?: string;
      unique_name?: string;
      sub?: string;
    }>(token);
    return decoded.email ?? decoded.unique_name ?? decoded.sub ?? null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  role: null,
  email: null,
  firstName: null,
  lastName: null,
  isHydrated: false,

  setAuth: async (token, role, email) => {
    await tokenStorage.save(token, role);
    setHttpToken(token);
    set({ token, role, email: email ?? decodeEmailFromToken(token) });

    try {
      const me = await userApi.getMe();
      set({ firstName: me.firstName ?? null, lastName: me.lastName ?? null });
    } catch {}
  },

  setProfile: (firstName, lastName) => {
    set({ firstName, lastName });
  },

  logout: async () => {
    await tokenStorage.clear();
    setHttpToken(null);
    set({
      token: null,
      role: null,
      email: null,
      firstName: null,
      lastName: null,
    });
  },

  deleteAccount: async () => {
    await authApi.deleteAccount();
    await tokenStorage.clear();
    setHttpToken(null);
    set({
      token: null,
      role: null,
      email: null,
      firstName: null,
      lastName: null,
    });
  },

  hydrate: async () => {
    const data = await tokenStorage.load();

    if (data) {
      setHttpToken(data.token);
      set({
        token: data.token,
        role: data.role,
        email: decodeEmailFromToken(data.token),
      });

      try {
        const me = await userApi.getMe();
        set({ firstName: me.firstName ?? null, lastName: me.lastName ?? null });
      } catch {}
    } else {
      setHttpToken(null);
    }

    set({ isHydrated: true });
  },

  isTokenValid: () => {
    const { token } = get();
    if (!token) return false;
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },
}));

setUnauthorizedHandler(async () => {
  await useAuthStore.getState().logout();
});
