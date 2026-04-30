import { http } from "./http";
import { ENV } from "../config/env";

export type SoundCardDto = {
  id: number;
  sound: string;
  word: string;
  imageFile: string;
  isAlive: boolean;
  position: {
    code: number;
    displayName: string;
  };
  imageUrl: string;
};

export const soundCardsApi = {
  getBySound: async (sound: string): Promise<SoundCardDto[]> => {
    const res = await http.get<SoundCardDto[]>("/exercises/sound-cards", {
      params: { sound },
    });

    return res.data.map((c) => ({
      ...c,
      imageUrl: `${ENV.API_BASE_URL}/exercises${c.imageUrl}`,
    }));
  },
};
