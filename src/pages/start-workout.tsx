import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { usePlayedWorkout, useStopWorkout } from '@/hooks/workouts.hooks';
import CountdownText from '@/components/shared/countdown-text';
import { LuPlayCircle, LuTimer } from 'react-icons/lu';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { useSetPlayUpdate } from '@/hooks/play-sets.hooks';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';

export default function StartWorkout() {
  const { t } = useTranslation();
  const { isFetching, data: workoutPlay } = usePlayedWorkout();
  const stopWorkoutMutation = useStopWorkout();
  const useSetPlayUpdateMutation = useSetPlayUpdate();

  const setExerciseDone = async (exerciseId: string, setId: string, isCompleted: boolean) => {
    await useSetPlayUpdateMutation.mutateAsync({ exerciseId, setId, isCompleted });
  };

  const stopWorkout = async (workoutId: string) => {
    await stopWorkoutMutation.mutateAsync(workoutId);
  };

  const renderTimeContainer = (workoutPlay: WorkoutPlayWithExercises) => {
    return (
      <div className="flex flex-row gap-5 items-center justify-between mb-5">
        <div className="flex flex-row text-lg">
          <LuTimer className="w-6 h-6 mr-2" />
          <CountdownText timestamp={new Date(workoutPlay.createdAt || 0).getTime()} />
        </div>
        <button
          className="btn btn-primary min-w-[80px] text-white"
          onClick={() => stopWorkout(workoutPlay.workoutId)}
          disabled={stopWorkoutMutation.isPending}>
          {stopWorkoutMutation.isPending && <span className="loading loading-spinner" />}
          {t('Finish workout')}
        </button>
      </div>
    );
  };

  const isExerciseDone = (exerciseId: string) => {
    const exercise = workoutPlay?.exercises.find((e) => e.id === exerciseId);
    if (!exercise) {
      return false;
    }

    return exercise.sets.every((set) => set.isCompleted);
  };

  const areAllExercisesDone = (workoutPlay: WorkoutPlayWithExercises) => {
    return workoutPlay.exercises.every((exercise) => exercise.sets.every((set) => set.isCompleted));
  };

  const renderExercises = (workoutPlay: WorkoutPlayWithExercises) => {
    const activeExercises = workoutPlay.exercises;

    return (
      <div className="flex flex-col gap-5">
        {areAllExercisesDone(workoutPlay) && <Confetti />}
        {activeExercises.map((exercise) => (
          <div key={exercise.id} className="bg-base-200 rounded-md p-4">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg mb-4 font-semibold">{exercise.name}</h2>
              {isExerciseDone(exercise.id) && <div className="badge badge-success fade-in">done</div>}
            </div>
            <div>
              {exercise.sets.map((set, index) => (
                <div key={set.id} className="flex flex-row gap-5 items-center">
                  <div>#{index + 1}</div>
                  <div>
                    {exercise.reps} {t('reps')}
                  </div>
                  <div>
                    {exercise.weight} {t('kg')}
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={set.isCompleted}
                        onChange={() => setExerciseDone(exercise.id, set.id, !set.isCompleted)}
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

  const renderContent = () => {
    if (isFetching) {
      return (
        <div>
          <div className="skeleton w-[170px] h-[28px] mb-5" />
          <div className="flex flex-row gap-5 items-center justify-between mb-5">
            <div className="skeleton w-[90px] bg-base-200 h-[28px]" />
            <div className="skeleton w-[130px] bg-base-200 h-[50px]" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="skeleton w-full h-[200px] bg-base-200 rounded-md p-4 flex flex-col gap-5">
              <div className="skeleton w-[220px] bg-base-300 h-[20px] mt-2 mb-2" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
            </div>
            <div className="skeleton w-full h-[200px] bg-base-200 rounded-md p-4 flex flex-col gap-5">
              <div className="skeleton w-[220px] bg-base-300 h-[20px] mt-2 mb-2" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
            </div>
            <div className="skeleton w-full h-[200px] bg-base-200 rounded-md p-4 flex flex-col gap-5">
              <div className="skeleton w-[220px] bg-base-300 h-[20px] mt-2 mb-2" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
              <div className="skeleton w-[150px] bg-base-300 h-[20px]" />
            </div>
          </div>
        </div>
      );
    }

    if (!workoutPlay) {
      return (
        <div className="mt-10 flex flex-col gap-5 text-center items-center">
          <div>{t('You do not have an active workout. Please select your workout and click play.')}</div>
          <LuPlayCircle className="h-10 w-10 text-primary" />
        </div>
      );
    }

    return (
      <>
        <h1 className="text-lg mb-5">{workoutPlay.name}</h1>
        {renderTimeContainer(workoutPlay)}
        {renderExercises(workoutPlay)}
      </>
    );
  };

  return (
    <Layout page={PAGE_URL.START_WORKOUT}>
      <div className="m-5 mb-20">{renderContent()}</div>
    </Layout>
  );
}
