import { Exercise } from '@prisma/client';
import { create } from 'zustand';

type DeleteExerciseModalStore = {
  isDeleteDialogOpen: boolean;
  selectedExercise: Exercise | null;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
};

const useDeleteExerciseModalStore = create<DeleteExerciseModalStore>((set) => ({
  isDeleteDialogOpen: false,
  selectedExercise: null,
  setIsDeleteDialogOpen: (isOpen) => {
    set({ isDeleteDialogOpen: isOpen });
  },
  setSelectedExercise: (exercise) => {
    set({ selectedExercise: exercise });
  },
}));

export { useDeleteExerciseModalStore };
