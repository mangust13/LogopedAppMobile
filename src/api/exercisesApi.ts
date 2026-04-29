import { http } from "./http";

export type ExerciseDto = {
  id: number;
  title: string;
  description: string;
  videoPath: string;
  iconName: string;
  tags: ExerciseTagDto[];
};

export type ExerciseTagDto = {
  id: number;
  name: string;
  category: string;
  displayName: string;
};

export type ExerciseMainCategoryDto = {
  id: number;
  name: string;
  displayName: string;
  folderName: string;
  exerciseCount: number;
};

export interface ComplexDto {
  id: number;
  name: string;
  displayName: string;
  description: string;
  logopedId?: number | null;
  isDefault: boolean;
  createdAt: string;
  isActive: boolean;
  exerciseCount: number;
  exercises: ExerciseDto[];
}

export interface CreateComplexRequest {
  name: string;
  description: string;
  exerciseIds: number[];
}

export const exercisesApi = {
  getAll: async () => {
    const res = await http.get<ExerciseDto[]>("/exercises/all");
    return res.data;
  },

  getBySound: async (sound: string): Promise<ExerciseDto[]> => {
    const SOUND_TO_TAG: Record<string, string> = {
      а: "a",
      б: "b",
      в: "v",
      г: "h",
      ґ: "g",
      д: "d",
      дж: "dzh",
      дз: "dz",
      е: "e",
      ж: "zh",
      з: "z",
      и: "y",
      і: "i",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "kh",
      ц: "ts",
      ч: "ch",
      ш: "sh",
    };

    const tagCode = SOUND_TO_TAG[sound.toLowerCase()];

    const res = await http.get<ExerciseDto[]>("/exercises/all", {
      params: tagCode ? { sound: tagCode } : undefined,
    });

    return res.data;
  },

  getById: async (id: number) => {
    const res = await http.get<ExerciseDto>(`/exercises/${id}`);
    return res.data;
  },

  getTags: async () => {
    const res = await http.get<ExerciseTagDto[]>("/exercises/tags");
    return res.data;
  },

  getTagsByCategory: async (category: string) => {
    const res = await http.get<ExerciseTagDto[]>(`/exercises/tags/${category}`);
    return res.data;
  },

  getComplexes: async (): Promise<ComplexDto[]> => {
    const response = await http.get<ComplexDto[]>("/exercises/complexes");
    return response.data;
  },

  getAssignedComplexes: async (): Promise<ComplexDto[]> => {
    const response = await http.get<ComplexDto[]>(
      "/exercises/complexes/assigned",
    );
    return response.data;
  },

  getComplexById: async (id: number): Promise<ComplexDto> => {
    const response = await http.get<ComplexDto>(`/exercises/complexes/${id}`);
    return response.data;
  },

  createComplex: async (data: CreateComplexRequest): Promise<ComplexDto> => {
    const response = await http.post<ComplexDto>("/exercises/complexes", data);
    return response.data;
  },

  updateComplex: async (
    id: number,
    data: CreateComplexRequest,
  ): Promise<ComplexDto> => {
    const response = await http.put<ComplexDto>(
      `/exercises/complexes/${id}`,
      data,
    );
    return response.data;
  },

  assignComplexToChildren: async (
    complexId: number,
    childIds: number[],
  ): Promise<void> => {
    await http.post(`/exercises/complexes/${complexId}/assign`, {
      childIds,
    });
  },

  getAssignedChildIds: async (complexId: number): Promise<number[]> => {
    const response = await http.get<number[]>(
      `/exercises/complexes/${complexId}/assigned-children`,
    );
    return response.data;
  },

  deleteComplex: async (id: number): Promise<void> => {
    await http.delete(`/exercises/complexes/${id}`);
  },
};
