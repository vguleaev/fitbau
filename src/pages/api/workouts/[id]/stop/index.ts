import type { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getWorkoutById, stopWorkout } from '@/services/workout.service';
import { finishWorkoutPlayByWorkoutId } from '@/services/workout-play.service';

type StopApiResponse = string;
type ErrorResponse = {
  error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<StopApiResponse | ErrorResponse>) {
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
    if (!workout.isPlayed) {
      return res.status(400).json({ error: 'Only played workout can be stopped' });
    }

    await stopWorkout(workoutId);
    const finishDate = getFinishDate(workout.lastPlayedOn!);
    await finishWorkoutPlayByWorkoutId(workoutId, finishDate);

    return res.status(200).send('OK');
  }

  res.status(404).json({ error: 'Not found' });
}

function getFinishDate(playDate: Date): Date {
  const MAX_DURATION_IN_MINUTES = 120;
  const diffInMinutes = dayjs().diff(dayjs(playDate), 'minutes');
  if (diffInMinutes >= MAX_DURATION_IN_MINUTES) {
    return dayjs(playDate).add(MAX_DURATION_IN_MINUTES, 'minutes').toDate();
  }
  const now = new Date();
  return now;
}
