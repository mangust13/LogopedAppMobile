import { http } from "./http";
import { ChildDto, UpdateChildProfileDto } from "./childrenApi";

export type LogopedDto = {
  id: string;
  email: string;
  name?: string;
};

export const logopedApi = {
  getAll: async () => {
    const res = await http.get<LogopedDto[]>("/users/logoped/logopeds");
    return res.data;
  },

  getLogopedChildren: async () => {
    const res = await http.get<ChildDto[]>("/users/logoped/children");
    return res.data;
  },

  updateLogopedChild: async (childId: number, dto: UpdateChildProfileDto) => {
    await http.put(`/users/logoped/children/${childId}`, dto);
  },
};
