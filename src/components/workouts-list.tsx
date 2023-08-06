import { useWorkoutsStore } from '@/stores/workouts.store';
import React, { useEffect, useState } from 'react';
import { LuTrophy, LuDumbbell, LuTrash } from 'react-icons/lu';
import { DialogModal } from './shared/dialog-modal';

export const WorkoutsList = () => {
  const { isLoading, workouts, loadWorkouts, deleteWorkout } = useWorkoutsStore((state) => ({
    isLoading: state.isLoading,
    workouts: state.workouts,
    loadWorkouts: state.loadWorkouts,
    deleteWorkout: state.deleteWorkout,
  }));

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const showDeleteModal = (workoutId: string) => {
    setIsDeleteDialogOpen(true);
    setSelectedWorkoutId(workoutId);
  };

  const onDeleteClick = async () => {
    setIsDeleting(true);
    await deleteWorkout(selectedWorkoutId);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const renderWorkoutSkeleton = () => {
    return (
      <div className="h-24 mb-4 pt-2 pb-2">
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="w-[160px] h-5 mb-2 bg-base-200 skeleton" />
            <div className="w-[110px] h-5 mb-2 bg-base-200 skeleton" />
          </div>
          <div className="h-11 w-11 rounded-full bg-base-200 skeleton" />
        </div>
        <div className="divider" />
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
              disabled={isDeleting}
              onClick={() => onDeleteClick()}>
              {isDeleting && <span className="loading loading-spinner" />}
              Yes
            </button>
          </div>
        </div>
      </DialogModal>
    );
  };

  if (isLoading) {
    return (
      <div>
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
        {renderWorkoutSkeleton()}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center">
        <span className="">Your list is empty</span>
      </div>
    );
  }

  return (
    <div>
      {workouts.map((workout) => (
        <div className="h-24 mb-4 pt-2 pb-2" key={workout.id}>
          <div className="flex flex-row justify-between items-center">
            <div className="">
              <div className="flex flex-row mb-2 items-center">
                <LuTrophy className="h-5 w-5 text-primary" />
                <div className="ml-2 font-semibold">{workout.name}</div>
              </div>

              <div className="flex flex-row items-center">
                <LuDumbbell className="h-5 w-5 text-primary" />
                <div className="ml-2">3 exercises</div>
              </div>
            </div>
            <button className="btn btn-circle" onClick={() => showDeleteModal(workout.id)}>
              <LuTrash className="h-5 w-5" />
            </button>
          </div>

          <div className="divider" />
        </div>
      ))}
      {renderDeleteModal()}
    </div>
  );
};
