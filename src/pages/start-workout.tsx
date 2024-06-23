import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useActiveWorkoutStore } from '@/stores/active-workout.store';
import { cn } from '@/utils/cn.helper';
import { usePlayedWorkout, useStopWorkout } from '@/hooks/workouts.hooks';
import CountdownText from '@/components/shared/countdown-text';
import { WorkoutWithExercises } from '@/types/workout.type';
import { LuTimer } from 'react-icons/lu';

export default function StartWorkout() {
  const { activeWorkout, activeExercises, setExerciseDone } = useActiveWorkoutStore((state) => ({
    activeExercises: state.activeExercises,
    activeWorkout: state.activeWorkout,
    setExerciseDone: state.setExerciseDone,
  }));

  const { isFetching, data: workout } = usePlayedWorkout();
  const stopWorkoutMutation = useStopWorkout();

  const stopWorkout = async (workout: WorkoutWithExercises) => {
    await stopWorkoutMutation.mutateAsync(workout.id);
  };

  const renderPlayedWorkout = () => {
    if (isFetching) {
      return <div>Loading...</div>;
    }

    if (!workout) {
      return <div className="mb-5">You do not have an active workout. Please select your workout and click play.</div>;
    }

    return (
      <div className="flex flex-row gap-5 items-center justify-between mb-5">
        <div className="flex flex-row">
          <LuTimer className="w-5 h-5 mr-2" />
          <CountdownText timestamp={new Date(workout.lastPlayedOn || 0).getTime()} />
        </div>
        <button className="btn btn-primary min-w-[80px] text-white" onClick={() => stopWorkout(workout)}>
          {stopWorkoutMutation.isPending && <span className="loading loading-spinner" />}
          Finish workout
        </button>
      </div>
    );
  };

  const renderRest = () => {
    console.log('isFetching', isFetching, 'workout', workout);
    if (isFetching || !workout) {
      return null;
    }

    return (
      <div className="flex flex-col gap-5">
        {activeExercises.map((exercise) => (
          <div
            key={exercise.id}
            className={cn('bg-base-200 rounded-md p-4 transition ease-in-out delay-100 duration-300', {
              'bg-rose-200 dark:bg-neutral-900': exercise.isDone,
            })}>
            <h2 className="text-lg mb-4 font-semibold">{exercise.name}</h2>
            <div>
              {exercise.activeSets.map((activeSet) => (
                <div key={activeSet.number} className="flex flex-row gap-5 items-center">
                  <div>Set {activeSet.number}</div>
                  <div>Reps {exercise.reps}</div>
                  <div>{exercise.weight} kg</div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exercise.activeSets[activeSet.number - 1].isDone}
                        onChange={() => setExerciseDone(exercise.id, activeSet.number)}
                        className="checkbox checkbox-error"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout page={PAGE_URL.START_WORKOUT}>
      <div className="m-5 mb-20">
        <h1 className="text-lg mb-10">{activeWorkout.name}</h1>
        {renderPlayedWorkout()}
        {renderRest()}
      </div>
    </Layout>
  );
}
