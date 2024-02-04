import prisma from '@/db/prisma';
import { AddExerciseSchema, ExerciseModel } from '@/types/exercise.type';
import { Exercise } from '@prisma/client';

async function getExercises(workoutId: string): Promise<Exercise[]> {
  const exercises = await prisma.exercise.findMany({
    where: {
      workoutId,
    },
  });

  return exercises;
}

async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  const exercise = await prisma.exercise.findUnique({
    where: {
      id: exerciseId,
    },
  });

  return exercise;
}

async function createExercise(workoutId: string, exercise: AddExerciseSchema): Promise<Exercise> {
  const result = await prisma.exercise.create({
    data: {
      workoutId,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
    },
  });

  return result;
}

async function deleteExercise(exerciseId: string): Promise<Exercise> {
  const result = await prisma.exercise.delete({
    where: {
      id: exerciseId,
    },
  });
  return result;
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

async function updateExercise(exerciseId: string, exercise: Partial<Exercise>): Promise<Exercise> {
  const result = await prisma.exercise.update({
    where: {
      id: exerciseId,
    },
    data: exercise,
  });

  return result;
}

export {
  getExercises,
  createExercises,
  deleteExercises,
  createExercise,
  deleteExercise,
  getExerciseById,
  updateExercise,
};
