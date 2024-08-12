import { WorkoutWithExercises } from '@/types/workout.type';
import { create } from 'zustand';

type DeleteWorkoutModalStore = {
  isDeleteDialogOpen: boolean;
  selectedWorkout: WorkoutWithExercises | null;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSelectedWorkout: (exercise: WorkoutWithExercises | null) => void;
};

const useDeleteWorkoutModalStore = create<DeleteWorkoutModalStore>((set) => ({
  isDeleteDialogOpen: false,
  selectedWorkout: null,
  setIsDeleteDialogOpen: (isOpen) => {
    set({ isDeleteDialogOpen: isOpen });
  },
  setSelectedWorkout: (workout) => {
    set({ selectedWorkout: workout });
  },
}));

export { useDeleteWorkoutModalStore };
