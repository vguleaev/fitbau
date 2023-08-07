import { Exercise, Workout } from '@prisma/client';
import { z } from 'zod';

const addWorkoutSchema = z.object({
  name: z.string().nonempty(),
});

export type AddWorkoutSchema = z.infer<typeof addWorkoutSchema>;

export type WorkoutWithExercises = Workout & {
  exercises: Exercise[];
};

export { addWorkoutSchema };
