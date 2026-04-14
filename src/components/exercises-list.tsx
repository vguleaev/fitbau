import React from 'react';
import { LuX, LuDumbbell } from 'react-icons/lu';
import { DialogModal } from './shared/dialog-modal';
import { useRouter } from 'next/router';
import { useWorkout } from '@/hooks/workouts.hooks';
import { Exercise } from '@prisma/client';
import { useDeleteExercise } from '@/hooks/exercises.hooks';
import { useTranslation } from 'react-i18next';
import { useDeleteExerciseModalStore } from '@/stores/delete-exercise.modal.store';

type Props = {
  onEditExercise: (exercise: Exercise) => void;
};

export const ExercisesList = ({ onEditExercise }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const workoutId = router.query.id as string;

  const { data: workout, isFetching, refetch } = useWorkout(workoutId);
  const deleteExerciseMutation = useDeleteExercise();

  const { isDeleteDialogOpen, selectedExercise, setIsDeleteDialogOpen, setSelectedExercise } =
    useDeleteExerciseModalStore((state) => ({
      isDeleteDialogOpen: state.isDeleteDialogOpen,
      selectedExercise: state.selectedExercise,
      setIsDeleteDialogOpen: state.setIsDeleteDialogOpen,
      setSelectedExercise: state.setSelectedExercise,
    }));

  const showDeleteModal = (exercise: Exercise) => {
    if (workout) {
      setIsDeleteDialogOpen(true);
      setSelectedExercise(exercise);
    }
  };

  const onDeleteClick = async () => {
    if (!selectedExercise) {
      return;
    }

    await deleteExerciseMutation.mutateAsync({
      exerciseId: selectedExercise.id,
      workoutId: workoutId,
    });
    setIsDeleteDialogOpen(false);
    refetch();
  };

  const editExercise = (exercise: Exercise) => {
    if (workout) {
      onEditExercise(exercise);
    }
  };

  const renderDeleteModal = () => {
    return (
      <DialogModal isOpened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div>
          <h3 className="font-bold text-lg">{selectedExercise?.name}</h3>
          <p className="py-4">{t('Are you sure you want to delete exercise?')}</p>
          <div className="flex flex-row justify-between">
            <button className="btn btn-default min-w-[80px]" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('No')}
            </button>
            <button
              className="btn btn-primary min-w-[80px] text-white"
              disabled={deleteExerciseMutation.isPending}
              onClick={() => onDeleteClick()}>
              {deleteExerciseMutation.isPending && <span className="loading loading-spinner" />}
              {t('Yes')}
            </button>
          </div>
        </div>
      </DialogModal>
    );
  };

  const renderExerciseSkeleton = () => {
    return (
      <div className="skeleton w-full bg-base-200 rounded-xl p-4 h-[90px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-base-300 skeleton flex-shrink-0" />
            <div>
              <div className="w-[130px] h-4 mb-2 bg-base-300 skeleton rounded" />
              <div className="flex gap-2">
                <div className="w-14 h-3 bg-base-300 skeleton rounded" />
                <div className="w-14 h-3 bg-base-300 skeleton rounded" />
                <div className="w-14 h-3 bg-base-300 skeleton rounded" />
              </div>
            </div>
          </div>
          <div className="h-7 w-7 rounded-full bg-base-300 skeleton" />
        </div>
      </div>
    );
  };

  if (isFetching) {
    return (
      <div className="flex flex-col gap-3">
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
      </div>
    );
  }

  if (!workout) {
    return null;
  }

  if (workout.exercises.length === 0) {
    return (
      <div className="mt-16 flex flex-col gap-4 text-center items-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <LuDumbbell className="h-10 w-10 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-base">{t('No exercises')}</p>
          <p className="text-sm text-base-content/50 mt-1">{t('Tap + to add your first exercise')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mb-24">
      {workout.exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          className="relative overflow-hidden rounded-xl bg-base-200 border border-base-300/50 shadow-sm transition-all duration-150 active:scale-[0.99]"
          onClick={() => editExercise(exercise)}>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
          <div className="flex flex-row justify-between items-center p-4 pl-5">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-base leading-tight truncate">{exercise.name}</div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="bg-base-300 text-base-content/70 text-xs font-medium px-2 py-0.5 rounded-full">
                    {exercise.reps} {t('reps')}
                  </span>
                  <span className="bg-base-300 text-base-content/70 text-xs font-medium px-2 py-0.5 rounded-full">
                    {exercise.sets} {t('Sets').toLowerCase()}
                  </span>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                    {exercise.weight} {t('kg')}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="btn btn-circle btn-xs btn-ghost text-base-content/30 hover:text-error hover:bg-error/10 flex-shrink-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                showDeleteModal(exercise);
              }}>
              <LuX className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      {renderDeleteModal()}
    </div>
  );
};
