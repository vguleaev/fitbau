import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { getWorkoutPlayWithExercises } from '@/services/workout-play.service';
import { getPlayedWorkout } from '@/services/workout.service';

type GetPlayedWorkoutApiResponse = WorkoutPlayWithExercises | null;

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
    if (!playedWorkout) {
      return res.status(200).json(null);
    }

    const workoutPlay = await getWorkoutPlayWithExercises(playedWorkout.id);
    return res.status(200).json(workoutPlay);
  }

  res.status(404).json({ error: 'Not found' });
}
