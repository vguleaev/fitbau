import prisma from '@/db/prisma';

async function getWorkouts(userId: string) {
  const workouts = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
  });

  return workouts;
}

async function createWorkout(workout: { name: string }, userId: string) {
  const created = await prisma.workout.create({
    data: {
      name: workout.name,
      userId: userId,
    },
  });
  return created;
}

export { getWorkouts, createWorkout };
