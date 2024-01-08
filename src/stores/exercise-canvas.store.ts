import { AddExerciseSchema, ExerciseModel } from '@/types/exercise.type';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';
import type { WorkoutWithExercises } from '@/types/workout.type';

type ExercisesCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  workout: WorkoutWithExercises;
  selectedExercise: ExerciseModel;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  addExercise: (exercise: AddExerciseSchema) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  setWorkout: (workouts: WorkoutWithExercises) => void;
  setSelectedExercise: (exercise: ExerciseModel) => void;
};

const useExerciseCanvasStore = create<ExercisesCanvasStore>((set, get) => ({
  isCanvasOpen: false,
  isSaving: false,
  isLoading: false,
  workout: {} as WorkoutWithExercises,
  selectedExercise: {} as ExerciseModel,
  setWorkout: (workout: WorkoutWithExercises) => set({ workout }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsCanvasOpen: (isCanvasOpen) => set({ isCanvasOpen }),
  setSelectedExercise: (exercise: ExerciseModel) => {
    set({
      selectedExercise: exercise,
    });
  },
  deleteExercise: async (exerciseId: string) => {
    const result = await fetch(`/api/workouts/${get().workout.id}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });

    if (result.status === 200) {
      toast.success(`Deleted!`);
      set({ isSaving: false, isCanvasOpen: false });
    } else {
      toast.error('Something went wrong :(');
      set({ isSaving: false });
    }
  },
  addExercise: async (exercise: AddExerciseSchema) => {
    set({ isSaving: true });

    const result = await fetch(`/api/workouts/${get().workout.id}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercise),
    });

    if (result.status === 201) {
      toast.success(`Saved!`);
      set({ isSaving: false, isCanvasOpen: false });
    } else {
      toast.error('Something went wrong :(');
      set({ isSaving: false });
    }
  },
}));

export { useExerciseCanvasStore };
