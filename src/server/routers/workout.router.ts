import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { getWorkoutById, getWorkouts } from '@/services/workout.service';
import { WorkoutWithExercises } from '@/types/workout.type';
import { z } from 'zod';

type GetWorkoutsApiResponse = WorkoutWithExercises[];
type GetWorkoutApiResponse = WorkoutWithExercises;

export const workoutRouter = router({
  getAll: protectedProcedure.query(async (opts): Promise<GetWorkoutsApiResponse> => {
    const { session } = opts.ctx;
    if (!session || !session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const workouts = await getWorkouts(session.user.id);
    return workouts;
  }),

  getById: protectedProcedure.input(z.string()).query(async (opts): Promise<GetWorkoutApiResponse> => {
    const { session } = opts.ctx;
    if (!session || !session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const { input: workoutId } = opts;

    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return workout;
  }),
});

export default workoutRouter;
