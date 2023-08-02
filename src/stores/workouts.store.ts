import { Workout } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutStore = {
  isLoading: boolean;
  workouts: Workout[];
  loadWorkouts: () => void;
  deleteWorkout: (workoutId: string) => void;
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
  deleteWorkout: async (workoutId) => {
    const result = await fetch(`/api/workouts/${workoutId}`, {
      method: 'DELETE',
    });

    if (result.status === 200) {
      toast.success(`Deleted!`);
      set((state) => ({
        workouts: state.workouts.filter((workout) => workout.id !== workoutId),
      }));
    } else {
      toast.error('Something went wrong :(');
    }
  },
}));

export { useWorkoutsStore };
