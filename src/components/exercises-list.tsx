import { ExerciseModel } from '@/types/exercise.type';
import React, { useState } from 'react';
import { LuFrown, LuPencil, LuX } from 'react-icons/lu';
import { DialogModal } from './shared/dialog-modal';
import { useRouter } from 'next/router';
import { useWorkout } from '@/hooks/workouts.hooks';
import { Exercise } from '@prisma/client';
import { useDeleteExercise } from '@/hooks/exercises.hooks';

type Props = {
  onEditExercise: (exercise: Exercise) => void;
};

export const ExercisesList = ({ onEditExercise }: Props) => {
  const router = useRouter();
  const workoutId = router.query.id as string;

  const { data: workout, isFetching, refetch } = useWorkout(workoutId);
  const deleteExerciseMutation = useDeleteExercise();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseModel | null>(null);

  const showDeleteModal = (exercise: ExerciseModel) => {
    if (workout) {
      setIsDeleteDialogOpen(true);
      setSelectedExercise(exercise);
    }
  };

  const onDeleteClick = async () => {
    if (!selectedExercise) {
      return;
    }

    setIsDeleting(true);
    await deleteExerciseMutation.mutateAsync({
      exerciseId: selectedExercise.id,
      workoutId: workoutId,
    });
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    refetch();
  };

  const editExercise = (exercise: Exercise) => {
    if (workout) {
      onEditExercise(exercise);
    }
  };

  const renderDeleteModal = () => {
    return (
      <DialogModal isOpened={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div>
          <h3 className="font-bold text-lg">{selectedExercise?.name}</h3>
          <p className="py-4">Are you sure you want to delete exercise?</p>
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

  const renderExerciseSkeleton = () => {
    return (
      <div className="p-3 rounded-lg mb-5 w-full h-[88px] bg-base-200">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="rounded-lg w-[100px] mb-2 h-5 bg-base-300 skeleton" />
          <div className="flex flex-row">
            <div className="h-6 w-6 rounded-full bg-base-300 skeleton" />
            <div className="h-6 w-6 ml-2 rounded-full bg-base-300 skeleton" />
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <div className="rounded-lg w-[50px] mb-2 h-5 bg-base-300 skeleton" />
          <div className="rounded-lg w-[50px] mb-2 h-5 bg-base-300 skeleton" />
          <div className="rounded-lg w-[110px] mb-2 h-5 bg-base-300 skeleton" />
        </div>
      </div>
    );
  };

  if (isFetching) {
    return (
      <div>
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
        {renderExerciseSkeleton()}
      </div>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <div>
      {workout.exercises.length === 0 && (
        <div className="flex flex-row items-center justify-center w-full">
          No exercises
          <LuFrown className="h-4 w-4 ml-2" />
        </div>
      )}

      <div className="overflow-y-scroll h-[32rem]">
        {workout.exercises.map((exercise) => (
          <div className="bg-base-200 p-3 rounded-lg mb-5" key={exercise.id}>
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="font-semibold">{exercise.name}</div>
              <div className="flex flex-row">
                <LuPencil className="h-5 w-5" onClick={() => editExercise(exercise)} />
                <LuX className="h-6 w-6 ml-2" onClick={() => showDeleteModal(exercise)} />
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <div>Reps: {exercise.reps}</div>
              <div>Sets: {exercise.sets}</div>
              <div>Weight: {exercise.weight} (kg)</div>
            </div>
          </div>
        ))}
      </div>

      {renderDeleteModal()}
    </div>
  );
};
