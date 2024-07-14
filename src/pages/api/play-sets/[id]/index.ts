import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { ExercisePlaySet } from '@prisma/client';
import { getSetPlayById, updateSetPlay } from '@/services/sets-play.service';

type GetWorkoutApiResponse = ExercisePlaySet;
type UpdateWorkoutApiResponse = ExercisePlaySet;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetWorkoutApiResponse | UpdateWorkoutApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const playSetId = id as string;
    const { isCompleted } = req.body;

    const playSet = await getSetPlayById(playSetId);
    if (!playSet) {
      return res.status(404).json({ error: 'Not found' });
    }

    const updated = await updateSetPlay(playSetId, isCompleted);
    if (!updated) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(updated);
  }

  res.status(404).json({ error: 'Not found' });
}
