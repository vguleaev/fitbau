import { useAddExercise, useUpdateExercise } from '@/hooks/exercises.hooks';
import { useWorkout } from '@/hooks/workouts.hooks';
import { AddExerciseSchema, addExerciseSchema } from '@/types/exercise.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exercise } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  exercise: Exercise | null;
  onClose: () => void;
};

export const ExercisesForm = ({ exercise, onClose }: Props) => {
  const router = useRouter();
  const workoutId = router.query.id as string;
  const { refetch } = useWorkout(workoutId);

  const addExerciseMutation = useAddExercise();
  const updateExerciseMutation = useUpdateExercise();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddExerciseSchema>({
    resolver: zodResolver(addExerciseSchema),
    values: {
      name: exercise ? exercise.name : '',
      reps: exercise ? exercise.reps : 0,
      sets: exercise ? exercise.sets : 0,
      weight: exercise ? exercise.weight : 0,
    },
  });

  const onCloseClick = () => {
    onClose();
  };

  const onSubmit = async (data: AddExerciseSchema) => {
    if (!exercise) {
      await addExerciseMutation.mutateAsync({
        exercise: data,
        workoutId: workoutId,
      });
    } else {
      await updateExerciseMutation.mutateAsync({
        exercise: data,
        workoutId: workoutId,
        exerciseId: exercise.id,
      });
    }

    reset();
    onClose();

    setTimeout(() => {
      refetch();
    }, 500);
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)} tabIndex={-1}>
        {errors.reps && <div className="text-red-500">Reps must be a positive number</div>}
        {errors.sets && <div className="text-red-500">Sets must be a positive number</div>}
        {errors.weight && <div className="text-red-500">Weight must be a positive number</div>}
        <div>
          <label className="label">Exercise Name</label>
          <input className="input input-bordered w-full w-full mb-2" type="text" required {...register('name')} />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div>
            <label className="label">Reps</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('reps')} />
          </div>
          <div>
            <label className="label">Sets</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('sets')} />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('weight')} />
          </div>
        </div>

        <button
          type="button"
          className="btn btn-neutral text-white absolute bottom-[25px] left-4 w-[100px]"
          onClick={() => onCloseClick()}
          disabled={addExerciseMutation.isPending}>
          Close
        </button>

        <button
          type="submit"
          className="btn btn-primary text-white absolute bottom-[25px] right-4"
          disabled={addExerciseMutation.isPending}>
          {addExerciseMutation.isPending && <span className="loading loading-spinner" />}
          Save Workout
        </button>
      </form>
    </div>
  );
};
