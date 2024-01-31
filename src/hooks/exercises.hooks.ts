import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AddExerciseSchema } from '@/types/exercise.type';

const addExercise = async (data: { workoutId: string; exercise: AddExerciseSchema }) => {
  const result = await fetch(`/api/workouts/${data.workoutId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.exercise),
  });

  if (result.status === 201) {
    toast.success(`Saved!`);
  } else {
    toast.error('Something went wrong :(');
  }
};

const deleteExercise = async (data: { workoutId: string; exerciseId: string }) => {
  const result = await fetch(`/api/workouts/${data.workoutId}/exercises/${data.exerciseId}`, {
    method: 'DELETE',
  });

  if (result.status === 200) {
    toast.success(`Deleted!`);
  } else {
    toast.error('Something went wrong :(');
  }
};

export const useAddExercise = () => {
  return useMutation({
    mutationFn: addExercise,
  });
};

export const useDeleteExercise = () => {
  return useMutation({
    mutationFn: deleteExercise,
  });
};
