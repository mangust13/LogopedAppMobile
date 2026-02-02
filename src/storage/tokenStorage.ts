import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";

const isWeb = Platform.OS === "web";

export const tokenStorage = {
  save: async (token: string, role: string) => {
    if (isWeb) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ROLE_KEY, role);
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(ROLE_KEY, role);
  },

  load: async () => {
    let token: string | null;
    let role: string | null;

    if (isWeb) {
      token = localStorage.getItem(TOKEN_KEY);
      role = localStorage.getItem(ROLE_KEY);
    } else {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
      role = await SecureStore.getItemAsync(ROLE_KEY);
    }

    if (!token || !role) return null;

    return { token, role: role as "User" | "Logoped" };
  },

  clear: async () => {
    if (isWeb) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
  },
};
