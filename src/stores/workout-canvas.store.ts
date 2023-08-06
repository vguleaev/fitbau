import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutModel = {
  id?: number;
  name: string;
};

type ExerciseModel = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
};

type WorkoutCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  workoutModel: WorkoutModel;
  exercises: ExerciseModel[];
  exerciseModel: ExerciseModel;
  selectedWorkoutId: string;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  createWorkout: (data: { name: string }) => void;
  clearWorkoutModel: () => void;
  setWorkoutModel: (workoutModel: WorkoutModel) => void;
  addExercise: (workoutModel: ExerciseModel) => void;
  removeExercise: (exerciseId: string) => void;
  setExerciseModel: (exerciseModel: Partial<ExerciseModel>) => void;
  setSelectedWorkoutId: (id: string) => void;
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
    sets: '',
    reps: '',
    weight: '',
  },
  exercises: [],
  selectedWorkoutId: '',
  setSelectedWorkoutId: (id) => {
    set({
      selectedWorkoutId: id,
    });
  },
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

export { useWorkoutCanvasStore };
