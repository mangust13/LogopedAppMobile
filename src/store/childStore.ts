// src\store\childStore.ts
import { create } from "zustand";
import { ChildDto } from "../api/types/child";

type ChildState = {
  selectedChildId: number | null;
  selectedChild?: ChildDto;
  setSelectedChild: (child: ChildDto) => void;
  setSelectedChildId: (id: number) => void;
  setSelectedChildData: (child: ChildDto) => void;
  clearSelectedChild: () => void;
};

export const useChildStore = create<ChildState>((set) => ({
  selectedChildId: null,
  selectedChild: undefined,

  setSelectedChild: (child) =>
    set({
      selectedChildId: Number(child.id),
      selectedChild: child,
    }),

  setSelectedChildId: (id) => set({ selectedChildId: id }),

  setSelectedChildData: (child) => set({ selectedChild: child }),

  clearSelectedChild: () =>
    set({
      selectedChildId: null,
      selectedChild: undefined,
    }),
}));
