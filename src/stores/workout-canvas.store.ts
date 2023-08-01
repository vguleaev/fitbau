import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutModel = {
  id?: number;
  name: string;
};

type WorkoutCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  workoutModel: WorkoutModel;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  createWorkout: () => void;
  clearWorkoutModel: () => void;
  setWorkoutModel: (workoutModel: WorkoutModel) => void;
};

const useWorkoutCanvasStore = create<WorkoutCanvasStore>((set, get) => ({
  isCanvasOpen: false,
  isSaving: false,
  workoutModel: {
    name: '',
  },
  setIsCanvasOpen: (isCanvasOpen) => set({ isCanvasOpen }),
  clearWorkoutModel: () =>
    set({
      workoutModel: {
        name: '',
      },
    }),
  setWorkoutModel: (workoutModel) =>
    set({
      workoutModel: {
        ...get().workoutModel,
        ...workoutModel,
      },
    }),
  createWorkout: async () => {
    set({ isSaving: true });
    const name = get().workoutModel.name;

    const result = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (result.status === 200) {
      toast.success(`Created!`);
      set({ isCanvasOpen: false, isSaving: false });
    } else {
      toast.error('Something went wrong :(');
    }
  },
}));

export { useWorkoutCanvasStore };
