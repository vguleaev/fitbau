import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getAllFinishedWorkoutsForUser } from '@/services/workout-play.service';
import { WorkoutPlay } from '@prisma/client';

type GetFinishedWorkoutsApiResponse = WorkoutPlay[] | null;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetFinishedWorkoutsApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const finishedWorkouts = await getAllFinishedWorkoutsForUser(session.user.id);
    return res.status(200).json(finishedWorkouts);
  }

  res.status(404).json({ error: 'Not found' });
}
