import { http } from "./http";
import { ChildDto } from "./types/child";

export type CreateChildRequest = {
  name: string;
  birthDate: string;
  problemSounds: string;
};

export type UpdateChildProfileDto = {
  name: string;
  birthDate: string;
  problemSounds?: string | null;
};

export const childrenApi = {
  getMyChildren: async () => {
    const res = await http.get<ChildDto[]>("/users/children");
    return res.data;
  },

  createChild: async (data: CreateChildRequest) => {
    await http.post("/users/children", data);
  },

  updateChild: async (childId: string, dto: UpdateChildProfileDto) => {
    await http.put(`/users/children/${childId}`, dto);
  },

  deleteChild: async (childId: string) => {
    await http.delete(`/users/children/${childId}`);
  },

  assignLogoped: async (childId: string, logopedEmail: string) => {
    await http.post(`/users/children/${childId}/assign-logoped`, {
      logopedEmail,
    });
  },
};
