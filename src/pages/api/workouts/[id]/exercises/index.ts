import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { Exercise } from '@prisma/client';
import { AddExerciseSchema, addExerciseSchema } from '@/types/exercise.type';
import { createExercise, deleteExercises, getExercises } from '@/services/exercise.service';
import { ZodErrors } from '@/types/zod.type';

type GetExercisesApiResponse = Exercise[];
type CreateExerciseApiResponse = Exercise;
type DeleteExercisesApiResponse = { success: boolean };

type ErrorResponse = {
  error: string | ZodErrors;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetExercisesApiResponse | CreateExerciseApiResponse | DeleteExercisesApiResponse | ErrorResponse>
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
    const exercise = req.body as AddExerciseSchema;

    const validatedFields = addExerciseSchema.safeParse(exercise);
    if (!validatedFields.success) {
      return res.status(400).json({
        error: validatedFields.error.flatten().fieldErrors,
      });
    }

    const created = await createExercise(workoutId, exercise);
    return res.status(201).json(created);
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
