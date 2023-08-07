import { WorkoutWithExercises } from '@/types/workout.type';
import { Exercise } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

type ActiveExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  isDone: boolean;
  activeSets: Array<{
    number: number;
    isDone: boolean;
  }>;
};

type ActiveWorkoutStore = {
  activeWorkout: WorkoutWithExercises;
  activeExercises: ActiveExercise[];
  setActiveWorkout: (workout: WorkoutWithExercises) => void;
  setExerciseDone: (exerciseId: string, activeSetNumber: number) => void;
};

const prepareActiveExercise = (exercises: Exercise[]) => {
  const activeSets = (sets: number) =>
    Array.from({ length: sets }).map((_, i) => ({
      number: i + 1,
      isDone: false,
    }));

  return exercises.map((exercise) => ({
    ...exercise,
    isDone: false,
    activeSets: activeSets(exercise.sets),
  }));
};

const useActiveWorkoutStore = create<ActiveWorkoutStore>((set, get) => ({
  activeWorkout: {} as WorkoutWithExercises,
  activeExercises: [],
  setActiveWorkout: (workout) => {
    set({ activeWorkout: workout, activeExercises: prepareActiveExercise(workout.exercises) });
  },
  setExerciseDone: (exerciseId: string, activeSetNumber: number) => {
    const activeExercises = get().activeExercises;
    const exerciseIndex = activeExercises.findIndex((exercise) => exercise.id === exerciseId);
    if (exerciseIndex === -1) {
      toast.error('Exercise not found');
      return;
    }
    const newActiveExercises = [...activeExercises];
    const newActiveExercise = newActiveExercises[exerciseIndex];

    newActiveExercise.activeSets[activeSetNumber - 1].isDone =
      !newActiveExercise.activeSets[activeSetNumber - 1].isDone;

    if (newActiveExercise.activeSets.every((set) => set.isDone)) {
      newActiveExercise.isDone = true;
    } else {
      newActiveExercise.isDone = false;
    }

    set({ activeExercises: newActiveExercises });
  },
}));

export { useActiveWorkoutStore };
