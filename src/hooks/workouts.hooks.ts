import { useMutation, useQuery } from '@tanstack/react-query';
import { AddWorkoutSchema, WorkoutWithExercises } from '@/types/workout.type';
import toast from 'react-hot-toast';
import queryClient from '@/query-client/query-client';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { WorkoutPlay } from '@prisma/client';
import i18n from '../i18n/i18n';
import { trpc } from '@/utils/trpc';

const t = i18n.t;

const fetchWorkouts = async (): Promise<WorkoutWithExercises[]> => {
  const result = await trpc.workouts.getAll.query();
  return result;
};

const fetchWorkout = async (workoutId: string): Promise<WorkoutWithExercises> => {
  const result = await trpc.workouts.getById.query(workoutId);
  return result;
};

const createWorkout = async (data: AddWorkoutSchema) => {
  const result = await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (result.status === 200) {
    toast.success(t('Created!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

export const playWorkout = async (workoutId: string) => {
  const result = await fetch(`/api/workouts/${workoutId}/play`, {
    method: 'POST',
  });

  if (result.status === 200) {
    toast.success(`Started!`);
  } else {
    const data = await result.json();
    if (data.isPlayed) {
      toast.error(t('Stop active workout first!'));
      return;
    }
    toast.error(t('Something went wrong :('));
  }
};

export const getPlayedWorkout = async () => {
  const result = await fetch(`/api/workouts/played`);
  const workout = await result.json();
  return workout as WorkoutPlayWithExercises;
};

export const stopWorkout = async (workoutId: string) => {
  const result = await fetch(`/api/workouts/${workoutId}/stop`, {
    method: 'POST',
  });

  if (result.status === 200) {
    toast.success(t('Stopped!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

const deleteWorkout = async (workoutId: string) => {
  const result = await fetch(`/api/workouts/${workoutId}`, {
    method: 'DELETE',
  });

  if (result.status === 200) {
    toast.success(t('Deleted!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

const getWorkoutPlaysHistory = async () => {
  const result = await fetch('/api/workouts/history');
  const history = await result.json();
  return history as WorkoutPlay[];
};

export const deleteWorkoutPlay = async (workoutPlayId: string) => {
  const result = await fetch(`/api/workout-plays/${workoutPlayId}`, {
    method: 'DELETE',
  });

  if (result.status === 200) {
    toast.success(t('Deleted!'));
  } else {
    toast.error(t('Something went wrong :('));
  }
};

const fetchWorkoutPlay = async (workoutPlayId: string) => {
  const result = await fetch(`/api/workout-plays/${workoutPlayId}`);

  if (result.status === 404) {
    return null;
  }
  const data = await result.json();
  return data as WorkoutPlayWithExercises;
};

export const useWorkouts = () => {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });
};

export const useWorkout = (workoutId: string) => {
  return useQuery({
    queryKey: ['workout', workoutId],
    queryFn: () => fetchWorkout(workoutId),
    staleTime: 1000,
  });
};

export const useCreateWorkout = () => {
  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
};

export const useDeleteWorkout = () => {
  return useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
};

export const usePlayWorkout = () => {
  return useMutation({
    mutationFn: playWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['played-workout'] });
    },
  });
};

export const usePlayedWorkout = () => {
  return useQuery({
    queryKey: ['played-workout'],
    queryFn: getPlayedWorkout,
  });
};

export const useStopWorkout = () => {
  return useMutation({
    mutationFn: stopWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['played-workout'] });
    },
  });
};

export const useWorkoutPlaysHistory = () => {
  return useQuery({
    queryKey: ['workout-plays-history'],
    queryFn: getWorkoutPlaysHistory,
    staleTime: 1000,
  });
};

export const useDeleteWorkoutPlay = () => {
  return useMutation({
    mutationFn: deleteWorkoutPlay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plays-history'] });
    },
  });
};

export const useWorkoutPlay = (workoutPlayId: string | null) => {
  return useQuery({
    queryKey: ['workout-play', workoutPlayId],
    queryFn: () => fetchWorkoutPlay(workoutPlayId!),
    enabled: !!workoutPlayId,
    staleTime: Infinity,
  });
};
