import { WorkoutWithExercises } from '@/types/workout.type';
import { create } from 'zustand';

type WorkoutDetailsStore = {
  isLoading: boolean;
  isSaving: boolean;
  workout: WorkoutWithExercises;
  loadWorkout: (id: string) => void;
};

const useWorkoutDetailsStore = create<WorkoutDetailsStore>((set) => ({
  isLoading: true,
  isSaving: false,
  workout: {} as WorkoutWithExercises,
  loadWorkout: async (workoutId: string) => {
    set({ isLoading: true });
    const result = await fetch(`/api/workouts/${workoutId}`);
    const workout = (await result.json()) as WorkoutWithExercises;
    set({ workout, isLoading: false });
  },
}));

export { useWorkoutDetailsStore };
