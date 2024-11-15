import { useDeleteWorkoutPlay, useWorkoutPlay, useWorkoutPlaysHistory } from '@/hooks/workouts.hooks';
import { WorkoutPlayWithExercises } from '@/types/workout-play.type';
import { getWorkoutPlayDuration } from '@/utils/workout-play.helper';
import { WorkoutPlay } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import { LuHourglass } from 'react-icons/lu';

type Props = {
  workoutPlay: WorkoutPlay | null;
  onClose: () => void;
};

export const WorkoutPlayDetails = ({ workoutPlay, onClose }: Props) => {
  const { t } = useTranslation();
  const { isFetching, data: workoutPlayDetails } = useWorkoutPlay(workoutPlay?.id ?? null);
  const { refetch } = useWorkoutPlaysHistory();

  const deleteWorkoutPlayMutation = useDeleteWorkoutPlay();

  const onCloseClick = () => {
    onClose();
  };

  const deleteWorkoutPlay = async (workoutPlayId: string) => {
    await deleteWorkoutPlayMutation.mutateAsync(workoutPlayId);
    onClose();
    refetch();
  };

  if (isFetching) {
    return (
      <div className="flex w-full justify-center items-center h-full">
        <div className="loading loading-spinner w-20 h-20 mb-10 text-primary" />
      </div>
    );
  }

  if (!workoutPlay || !workoutPlayDetails) {
    return null;
  }

  const renderExercises = (workoutPlayDetails: WorkoutPlayWithExercises) => {
    return (
      <div className="w-full h-[calc(70vh-25px)] overflow-scroll mb-5">
        {workoutPlayDetails.exercises.map((exercise) => (
          <div key={exercise.id} className="flex flex-col w-full mb-5 bg-base-300 rounded-md p-4 text-[16px]">
            <div className="font-bold mb-2">{exercise.name}</div>
            <div className="w-full flex flex-col gap-2">
              {exercise.sets.map((set, index) => (
                <div key={index} className="flex flex-row items-center gap-5">
                  <div className="w-5">
                    {set.isCompleted ? (
                      <FaCheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <FaSquare className="h-5 w-5" />
                    )}
                  </div>
                  <div>#{index + 1}</div>
                  <div>
                    {set.reps} {t('reps')}
                  </div>
                  <div>
                    {set.weight} {t('kg')}
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
    <div className="mt-5">
      <div className="flex flex-col gap-2">
        <div className="flex fle-row justify-between mt-2 mb-2 mx-1 text-lg">
          <div>{dayjs(workoutPlay.createdAt).format('DD.MM.YYYY')}</div>
          <div className="flex items-center">
            {getWorkoutPlayDuration(workoutPlay)} {t('minutes')}
            <LuHourglass className="h-5 w-5 ml-2" />
          </div>
        </div>

        {renderExercises(workoutPlayDetails)}

        <div className="w-full flex flex-row justify-between absolute bottom-[20px] pr-8">
          <button
            type="button"
            className="btn btn-neutral text-white w-[100px]"
            onClick={() => onCloseClick()}
            disabled={deleteWorkoutPlayMutation.isPending}>
            {t('Close')}
          </button>

          <button
            type="submit"
            className="btn btn-primary text-white"
            onClick={() => deleteWorkoutPlay(workoutPlay.id)}
            disabled={deleteWorkoutPlayMutation.isPending}>
            {deleteWorkoutPlayMutation.isPending && <span className="loading loading-spinner" />}
            {t('Delete History')}
          </button>
        </div>
      </div>
    </div>
  );
};
