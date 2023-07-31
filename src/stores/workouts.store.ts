import { Workout } from '@prisma/client';
import { create } from 'zustand';

type WorkoutStore = {
  isLoading: boolean;
  workouts: Workout[];
  loadWorkouts: () => void;
};

const useWorkoutsStore = create<WorkoutStore>((set) => ({
  isLoading: true,
  workouts: [],
  loadWorkouts: async () => {
    set({ isLoading: true });
    const result = await fetch('/api/workouts');
    const workouts = (await result.json()) as Workout[];
    set({ workouts, isLoading: false });
  },
}));

export { useWorkoutsStore };
