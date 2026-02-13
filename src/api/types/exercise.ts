export type ExerciseDto = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  iconName: string;
  category: string;
};

export type ComplexDto = {
  id: number;
  title: string;
  exercises: ExerciseDto[];
};

export type CreateComplexDto = {
  title: string;
  exerciseIds: number[];
};

export type AssignHomeworkDto = {
  childId: number;
  complexId: number;
};
