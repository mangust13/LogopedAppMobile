import { http } from "./http";

export type AnalyzeResponse = {
  recognized_text: string;
  expected_text: string;
  accuracy_score: number;
  pronunciation_score: number;
  completeness_score: number;
  fluency_score: number;
  is_correct: boolean;
  target_sound: string;
  words: {
    word: string;
    accuracy_score: number;
    error_type: string;
    phonemes: {
      phoneme: string;
      accuracy_score: number;
    }[];
  }[];
};

export type SoundWordDto = {
  sound: string;
  word: string;
  position: string;
};

export const speechApi = {
  getSoundWords: async (): Promise<SoundWordDto[]> => {
    const res = await http.get<SoundWordDto[]>("/speech/sound-words");
    return res.data;
  },

  analyze: async (
    audioUri: string,
    expectedWord: string,
    targetSound: string,
  ): Promise<AnalyzeResponse> => {
    const formData = new FormData();

    formData.append("audio", {
      uri: audioUri,
      name: "recording.wav",
      type: "audio/wav",
    } as any);

    formData.append("expected_word", expectedWord);
    formData.append("target_sound", targetSound);

    const res = await http.post<AnalyzeResponse>("/speech/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });

    return res.data;
  },
};
