// src/api/types/exercise.ts
export type ExerciseDto = {
  id: number;
  title: string;
  description: string;
  videoPath: string;
  iconName: string;
  mainCategory: string;
  mainCategoryDisplayName: string;
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
