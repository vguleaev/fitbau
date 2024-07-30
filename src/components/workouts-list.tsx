import React, { useState } from 'react';
import { LuDumbbell, LuTrash, LuPlay } from 'react-icons/lu';
import { DialogModal } from './shared/dialog-modal';
import { WorkoutWithExercises } from '@/types/workout.type';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import PAGE_URL from '@/constants/page.constant';
import { useActiveWorkoutStore } from '@/stores/active-workout.store';
import { useDeleteWorkout, usePlayWorkout, useWorkouts } from '@/hooks/workouts.hooks';

export const WorkoutsList = () => {
  const router = useRouter();
  const { isFetching, data: workouts } = useWorkouts();
  const deleteWorkoutMutation = useDeleteWorkout();
  const playWorkoutMutation = usePlayWorkout();

  const { setActiveWorkout } = useActiveWorkoutStore((state) => ({
    setActiveWorkout: state.setActiveWorkout,
  }));

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutWithExercises | null>(null);

  const showDeleteModal = (workout: WorkoutWithExercises) => {
    setIsDeleteDialogOpen(true);
    setSelectedWorkout(workout);
  };

  const startWorkout = async (workout: WorkoutWithExercises) => {
    if (workout.exercises.length === 0) {
      toast.error('Workout has no exercises!');
      return;
    }
    setActiveWorkout(workout);
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
      toast.error('You can not edit played workout. Finish it first!');
      return;
    }
    router.push(PAGE_URL.WORKOUT_DETAILS.replace(':id', workout.id.toString()));
  };

  const renderWorkoutSkeleton = () => {
    return (
      <div className="h-24 skeleton w-full bg-base-200 rounded-md p-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="w-[160px] h-5 mb-3 mt-2 bg-base-300 skeleton" />
            <div className="w-[110px] h-5 mb-2 bg-base-300 skeleton" />
          </div>
          <div className="flex flex-row gap-4">
            <div className="h-11 w-11 rounded-full bg-base-300 skeleton" />
            <div className="h-11 w-11 rounded-full bg-base-300 skeleton" />
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    return (
      <DialogModal isOpened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div>
          <h3 className="font-bold text-lg">Delete</h3>
          <p className="py-4">Are you sure you want to delete workout?</p>
          <div className="flex flex-row justify-between">
            <button className="btn btn-default min-w-[80px]" onClick={() => setIsDeleteDialogOpen(false)}>
              No
            </button>
            <button
              className="btn btn-primary min-w-[80px] text-white"
              disabled={deleteWorkoutMutation.isPending}
              onClick={() => onDeleteClick()}>
              {deleteWorkoutMutation.isPending && <span className="loading loading-spinner" />}
              Yes
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
      <div className="mt-10 flex flex-col gap-5 text-center items-center">
        <div>Your workout list is empty.</div>
        <LuDumbbell className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {workouts?.map((workout) => (
        <div className="h-24" key={workout.id}>
          <div className="flex flex-row justify-between items-center bg-base-200 rounded-md p-4">
            <div className="w-full" onClick={() => onWorkoutClick(workout)}>
              <div className="flex flex-row mb-2 items-center">
                <div className="text-lg font-bold">{workout.name}</div>
              </div>
              <div className="flex flex-row items-center">
                <div className="text-base-content">{workout.exercises.length} exercises</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-circle bg-base-300"
                onClick={() => startWorkout(workout)}
                disabled={playWorkoutMutation.isPending}>
                {playWorkoutMutation.isPending ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <LuPlay className="h-5 w-5" />
                )}
              </button>
              <button
                className="btn btn-circle  bg-base-300"
                disabled={playWorkoutMutation.isPending}
                onClick={() => showDeleteModal(workout)}>
                <LuTrash className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {renderDeleteModal()}
    </div>
  );
};
