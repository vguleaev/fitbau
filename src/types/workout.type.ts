import { Prisma } from '@prisma/client';
import { z } from 'zod';

const addWorkoutSchema = z.object({
  name: z.string().min(1),
});

export type AddWorkoutSchema = z.infer<typeof addWorkoutSchema>;

export type WorkoutWithExercises = Prisma.WorkoutGetPayload<{
  include: {
    exercises: true;
  };
}>;

export { addWorkoutSchema };
