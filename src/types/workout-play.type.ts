import { Prisma } from '@prisma/client';

export type WorkoutPlayWithExercises = Prisma.WorkoutPlayGetPayload<{
  include: {
    exercises: {
      include: {
        sets: true;
      };
    };
  };
}>;
