import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getPlayedWorkout } from '@/services/workout.service';
import { WorkoutWithExercises } from '@/types/workout.type';

type GetPlayedWorkoutApiResponse = WorkoutWithExercises | null;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPlayedWorkoutApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const playedWorkout = await getPlayedWorkout(session.user.id);
    return res.status(200).json(playedWorkout);
  }

  res.status(404).json({ error: 'Not found' });
}
