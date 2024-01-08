import { useExerciseCanvasStore } from '@/stores/exercise-canvas.store';
import { useWorkoutDetailsStore } from '@/stores/workout-details.store';
import { AddExerciseSchema, addExerciseSchema } from '@/types/exercise.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

export const ExercisesForm = () => {
  const { loadWorkout, workout } = useWorkoutDetailsStore((state) => ({
    workout: state.workout,
    loadWorkout: state.loadWorkout,
  }));

  const { isSaving, addExercise, setIsCanvasOpen } = useExerciseCanvasStore((state) => ({
    isSaving: state.isSaving,
    setIsCanvasOpen: state.setIsCanvasOpen,
    addExercise: state.addExercise,
  }));

  const onCloseClick = () => {
    setIsCanvasOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddExerciseSchema>({
    resolver: zodResolver(addExerciseSchema),
  });

  const onSaveFormSubmit = async (data: AddExerciseSchema) => {
    await addExercise(data);
    reset();
    setIsCanvasOpen(false);

    setTimeout(() => {
      loadWorkout(workout.id);
    }, 500);
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSaveFormSubmit)} tabIndex={-1}>
        {errors.reps && <div className="text-red-500">Reps must be a positive number</div>}
        {errors.sets && <div className="text-red-500">Sets must be a positive number</div>}
        {errors.weight && <div className="text-red-500">Weight must be a positive number</div>}
        <div>
          <label className="label">Exercise Name</label>
          <input className="input input-bordered w-full w-full mb-2" type="text" required {...register('name')} />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div>
            <label className="label">Reps</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('reps')} />
          </div>
          <div>
            <label className="label">Sets</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('sets')} />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input className="input input-bordered w-full w-full mb-2" type="number" required {...register('weight')} />
          </div>
        </div>

        <button
          className="btn btn-neutral text-white absolute bottom-[25px] left-4 w-[100px]"
          onClick={() => onCloseClick()}
          disabled={isSaving}>
          Close
        </button>

        <button type="submit" className="btn btn-primary text-white absolute bottom-[25px] right-4" disabled={isSaving}>
          {isSaving && <span className="loading loading-spinner" />}
          Save Workout
        </button>
      </form>
    </div>
  );
};
