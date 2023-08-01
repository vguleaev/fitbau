import { useWorkoutsStore } from '@/stores/workouts.store';
import React, { useEffect } from 'react';
import { LuTrophy, LuDumbbell } from 'react-icons/lu';

export const WorkoutsList = () => {
  const { isLoading, workouts, loadWorkouts } = useWorkoutsStore((state) => ({
    isLoading: state.isLoading,
    workouts: state.workouts,
    loadWorkouts: state.loadWorkouts,
  }));

  useEffect(() => {
    loadWorkouts();
  }, []);

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
          <div className="flex flex-row mb-2 items-center">
            <LuTrophy className="h-5 w-5 text-primary" />
            <div className="ml-2 font-semibold">{workout.name}</div>
          </div>

          <div className="flex flex-row items-center">
            <LuDumbbell className="h-5 w-5 text-primary" />
            <div className="ml-2">3 exercises</div>
          </div>

          <div className="divider" />
        </div>
      ))}
    </div>
  );
};
