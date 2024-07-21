import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { WorkoutPlay } from '@prisma/client';
import dayjs from 'dayjs';

const getWorkoutPlayDuration = (workoutPlay: WorkoutPlay | WorkoutPlayWithExercises) => {
  return dayjs(workoutPlay.finishedOn).diff(workoutPlay.createdAt, 'minute');
};

export { getWorkoutPlayDuration };
