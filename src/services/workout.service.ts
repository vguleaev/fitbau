import prisma from '@/db/prisma';
import { WorkoutWithExercises } from '@/types/workout.type';
import { Workout } from '@prisma/client';

async function getWorkouts(userId: string): Promise<WorkoutWithExercises[]> {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
    include: {
      exercises: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return workouts;
}

async function getWorkoutById(workoutId: string): Promise<WorkoutWithExercises | null> {
  const workout = await prisma.workout.findUnique({
    where: {
      id: workoutId,
    },
    include: {
      exercises: true,
    },
  });

  return workout;
}

async function updateWorkout(workoutId: string, workout: { name: string }): Promise<Workout> {
  const updated = await prisma.workout.update({
    where: {
      id: workoutId,
    },
    data: {
      name: workout.name,
    },
  });
  return updated;
}

async function createWorkout(workout: { name: string }, userId: string): Promise<Workout> {
  const created = await prisma.workout.create({
    data: {
      name: workout.name,
      userId: userId,
    },
  });
  return created;
}

async function deleteWorkout(workoutId: string): Promise<Workout> {
  const deleted = await prisma.workout.delete({
    where: {
      id: workoutId,
    },
  });
  return deleted;
}

async function getPlayedWorkout(userId: string): Promise<WorkoutWithExercises | null> {
  const workout = await prisma.workout.findFirst({
    where: {
      userId: userId,
      isPlayed: true,
    },
    include: {
      exercises: true,
    },
  });

  return workout;
}

async function playWorkout(workoutId: string): Promise<void> {
  await prisma.workout.update({
    where: {
      id: workoutId,
    },
    data: {
      isPlayed: true,
      lastPlayedOn: new Date(),
    },
  });
}

async function stopWorkout(workoutId: string): Promise<void> {
  await prisma.workout.update({
    where: {
      id: workoutId,
    },
    data: {
      isPlayed: false,
      lastPlayedOn: null,
    },
  });
}

export {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getPlayedWorkout,
  playWorkout,
  stopWorkout,
};
