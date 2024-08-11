import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AddExerciseSchema } from '@/types/exercise.type';
import i18n from '../i18n/i18n';

const t = i18n.t;

const addExercise = async (data: { workoutId: string; exercise: AddExerciseSchema }) => {
  const result = await fetch(`/api/workouts/${data.workoutId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.exercise),
  });

  if (result.status === 201) {
    toast.success(t('Saved!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

const deleteExercise = async (data: { workoutId: string; exerciseId: string }) => {
  const result = await fetch(`/api/workouts/${data.workoutId}/exercises/${data.exerciseId}`, {
    method: 'DELETE',
  });

  if (result.status === 200) {
    toast.success(t('Deleted!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

const updateExercise = async (data: { workoutId: string; exerciseId: string; exercise: AddExerciseSchema }) => {
  const result = await fetch(`/api/workouts/${data.workoutId}/exercises/${data.exerciseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.exercise),
  });

  if (result.status === 200) {
    toast.success(t('Updated!'));
  } else {
    toast.error(t('Something went wrong :('));
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

export const useUpdateExercise = () => {
  return useMutation({
    mutationFn: updateExercise,
  });
};
