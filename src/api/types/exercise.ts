// src/api/types/exercise.ts
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
  logopedId?: number;
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

export interface ComplexAssignmentDto {
  id: number;
  complexId: number;
  complexName: string;
  childId: number;
  assignedAt: string;
  completedAt?: string;
  isActive: boolean;
}
