import { Exercise } from '@prisma/client';
import { create } from 'zustand';

type ExerciseBottomCanvasStore = {
  isExerciseCanvasOpen: boolean;
  selectedExercise: Exercise | null;
  setExerciseCanvasOpen: (isOpen: boolean) => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
};

const useExerciseBottomCanvasStore = create<ExerciseBottomCanvasStore>((set) => ({
  isExerciseCanvasOpen: false,
  selectedExercise: null,
  setExerciseCanvasOpen: (isOpen) => {
    set({ isExerciseCanvasOpen: isOpen });
  },
  setSelectedExercise: (exercise) => {
    set({ selectedExercise: exercise });
  },
}));

export { useExerciseBottomCanvasStore };
