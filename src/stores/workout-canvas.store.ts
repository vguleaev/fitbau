import { AddExerciseSchema, ExerciseModel } from '@/types/exercise.type';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type WorkoutCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  exercises: ExerciseModel[];
  selectedWorkoutId: string;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  addExercise: (exercise: AddExerciseSchema) => void;
  saveExerciseList: () => Promise<void>;
  removeExercise: (exerciseId: string) => void;
  setSelectedWorkoutId: (id: string) => void;
  loadExerciseList: () => Promise<void>;
};

const useWorkoutCanvasStore = create<WorkoutCanvasStore>((set, get) => ({
  isCanvasOpen: false,
  isSaving: false,
  isLoading: false,
  exercises: [],
  selectedWorkoutId: '',
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsCanvasOpen: (isCanvasOpen) => set({ isCanvasOpen }),
  setSelectedWorkoutId: (id) => {
    set({
      selectedWorkoutId: id,
    });
  },
  removeExercise: (exerciseId) => {
    set((state) => ({
      exercises: state.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  },
  addExercise: (exercise: AddExerciseSchema) => {
    const exerciseModel = {
      ...exercise,
      id: Math.floor(Math.random() * 100000).toString(),
    };

    set((state) => ({
      exercises: [...state.exercises, exerciseModel],
    }));
  },
  loadExerciseList: async () => {
    set({ isLoading: true });
    const result = await fetch(`/api/workouts/${get().selectedWorkoutId}/exercises`);
    const exercises = (await result.json()) as ExerciseModel[];
    set({ exercises, isLoading: false });
  },
  saveExerciseList: async () => {
    set({ isSaving: true });

    await fetch(`/api/workouts/${get().selectedWorkoutId}/exercises`, {
      method: 'DELETE',
    });

    const result = await fetch(`/api/workouts/${get().selectedWorkoutId}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exercises: get().exercises,
      }),
    });

    if (result.status === 200) {
      toast.success(`Saved!`);
      set({ isSaving: false, isCanvasOpen: false });
    } else {
      toast.error('Something went wrong :(');
      set({ isSaving: false });
    }
  },
}));

export { useWorkoutCanvasStore };
