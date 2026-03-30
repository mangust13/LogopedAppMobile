// api/exercisesApi.ts - додаємо метод assignComplexToChildren
import { http } from "./http";
import {
  ExerciseDto,
  ExerciseTagDto,
  ComplexDto,
  CreateComplexRequest,
  ComplexAssignmentDto,
} from "./types/exercise";

export const exercisesApi = {
  getAll: async () => {
    const res = await http.get<ExerciseDto[]>("/exercises/all");
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
    const response = await http.get("/exercises/complexes");
    return response.data;
  },

  getAssignedComplexes: async (): Promise<ComplexDto[]> => {
    const response = await http.get("/exercises/complexes/assigned");
    return response.data;
  },

  getPublicComplexes: async (): Promise<ComplexDto[]> => {
    const response = await http.get("/exercises/complexes/public");
    return response.data;
  },

  getComplexById: async (id: number): Promise<ComplexDto> => {
    const response = await http.get(`/exercises/complexes/${id}`);
    return response.data;
  },

  getPublicComplexById: async (id: number): Promise<ComplexDto> => {
    const response = await http.get(`/exercises/complexes/public/${id}`);
    return response.data;
  },

  createComplex: async (data: CreateComplexRequest): Promise<ComplexDto> => {
    const response = await http.post("/exercises/complexes", data);
    return response.data;
  },

  updateComplex: async (
    id: number,
    data: CreateComplexRequest,
  ): Promise<ComplexDto> => {
    const response = await http.put(`/exercises/complexes/${id}`, data);
    return response.data;
  },

  assignComplexToChildren: async (
    complexId: number,
    childIds: number[],
  ): Promise<void> => {
    await http.post(`/exercises/complexes/${complexId}/assign`, { childIds });
  },

  deleteComplex: async (id: number): Promise<void> => {
    await http.delete(`/exercises/complexes/${id}`);
  },

  getChildAssignments: async (
    childId: number,
  ): Promise<ComplexAssignmentDto[]> => {
    const response = await http.get(
      `/exercises/complexes/assignments/child/${childId}`,
    );
    return response.data;
  },
};
