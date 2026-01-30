import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";

export const tokenStorage = {
  save: async (token: string, role: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(ROLE_KEY, role);
  },

  load: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const role = await SecureStore.getItemAsync(ROLE_KEY);

    if (!token || !role) return null;

    return { token, role: role as "User" | "Logoped" };
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
  },
};
