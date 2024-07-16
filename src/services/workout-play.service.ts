import prisma from '@/db/prisma';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { WorkoutWithExercises } from '@/types/workout.type';

import { Exercise, ExercisePlay, ExercisePlaySet, Workout, WorkoutPlay } from '@prisma/client';

async function cloneWorkoutForPlay(workout: WorkoutWithExercises, userId: string): Promise<WorkoutPlay> {
  const workoutPlay = await createWorkoutPlay(workout, userId);

  await Promise.all(
    workout.exercises.map(async (exercise, exerciseIndex) => {
      const exercisePlay = await createExercisePlay(exercise, workoutPlay, exerciseIndex);
      await Promise.all(
        Array.from({ length: exercise.sets }, async () => {
          await createExercisePlaySet(exercisePlay);
        })
      );
    })
  );

  return workoutPlay;
}

async function createWorkoutPlay(workout: Workout, userId: string): Promise<WorkoutPlay> {
  const created = await prisma.workoutPlay.create({
    data: {
      name: workout.name,
      userId: userId,
      workoutId: workout.id,
    },
  });
  return created;
}

async function createExercisePlay(exercise: Exercise, workoutPlay: WorkoutPlay, order: number): Promise<ExercisePlay> {
  const created = await prisma.exercisePlay.create({
    data: {
      order: order,
      name: exercise.name,
      reps: exercise.reps,
      weight: exercise.weight,
      workoutPlayId: workoutPlay.id,
    },
  });
  return created;
}

async function createExercisePlaySet(exercisePlay: ExercisePlay): Promise<ExercisePlaySet> {
  const created = await prisma.exercisePlaySet.create({
    data: {
      reps: exercisePlay.reps,
      weight: exercisePlay.weight,
      exercisePlayId: exercisePlay.id,
    },
  });
  return created;
}

async function getWorkoutPlayWithExercises(workoutId: string): Promise<WorkoutPlayWithExercises | null> {
  const workoutPlay = await prisma.workoutPlay.findFirst({
    where: {
      workoutId: workoutId,
      finishedOn: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  return workoutPlay;
}

async function getAllUnfinishedWorkoutPlays() {
  const workoutPlays = await prisma.workoutPlay.findMany({
    where: {
      finishedOn: null,
    },
  });
  return workoutPlays;
}

async function finishWorkoutPlay(workoutPlayId: string, date: Date) {
  await prisma.workoutPlay.update({
    where: {
      id: workoutPlayId,
    },
    data: {
      finishedOn: date,
    },
  });
}

async function finishWorkoutPlayByWorkoutId(workoutId: string, date: Date) {
  await prisma.workoutPlay.updateMany({
    where: {
      workoutId: workoutId,
      finishedOn: null,
    },
    data: {
      finishedOn: date,
    },
  });
}

async function getAllFinishedWorkoutsForUser(userId: string): Promise<WorkoutPlay[]> {
  const workoutPlays = prisma.workoutPlay.findMany({
    where: {
      userId: userId,
      finishedOn: {
        not: null,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return workoutPlays;
}

export {
  createWorkoutPlay,
  createExercisePlay,
  createExercisePlaySet,
  getWorkoutPlayWithExercises,
  cloneWorkoutForPlay,
  getAllUnfinishedWorkoutPlays,
  finishWorkoutPlay,
  finishWorkoutPlayByWorkoutId,
  getAllFinishedWorkoutsForUser,
};
