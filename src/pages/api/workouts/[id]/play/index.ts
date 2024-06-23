import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getPlayedWorkout, getWorkoutById, playWorkout } from '@/services/workout.service';

type PlayApiResponse = string;
type ErrorResponse = {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PlayApiResponse | ErrorResponse>) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
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
    const playedWorkout = await getPlayedWorkout(session.user.id);
    if (playedWorkout) {
      return res.status(400).json({ error: 'There can be only single workout played' });
    }

    await playWorkout(workoutId);
    return res.status(200).send('OK');
  }

  res.status(404).json({ error: 'Not found' });
}
