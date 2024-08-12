import React from 'react';
import { LuFrown, LuX } from 'react-icons/lu';
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
      <div className="p-3 rounded-lg mb-5 w-full h-[88px] bg-base-200">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="rounded-lg w-[100px] mb-2 h-5 bg-base-300 skeleton" />
          <div className="flex flex-row">
            <div className="h-6 w-6 rounded-full bg-base-300 skeleton" />
            <div className="h-6 w-6 ml-2 rounded-full bg-base-300 skeleton" />
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <div className="rounded-lg w-[230px] mb-2 h-5 bg-base-300 skeleton" />
        </div>
      </div>
    );
  };

  if (isFetching) {
    return (
      <div>
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

  return (
    <div>
      {workout.exercises.length === 0 && (
        <div className="flex flex-row items-center justify-center w-full">
          {t('No exercises')}
          <LuFrown className="h-4 w-4 ml-2" />
        </div>
      )}

      <div className="overflow-y-scroll h-[32rem]">
        {workout.exercises.map((exercise) => (
          <div className="bg-base-200 p-3 rounded-lg mb-5" key={exercise.id} onClick={() => editExercise(exercise)}>
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="font-semibold">{exercise.name}</div>
              <div className="flex flex-row">
                <LuX
                  className="h-6 w-6 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteModal(exercise);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <div>
                {t('Reps')}: {exercise.reps}
              </div>
              <div>
                {t('Sets')}: {exercise.sets}
              </div>
              <div>
                {t('Weight')}: {exercise.weight} ({t('kg')})
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderDeleteModal()}
    </div>
  );
};
