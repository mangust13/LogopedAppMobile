import { http } from "./http";
import { ChildDto, UpdateChildProfileDto } from "./childrenApi";

export type LogopedDto = {
  id: string;
  email: string;
  name?: string;
};

type RawChildDto = Partial<ChildDto> & {
  Id?: number;
  Name?: string;
  BirthDate?: string;
  ProblemSounds?: string | null;
  LogopedEmail?: string | null;
  AvatarUrl?: string | null;
  childId?: number;
  childName?: string;
  childBirthDate?: string;
};

const normalizeChild = (child: RawChildDto): ChildDto => ({
  id: child.id ?? child.Id ?? child.childId ?? 0,
  name: child.name ?? child.Name ?? child.childName ?? "Без імені",
  birthDate: child.birthDate ?? child.BirthDate ?? child.childBirthDate ?? "",
  problemSounds: child.problemSounds ?? child.ProblemSounds ?? "",
  logopedEmail: child.logopedEmail ?? child.LogopedEmail ?? null,
  avatarUrl: child.avatarUrl ?? child.AvatarUrl ?? null,
});

export const logopedApi = {
  getAll: async () => {
    const res = await http.get<LogopedDto[]>("/users/logoped/logopeds");
    return res.data;
  },

  getLogopedChildren: async () => {
    const res = await http.get<RawChildDto[]>("/users/logoped/children");
    return res.data.map(normalizeChild);
  },

  updateLogopedChild: async (childId: number, dto: UpdateChildProfileDto) => {
    await http.put(`/users/logoped/children/${childId}`, dto);
  },
};
