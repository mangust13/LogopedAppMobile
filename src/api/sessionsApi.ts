import { http } from "./http";

export type CreateSessionDto = {
  childId: number;
  date: string;
  durationMinutes?: number;
  notes?: string;
  soundsWorkedOn?: string;
};

export type UpdateSessionDto = {
  date: string;
  durationMinutes?: number;
  notes?: string;
  soundsWorkedOn?: string;
};

export type SessionDto = {
  id: number;
  childId: number;
  date: string;
  durationMinutes?: number;
  notes?: string;
  soundsWorkedOn: string[];
  createdAt: string;
};

export const sessionsApi = {
  create: async (dto: CreateSessionDto): Promise<SessionDto> => {
    const res = await http.post<SessionDto>("/progress/sessions", dto);
    return res.data;
  },

  update: async (
    sessionId: number,
    dto: UpdateSessionDto,
  ): Promise<SessionDto> => {
    const res = await http.put<SessionDto>(
      `/progress/sessions/${sessionId}`,
      dto,
    );
    return res.data;
  },

  delete: async (sessionId: number): Promise<void> => {
    await http.delete(`/progress/sessions/${sessionId}`);
  },

  getMySessions: async (childId?: number): Promise<SessionDto[]> => {
    const res = await http.get<SessionDto[]>("/progress/sessions/my", {
      params: childId ? { childId } : undefined,
    });
    return res.data;
  },

  getByChild: async (childId: number): Promise<SessionDto[]> => {
    const res = await http.get<SessionDto[]>(
      `/progress/sessions/child/${childId}`,
    );
    return res.data;
  },
};
