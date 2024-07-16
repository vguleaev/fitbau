import { finishWorkoutPlay, getAllUnfinishedWorkoutPlays } from '@/services/workout-play.service';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const unfinishedWorkoutPlays = await getAllUnfinishedWorkoutPlays();

  for (const play of unfinishedWorkoutPlays) {
    console.log(`Unfinished play found for workout ${play.workoutId}`);

    const date = play.createdAt;
    date.setHours(date.getHours() + 2);
    await finishWorkoutPlay(play.id, date);
  }

  const finishedWorkoutIds = unfinishedWorkoutPlays.map((play) => play.workoutId);
  return response.json({ finishedWorkoutIds });
}
