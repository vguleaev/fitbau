import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';

const updateSetPlay = async (data: { exerciseId: string; setId: string; isCompleted: boolean }) => {
  const result = await fetch(`/api/play-sets/${data.setId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isCompleted: data.isCompleted }),
  });
  return result;
};

export const useSetPlayUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSetPlay,
    onMutate: async (targetData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['played-workout'] });
      const previousWorkoutPlay = queryClient.getQueryData(['played-workout']);

      // Optimistically update to the new value
      queryClient.setQueryData(['played-workout'], (old: WorkoutPlayWithExercises) => {
        // Your logic here to update the exercises optimistically
        // This is a placeholder logic, adjust according to your data structure

        const targetExercise = old.exercises.find((exercise) => exercise.id === targetData.exerciseId);
        if (!targetExercise) {
          return old;
        }
        const set = targetExercise.sets.find((set) => set.id === targetData.setId);
        if (!set) {
          return old;
        }
        set.isCompleted = targetData.isCompleted;

        const areAllExercisesDone = old.exercises.every((exercise) => exercise.sets.every((set) => set.isCompleted));
        if (areAllExercisesDone) {
          toast.success('Great job! You have completed the workout!');
        }

        return {
          ...old,
        };
      });

      // Return a context object with the snapshotted value
      return { previousWorkoutPlay };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['played-workout'], context?.previousWorkoutPlay);
      toast.error('Something went wrong :(');
    },
    // If the mutation succeeds, invalidate the query to refetch the updated data
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['played-workout'],
        refetchType: 'none',
      });
    },
  });
};
