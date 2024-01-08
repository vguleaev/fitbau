import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getWorkoutById } from '@/services/workout.service';
import { Exercise } from '@prisma/client';
import { deleteExercise, getExerciseById } from '@/services/exercise.service';

type GetExerciseApiResponse = Exercise;
type UpdateExerciseApiResponse = Exercise;
type DeleteExerciseApiResponse = Exercise;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetExerciseApiResponse | UpdateExerciseApiResponse | DeleteExerciseApiResponse | ErrorResponse>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { exerciseId: id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    const exerciseId = id as string;

    const exercise = await getExerciseById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json(exercise);
  }

  // if (req.method === 'PUT') {
  //   const { id } = req.query;
  //   if (!id) {
  //     return res.status(400).json({ error: 'Missing id' });
  //   }

  //   const workoutId = id as string;
  //   const { name } = req.body;

  //   const workout = await getWorkoutById(workoutId);
  //   if (!workout) {
  //     return res.status(404).json({ error: 'Not found' });
  //   }
  //   if (workout.userId !== session.user.id) {
  //     return res.status(401).json({ error: 'Unauthorized' });
  //   }
  //   const updated = await updateWorkout(workoutId, { name });
  //   if (!updated) {
  //     return res.status(404).json({ error: 'Not found' });
  //   }
  //   return res.status(200).json(updated);
  // }

  if (req.method === 'DELETE') {
    const { exerciseId: id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id' });
    }

    const exerciseId = id as string;

    const exercise = await getExerciseById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: 'Not found' });
    }

    const workout = await getWorkoutById(exercise.workoutId);
    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (workout.userId !== session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await deleteExercise(exerciseId);
    return res.status(200).json(deleted);
  }

  res.status(404).json({ error: 'Not found' });
}
