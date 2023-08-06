import prisma from '@/db/prisma';
import { ExerciseModel } from '@/types/exercise.type';
import { Exercise } from '@prisma/client';

async function getExercises(workoutId: string): Promise<Exercise[]> {
  const exercises = await prisma.exercise.findMany({
    where: {
      workoutId,
    },
  });

  return exercises;
}

async function createExercises(workoutId: string, exercises: ExerciseModel[]): Promise<number | null> {
  const result = await prisma.exercise.createMany({
    data: exercises.map((exercise) => ({
      workoutId,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
    })),
  });

  return result.count;
}

async function deleteExercises(workoutId: string): Promise<number> {
  const result = await prisma.exercise.deleteMany({
    where: {
      workoutId,
    },
  });
  return result.count;
}

export { getExercises, createExercises, deleteExercises };
