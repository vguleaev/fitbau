import { Exercise, Workout } from '@prisma/client';

export type WorkoutWithExercises = Workout & {
  exercises: Exercise[];
};
