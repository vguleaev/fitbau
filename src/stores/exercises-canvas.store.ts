import { AddExerciseSchema, ExerciseModel } from '@/types/exercise.type';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';
import type { WorkoutWithExercises } from '@/types/workout.type';

type ExercisesCanvasStore = {
  isCanvasOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  exercises: ExerciseModel[];
  selectedWorkout: WorkoutWithExercises;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  addExercise: (exercise: AddExerciseSchema) => void;
  saveExerciseList: () => Promise<void>;
  removeExercise: (exerciseId: string) => void;
  setSelectedWorkout: (workout: WorkoutWithExercises) => void;
  setExerciseList: (exercises: ExerciseModel[]) => void;
  loadExerciseList: () => Promise<void>;
};

const useExercisesCanvasStore = create<ExercisesCanvasStore>((set, get) => ({
  isCanvasOpen: false,
  isSaving: false,
  isLoading: false,
  exercises: [],
  selectedWorkout: {} as WorkoutWithExercises,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsCanvasOpen: (isCanvasOpen) => set({ isCanvasOpen }),
  setSelectedWorkout: (workout: WorkoutWithExercises) => {
    set({
      selectedWorkout: workout,
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
  setExerciseList: (exercises: ExerciseModel[]) => {
    set({ exercises });
  },
  loadExerciseList: async () => {
    set({ isLoading: true });
    const result = await fetch(`/api/workouts/${get().selectedWorkout.id}/exercises`);
    const exercises = (await result.json()) as ExerciseModel[];
    set({ exercises, isLoading: false });
  },
  saveExerciseList: async () => {
    set({ isSaving: true });

    await fetch(`/api/workouts/${get().selectedWorkout.id}/exercises`, {
      method: 'DELETE',
    });

    const result = await fetch(`/api/workouts/${get().selectedWorkout.id}/exercises`, {
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

export { useExercisesCanvasStore };
