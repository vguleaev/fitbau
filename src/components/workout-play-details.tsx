import { useDeleteWorkoutPlay, useWorkoutPlaysHistory } from '@/hooks/workouts.hooks';
import { getWorkoutPlayDuration } from '@/utils/workout-play.helper';
import { WorkoutPlay } from '@prisma/client';
import React from 'react';

type Props = {
  workoutPlay: WorkoutPlay | null;
  onClose: () => void;
};

export const WorkoutPlayDetails = ({ workoutPlay, onClose }: Props) => {
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

  if (!workoutPlay) {
    return null;
  }

  return (
    <div className="mt-5">
      <div className="flex flex-row gap-2 items-center">
        <div>
          <label className="label">Name</label>
          <input className="input input-bordered w-full mb-2" type="text" value={workoutPlay?.name} disabled />
        </div>
        <div>
          <label className="label">Duration</label>
          <input
            className="input input-bordered w-full mb-2"
            type="text"
            value={getWorkoutPlayDuration(workoutPlay)}
            disabled
          />
        </div>

        <button
          type="button"
          className="btn btn-neutral text-white absolute bottom-[25px] left-4 w-[100px]"
          onClick={() => onCloseClick()}
          disabled={deleteWorkoutPlayMutation.isPending}>
          Close
        </button>

        <button
          type="submit"
          className="btn btn-primary text-white absolute bottom-[25px] right-4"
          onClick={() => deleteWorkoutPlay(workoutPlay.id)}
          disabled={deleteWorkoutPlayMutation.isPending}>
          {deleteWorkoutPlayMutation.isPending && <span className="loading loading-spinner" />}
          Delete History
        </button>
      </div>
    </div>
  );
};
