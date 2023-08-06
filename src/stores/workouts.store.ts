import { WorkoutWithExercises } from '@/types/workout.type';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutStore = {
  isLoading: boolean;
  workouts: WorkoutWithExercises[];
  loadWorkouts: () => void;
  deleteWorkout: (workoutId: string) => void;
  createWorkout: (data: { name: string }) => void;
};

const useWorkoutsStore = create<WorkoutStore>((set) => ({
  isLoading: true,
  workouts: [],
  loadWorkouts: async () => {
    set({ isLoading: true });
    const result = await fetch('/api/workouts');
    const workouts = (await result.json()) as WorkoutWithExercises[];
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
  createWorkout: async (data: { name: string }) => {
    const result = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      toast.success(`Created!`);
    } else {
      toast.error('Something went wrong :(');
    }
  },
}));

export { useWorkoutsStore };
