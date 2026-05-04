import { http } from "./http";

export type CompleteGameDto = {
  childId: number;
  sound: string;
  positionCode: number;
  gameType: string;
};

export type GameStatusDto = {
  gameType: string;
  displayName: string;
  isCompleted: boolean;
};

export type PositionStatusDto = {
  positionCode: number;
  displayName: string;
  isUnlocked: boolean;
  games: GameStatusDto[];
};

export type SoundRoadmapDto = {
  sound: string;
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  positions: PositionStatusDto[];
};

export type SoundProgressSummaryDto = {
  sound: string;
  progressPercent: number;
};

export const progressApi = {
  completeGame: async (dto: CompleteGameDto): Promise<void> => {
    await http.post("/progress/game-progress/complete", dto);
  },

  getRoadmap: async (
    childId: number,
    sound: string,
  ): Promise<SoundRoadmapDto> => {
    const res = await http.get<SoundRoadmapDto>(
      "/progress/game-progress/roadmap",
      { params: { childId, sound } },
    );
    return res.data;
  },

  getSoundsSummary: async (
    childId: number,
    sounds: string[],
  ): Promise<SoundProgressSummaryDto[]> => {
    const res = await http.get<SoundProgressSummaryDto[]>(
      "/progress/game-progress/summary",
      { params: { childId, sounds: sounds.join(",") } },
    );
    return res.data;
  },
};
