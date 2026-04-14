import React from 'react';
import { LuDumbbell, LuTrash, LuPlay } from 'react-icons/lu';
import { DialogModal } from './shared/dialog-modal';
import { WorkoutWithExercises } from '@/types/workout.type';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import PAGE_URL from '@/constants/page.constant';
import { useDeleteWorkout, usePlayWorkout, useWorkouts } from '@/hooks/workouts.hooks';
import { useTranslation } from 'react-i18next';
import { useDeleteWorkoutModalStore } from '@/stores/delete-workout.modal.store';

export const WorkoutsList = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isFetching, data: workouts } = useWorkouts();
  const deleteWorkoutMutation = useDeleteWorkout();
  const playWorkoutMutation = usePlayWorkout();

  const { isDeleteDialogOpen, setIsDeleteDialogOpen, selectedWorkout, setSelectedWorkout } = useDeleteWorkoutModalStore(
    (state) => ({
      isDeleteDialogOpen: state.isDeleteDialogOpen,
      setIsDeleteDialogOpen: state.setIsDeleteDialogOpen,
      selectedWorkout: state.selectedWorkout,
      setSelectedWorkout: state.setSelectedWorkout,
    }),
  );

  const showDeleteModal = (workout: WorkoutWithExercises) => {
    setIsDeleteDialogOpen(true);
    setSelectedWorkout(workout);
  };

  const startWorkout = async (workout: WorkoutWithExercises) => {
    if (workout.exercises.length === 0) {
      toast.error(t('Workout has no exercises!'));
      return;
    }
    await playWorkoutMutation.mutateAsync(workout.id);
    router.push(PAGE_URL.START_WORKOUT);
  };

  const onDeleteClick = async () => {
    if (!selectedWorkout) {
      return;
    }
    await deleteWorkoutMutation.mutateAsync(selectedWorkout.id);
    setIsDeleteDialogOpen(false);
  };

  const onWorkoutClick = (workout: WorkoutWithExercises) => {
    if (playWorkoutMutation.isPending) {
      return;
    }
    if (workout.isPlayed) {
      toast.error(t('You can not edit played workout. Finish it first!'));
      return;
    }
    router.push(PAGE_URL.WORKOUT_DETAILS.replace(':id', workout.id.toString()));
  };

  const renderWorkoutSkeleton = () => {
    return (
      <div className="skeleton w-full bg-base-200 rounded-xl p-4 h-[84px]">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-base-300 skeleton flex-shrink-0" />
            <div>
              <div className="w-[140px] h-4 mb-2 bg-base-300 skeleton rounded" />
              <div className="w-[90px] h-3 bg-base-300 skeleton rounded" />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="h-9 w-9 rounded-full bg-base-300 skeleton" />
            <div className="h-9 w-9 rounded-full bg-base-300 skeleton" />
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    return (
      <DialogModal isOpened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div>
          <h3 className="font-bold text-lg">{t('Delete')}</h3>
          <p className="py-4">{t('Are you sure you want to delete workout?')}</p>
          <div className="flex flex-row justify-between">
            <button className="btn btn-default min-w-[80px]" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('No')}
            </button>
            <button
              className="btn btn-primary min-w-[80px] text-white"
              disabled={deleteWorkoutMutation.isPending}
              onClick={() => onDeleteClick()}>
              {deleteWorkoutMutation.isPending && <span className="loading loading-spinner" />}
              {t('Yes')}
            </button>
          </div>
        </div>
      </DialogModal>
    );
  };

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
      </div>
    );
  }

  if (workouts?.length === 0) {
    return (
      <div className="mt-16 flex flex-col gap-4 text-center items-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <LuDumbbell className="h-10 w-10 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-base">{t('No workouts yet')}</p>
          <p className="text-sm text-base-content/50 mt-1">{t('Tap + to create your first training program')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {workouts?.map((workout) => (
        <div
          key={workout.id}
          className="relative overflow-hidden rounded-xl bg-base-200 border border-base-300/50 shadow-sm transition-all duration-150 active:scale-[0.99]">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
          <div className="flex flex-row justify-between items-center p-4 pl-5">
            <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => onWorkoutClick(workout)}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <LuDumbbell className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-base leading-tight truncate">{workout.name}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-base-content/60 font-medium">
                    {workout.exercises.length} {t('exercises')}
                  </span>
                  {workout.isPlayed && (
                    <span className="badge badge-sm badge-primary text-white font-medium px-2">{t('Active')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                className="btn btn-circle btn-sm btn-primary text-white shadow-sm"
                onClick={() => startWorkout(workout)}
                disabled={playWorkoutMutation.isPending}>
                {playWorkoutMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LuPlay className="h-4 w-4 fill-current" />
                )}
              </button>
              <button
                className="btn btn-circle btn-sm btn-ghost text-base-content/40 hover:text-error hover:bg-error/10"
                disabled={playWorkoutMutation.isPending}
                onClick={() => showDeleteModal(workout)}>
                <LuTrash className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {renderDeleteModal()}
    </div>
  );
};
