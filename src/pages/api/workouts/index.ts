import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { createWorkout, getWorkouts } from '@/services/workout.service';
import { Workout } from '@prisma/client';
import { WorkoutWithExercises } from '@/types/workout.type';

type GetWorkoutsApiResponse = WorkoutWithExercises[];
type CreateWorkoutApiResponse = Workout;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetWorkoutsApiResponse | CreateWorkoutApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const workouts = await getWorkouts(session.user.id);
    return res.status(200).json(workouts);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    const workout = await createWorkout({ name }, session.user.id);
    return res.status(200).json(workout);
  }

  res.status(404).json({ error: 'Not found' });
}
