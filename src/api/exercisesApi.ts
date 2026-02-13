import { http } from "./http";
import {
  ExerciseDto,
  ComplexDto,
  CreateComplexDto,
  AssignHomeworkDto,
} from "./types/exercise";

export const exercisesApi = {
  getAll: async () => {
    const res = await http.get<ExerciseDto[]>("/exercises");
    return res.data;
  },

  createComplex: async (data: CreateComplexDto) => {
    const res = await http.post("/exercises/complexes", data);
    return res.data;
  },

  getMyComplexes: async () => {
    const res = await http.get<ComplexDto[]>("/exercises/complexes/my");
    return res.data;
  },

  assignToChild: async (data: AssignHomeworkDto) => {
    await http.post("/exercises/complexes/assign", data);
  },

  getChildHomework: async (childId: number) => {
    const res = await http.get<ComplexDto[]>(
      `/exercises/complexes/child/${childId}`,
    );
    return res.data;
  },
};
