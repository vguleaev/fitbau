import { router } from '../trpc';
import workoutRouter from './workout.router';

export const appRouter = router({
  workouts: workoutRouter,
});

export type AppRouter = typeof appRouter;
