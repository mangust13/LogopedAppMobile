import { http } from "./http";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  role: "User" | "Logoped";
};

export type AuthResponse = {
  token: string;
  role: "User" | "Logoped";
};

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/users/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/users/register", data);
    return res.data;
  },
};
