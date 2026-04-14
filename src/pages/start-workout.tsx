import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { usePlayedWorkout, useStopWorkout } from '@/hooks/workouts.hooks';
import CountdownText from '@/components/shared/countdown-text';
import { LuPlayCircle, LuTimer, LuCheckCircle2 } from 'react-icons/lu';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { useSetPlayUpdate } from '@/hooks/play-sets.hooks';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function StartWorkout() {
  const { t } = useTranslation();
  const router = useRouter();
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
      <div className="flex flex-row items-center justify-between bg-base-200 border border-base-300/50 rounded-xl px-4 py-3 mb-5 shadow-sm">
        <div className="flex items-center gap-2 text-base font-semibold">
          <LuTimer className="w-5 h-5 text-primary" />
          <CountdownText timestamp={new Date(workoutPlay.createdAt || 0).getTime()} />
        </div>
        <button
          className="btn btn-primary btn-sm text-white rounded-lg px-4"
          onClick={() => stopWorkout(workoutPlay.workoutId)}
          disabled={stopWorkoutMutation.isPending}>
          {stopWorkoutMutation.isPending && <span className="loading loading-spinner loading-xs" />}
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
    const allDone = areAllExercisesDone(workoutPlay);

    return (
      <div className="flex flex-col gap-3">
        {allDone && <Confetti />}
        {allDone && (
          <div className="flex items-center justify-center gap-2 bg-success/10 border border-success/30 text-success rounded-xl py-3 px-4 mb-1 fade-in">
            <LuCheckCircle2 className="h-5 w-5" />
            <span className="font-semibold text-sm">{t('Great job! You have completed the workout!')}</span>
          </div>
        )}
        {activeExercises.map((exercise, exerciseIndex) => {
          const done = isExerciseDone(exercise.id);
          return (
            <div
              key={exercise.id}
              className={`relative overflow-hidden rounded-xl border shadow-sm transition-all duration-200 ${
                done ? 'bg-base-200/60 border-success/20' : 'bg-base-200 border-base-300/50'
              }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors duration-300 ${done ? 'bg-success' : 'bg-primary'}`} />
              <div className="p-4 pl-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'}`}>
                      {exerciseIndex + 1}
                    </div>
                    <h2 className={`font-bold text-base ${done ? 'text-base-content/50' : ''}`}>{exercise.name}</h2>
                  </div>
                  {done && (
                    <span className="badge badge-xs bg-success/15 text-success border-success/20 gap-1 fade-in font-semibold">
                      <LuCheckCircle2 className="h-3 w-3" />
                      {t('Done')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {exercise.sets.map((set, index) => (
                    <label
                      key={set.id}
                      className={`flex flex-row items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors ${
                        set.isCompleted ? 'bg-success/5' : 'bg-base-300/40 hover:bg-base-300/70'
                      }`}>
                      <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${set.isCompleted ? 'text-success' : 'text-base-content/40'}`}>
                        {index + 1}
                      </span>
                      <span className={`text-sm flex-1 ${set.isCompleted ? 'text-base-content/40 line-through' : ''}`}>
                        <span className="font-medium">{exercise.reps}</span> {t('reps')}
                        <span className="mx-2 text-base-content/30">·</span>
                        <span className="font-semibold text-primary">{exercise.weight} {t('kg')}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={set.isCompleted}
                        onChange={() => setExerciseDone(exercise.id, set.id, !set.isCompleted)}
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExerciseSkeleton = () => (
    <div className="relative overflow-hidden rounded-xl bg-base-200 border border-base-300/50 p-4 pl-5 shadow-sm">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-base-300 rounded-l-xl" />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-full bg-base-300 skeleton flex-shrink-0" />
        <div className="w-[140px] h-4 bg-base-300 skeleton rounded" />
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-base-300/40">
            <div className="w-5 h-3 bg-base-300 skeleton rounded" />
            <div className="w-[110px] h-3 bg-base-300 skeleton rounded flex-1" />
            <div className="w-5 h-5 rounded bg-base-300 skeleton" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isFetching) {
      return (
        <div>
          <div className="skeleton w-[180px] h-7 mb-1 rounded" />
          <div className="skeleton w-[110px] h-4 mb-5 rounded" />
          <div className="skeleton w-full h-[52px] bg-base-200 rounded-xl mb-5" />
          <div className="flex flex-col gap-3">
            {renderExerciseSkeleton()}
            {renderExerciseSkeleton()}
            {renderExerciseSkeleton()}
          </div>
        </div>
      );
    }

    if (!workoutPlay) {
      return (
        <div className="mt-16 flex flex-col gap-4 text-center items-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <LuPlayCircle className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-base">{t('No active workout')}</p>
            <p className="text-sm text-base-content/50 mt-1">
              {t('Select a workout and tap play to start')}
            </p>
          </div>
          <button
            className="btn btn-primary text-white mt-2 rounded-xl"
            onClick={() => router.push(PAGE_URL.WORKOUTS)}>
            {t('Go to Workouts')}
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight">{workoutPlay.name}</h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {workoutPlay.exercises.length} {t('exercises')}
          </p>
        </div>
        {renderTimeContainer(workoutPlay)}
        {renderExercises(workoutPlay)}
      </>
    );
  };

  return (
    <Layout page={PAGE_URL.START_WORKOUT}>
      <div className="m-5 mb-24">{renderContent()}</div>
    </Layout>
  );
}
