import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { WorkoutPlay } from '@prisma/client';
import {
  deleteWorkoutPlay,
  getWorkoutPlayById,
  getWorkoutPlayWithExercisesById,
} from '@/services/workout-play.service';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';

type GetWorkoutPlayByIdApiResponse = WorkoutPlayWithExercises;
type DeleteWorkoutPlayApiResponse = WorkoutPlay;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetWorkoutPlayByIdApiResponse | DeleteWorkoutPlayApiResponse | ErrorResponse>
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

    const workoutPlayId = id as string;

    const workoutPlay = await getWorkoutPlayWithExercisesById(workoutPlayId);
    if (!workoutPlay) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (workoutPlay.userId !== session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(workoutPlay);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const workoutPlayId = id as string;

    const workout = await getWorkoutPlayById(workoutPlayId);
    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (workout.userId !== session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await deleteWorkoutPlay(workoutPlayId);
    return res.status(200).json(deleted);
  }

  res.status(404).json({ error: 'Not found' });
}
