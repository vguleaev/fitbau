import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { Exercise } from '@prisma/client';
import { ExerciseModel } from '@/types/exercise.type';
import { createExercises, deleteExercises, getExercises } from '@/services/exercise.service';

type GetExercisesApiResponse = Exercise[];
type CreateExercisesApiResponse = { success: boolean };

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetExercisesApiResponse | CreateExercisesApiResponse | ErrorResponse>
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

    const exercises = await getExercises(workoutId);
    if (!exercises) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(exercises);
  }

  if (req.method === 'POST') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    const workoutId = id as string;

    const { exercises } = req.body as { exercises: ExerciseModel[] };
    if (!exercises) {
      return res.status(400).json({ error: 'Missing exercises' });
    }

    await createExercises(workoutId, exercises);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    const workoutId = id as string;

    await deleteExercises(workoutId);
    return res.status(200).json({ success: true });
  }

  res.status(404).json({ error: 'Not found' });
}
