import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useActiveWorkoutStore } from '@/stores/active-workout.store';
import clsx from 'clsx';

export default function StartWorkout() {
  const { activeWorkout, activeExercises, setExerciseDone } = useActiveWorkoutStore((state) => ({
    activeExercises: state.activeExercises,
    activeWorkout: state.activeWorkout,
    setExerciseDone: state.setExerciseDone,
  }));

  return (
    <Layout page={PAGE_URL.START_WORKOUT}>
      <div className="m-5 mb-20">
        <h1 className="text-lg mb-10">{activeWorkout.name}</h1>
        <div className="flex flex-col gap-5">
          {activeExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={clsx('bg-base-200 rounded-md p-4 transition ease-in-out delay-100 duration-300', {
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
      </div>
    </Layout>
  );
}
