import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutModel = {
  id?: number;
  name: string;
};

type ExerciseModel = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type WorkoutCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  workoutModel: WorkoutModel;
  exercises: ExerciseModel[];
  exerciseModel: ExerciseModel;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  createWorkout: () => void;
  clearWorkoutModel: () => void;
  setWorkoutModel: (workoutModel: WorkoutModel) => void;
  addExercise: (workoutModel: ExerciseModel) => void;
  removeExercise: (exerciseId: string) => void;
  setExerciseModel: (exerciseModel: Partial<ExerciseModel>) => void;
};

const useWorkoutCanvasStore = create<WorkoutCanvasStore>((set, get) => ({
  isCanvasOpen: false,
  isSaving: false,
  workoutModel: {
    name: '',
  },
  exerciseModel: {
    id: '',
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
  },
  exercises: [],
  setExerciseModel: (exerciseModel) => {
    set({
      exerciseModel: {
        ...get().exerciseModel,
        ...exerciseModel,
      },
    });
  },
  removeExercise: (exerciseId) => {
    set((state) => ({
      exercises: state.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  },
  addExercise: (exerciseModel) => {
    exerciseModel.id = Math.floor(Math.random() * 100000).toString();

    set((state) => ({
      exercises: [...state.exercises, exerciseModel],
    }));
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
      set({ isSaving: false });
    }
  },
}));

export { useWorkoutCanvasStore };
