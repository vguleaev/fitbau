import prisma from '@/db/prisma';

import { ExercisePlaySet } from '@prisma/client';

async function getSetPlayById(setPlayId: string): Promise<ExercisePlaySet | null> {
  const setPlay = await prisma.exercisePlaySet.findFirst({
    where: {
      id: setPlayId,
    },
  });

  return setPlay;
}

async function updateSetPlay(setPlayId: string, isCompleted: boolean): Promise<ExercisePlaySet> {
  const updated = await prisma.exercisePlaySet.update({
    where: {
      id: setPlayId,
    },
    data: {
      isCompleted: isCompleted,
    },
  });

  return updated;
}

export { getSetPlayById, updateSetPlay };
