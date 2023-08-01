import prisma from '@/db/prisma';
import { Workout } from '@prisma/client';

async function getWorkouts(userId: string): Promise<Workout[]> {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
  });

  return workouts;
}

async function getWorkoutById(workoutId: string): Promise<Workout | null> {
  const workout = await prisma.workout.findUnique({
    where: {
      id: workoutId,
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

export { getWorkouts, createWorkout, getWorkoutById, updateWorkout, deleteWorkout };
