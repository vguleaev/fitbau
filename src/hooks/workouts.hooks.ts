import { useMutation, useQuery } from '@tanstack/react-query';
import { AddWorkoutSchema, WorkoutWithExercises } from '@/types/workout.type';
import toast from 'react-hot-toast';
import queryClient from '@/query-client/query-client';

const fetchWorkouts = async (): Promise<WorkoutWithExercises[]> => {
  const result = await fetch('/api/workouts');
  const workouts = (await result.json()) as WorkoutWithExercises[];
  return workouts;
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
    toast.success(`Created!`);
  } else {
    toast.error('Something went wrong :(');
  }
};

const deleteWorkout = async (workoutId: string) => {
  const result = await fetch(`/api/workouts/${workoutId}`, {
    method: 'DELETE',
  });

  if (result.status === 200) {
    toast.success(`Deleted!`);
  } else {
    toast.error('Something went wrong :(');
  }
};

export const useWorkouts = () => {
  return useQuery({ queryKey: ['workouts'], queryFn: fetchWorkouts });
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
