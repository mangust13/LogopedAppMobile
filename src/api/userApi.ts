import { http } from "./http";

export type MeDto = {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
};

export type UpdateProfileDto = {
  firstName?: string;
  lastName?: string;
};

export const userApi = {
  getMe: async (): Promise<MeDto> => {
    const res = await http.get<MeDto>("/users/me");
    return res.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<MeDto> => {
    const res = await http.put<MeDto>("/users/me/profile", dto);
    return res.data;
  },
};
