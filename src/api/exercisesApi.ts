// src/api/exercisesApi.ts
import { http } from "./http";
import {
  ExerciseDto,
  ExerciseMainCategoryDto,
  ExerciseTagDto,
} from "./types/exercise";

export const exercisesApi = {
  getAll: async () => {
    const res = await http.get<ExerciseDto[]>("/exercises");
    return res.data;
  },

  getMainCategories: async () => {
    const res = await http.get<ExerciseMainCategoryDto[]>(
      "/exercises/categories",
    );
    return res.data;
  },

  getByCategory: async (categoryName: string) => {
    const res = await http.get<ExerciseDto[]>(
      `/exercises/categories/${categoryName}`,
    );
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

  getById: async (id: number) => {
    const res = await http.get<ExerciseDto>(`/exercises/${id}`);
    return res.data;
  },
};
