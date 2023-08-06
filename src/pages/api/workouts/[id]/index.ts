import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { deleteWorkout, getWorkoutById, updateWorkout } from '@/services/workout.service';
import { Workout } from '@prisma/client';

type GetWorkoutApiResponse = Workout;
type UpdateWorkoutApiResponse = Workout;
type DeleteWorkoutApiResponse = Workout;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetWorkoutApiResponse | UpdateWorkoutApiResponse | DeleteWorkoutApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    const workoutId = id as string;

    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(workout);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const workoutId = id as string;
    const { name } = req.body;

    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (workout.userId !== session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const updated = await updateWorkout(workoutId, { name });
    if (!updated) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const workoutId = id as string;

    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (workout.userId !== session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await deleteWorkout(workoutId);
    return res.status(200).json(deleted);
  }

  res.status(404).json({ error: 'Not found' });
}
