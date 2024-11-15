import Image from 'next/image';
import { useAddExercise, useUpdateExercise } from '@/hooks/exercises.hooks';
import { useWorkout } from '@/hooks/workouts.hooks';
import { AddExerciseSchema, addExerciseSchema } from '@/types/exercise.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Exercise } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  exercise: Exercise | null;
  onClose: () => void;
};

export const ExercisesForm = ({ exercise, onClose }: Props) => {
  const { t } = useTranslation();
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
    reset();
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
        <Image
          className="rounded-lg dark:border-base-100 mb-2"
          src="/images/train-girl.svg"
          width={500}
          height={500}
          alt="Picture"
        />
        <div>
          <label className="label">{t('Exercise Name')}</label>
          <input className="input input-bordered w-full mb-2" type="text" required {...register('name')} />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div>
            <label className="label">{t('Reps')}</label>
            <input className="input input-bordered w-full mb-2" type="number" required {...register('reps')} />
          </div>
          <div>
            <label className="label">{t('Sets')}</label>
            <input className="input input-bordered w-full mb-2" type="number" required {...register('sets')} />
          </div>
          <div>
            <label className="label">
              {t('Weight')} ({t('kg')})
            </label>
            <input className="input input-bordered w-full mb-2" type="number" required {...register('weight')} />
          </div>
        </div>
        {errors.reps && <div className="text-red-500 text-[16px]">{t('Reps must be a positive number!')}</div>}
        {errors.sets && <div className="text-red-500 text-[16px]">{t('Sets must be a positive number!')}</div>}
        {errors.weight && <div className="text-red-500 text-[16px]">{t('Weight must be a positive number!')}</div>}

        <button
          type="button"
          className="btn btn-neutral text-white absolute bottom-[25px] left-4 w-[100px]"
          onClick={() => onCloseClick()}
          disabled={addExerciseMutation.isPending || updateExerciseMutation.isPending}>
          {t('Close')}
        </button>

        <button
          type="submit"
          className="btn btn-primary text-white absolute bottom-[25px] right-4"
          disabled={addExerciseMutation.isPending || updateExerciseMutation.isPending}>
          {(addExerciseMutation.isPending || updateExerciseMutation.isPending) && (
            <span className="loading loading-spinner" />
          )}
          {t('Save Workout')}
        </button>
      </form>
    </div>
  );
};
