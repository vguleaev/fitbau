import { useWorkoutsStore } from '@/stores/workouts.store';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { LuTrophy, LuDumbbell, LuTrash } from 'react-icons/lu';

export const WorkoutsList = () => {
  const { isLoading, workouts, loadWorkouts, deleteWorkout } = useWorkoutsStore((state) => ({
    isLoading: state.isLoading,
    workouts: state.workouts,
    loadWorkouts: state.loadWorkouts,
    deleteWorkout: state.deleteWorkout,
  }));

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const ref = useRef<HTMLDialogElement>(null);

  const showModal = (workoutId: string) => {
    ref?.current?.showModal();
    setIsDeleteDialogOpen(true);
    setSelectedWorkoutId(workoutId);
  };

  const onDeleteClick = async (e: SyntheticEvent) => {
    e.preventDefault();
    await deleteWorkout(selectedWorkoutId);
    setIsDeleteDialogOpen(false);
    ref?.current?.close();
  };

  const renderDeleteModal = () => {
    return (
      <dialog id="my_modal_2" className="modal" ref={ref} open={isDeleteDialogOpen}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Delete</h3>
          <p className="py-4">Are you sure you want to delete workout?</p>
          <div className="flex flex-row justify-between">
            <button className="btn btn-default w-[80px]">No</button>
            <button className="btn btn-primary w-[80px]" onClick={(e) => onDeleteClick(e)}>
              Yes
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  };

  if (isLoading) {
    return (
      <div>
        <span className="loading loading-spinner loading-md" />
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
            <button className="btn btn-circle" onClick={() => showModal(workout.id)}>
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
