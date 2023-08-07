import { useExercisesCanvasStore } from '@/stores/exercises-canvas.store';
import { useWorkoutsStore } from '@/stores/workouts.store';
import { AddExerciseSchema, addExerciseSchema } from '@/types/exercise.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { LuFrown, LuPencil, LuPlusCircle, LuX } from 'react-icons/lu';

export const ExercisesForm = () => {
  const { loadWorkouts } = useWorkoutsStore((state) => ({
    loadWorkouts: state.loadWorkouts,
  }));

  const { isSaving, exercises, addExercise, removeExercise, saveExerciseList, setIsCanvasOpen } =
    useExercisesCanvasStore((state) => ({
      isSaving: state.isSaving,
      exercises: state.exercises,
      setIsCanvasOpen: state.setIsCanvasOpen,
      addExercise: state.addExercise,
      removeExercise: state.removeExercise,
      saveExerciseList: state.saveExerciseList,
    }));

  const onSaveClick = async () => {
    await saveExerciseList();
    setIsCanvasOpen(false);
    setTimeout(() => {
      loadWorkouts();
    }, 500);
  };

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

  const addExerciseToList = async (data: AddExerciseSchema) => {
    addExercise(data);
    reset();
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(addExerciseToList)} tabIndex={-1}>
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
          <button className="btn btn-square mt-7">
            <LuPlusCircle className="h-7 w-7" />
          </button>
        </div>
      </form>

      <div className="divider" />

      {exercises.length === 0 && (
        <div className="flex flex-row items-center justify-center w-full">
          No exercises
          <LuFrown className="h-4 w-4 ml-2" />
        </div>
      )}

      <div className="overflow-y-scroll h-[27rem]">
        {exercises.map((exercise) => (
          <div className="bg-base-100 p-3 rounded-lg mb-5" key={exercise.id}>
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="font-semibold">{exercise.name}</div>
              <div className="flex flex-row">
                <LuPencil className="h-5 w-5" onClick={() => removeExercise(exercise.id)} />
                <LuX className="h-6 w-6 ml-2" onClick={() => removeExercise(exercise.id)} />
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <div>Sets: {exercise.sets}</div>
              <div>Reps: {exercise.reps}</div>
              <div>Weight: {exercise.weight} (kg)</div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-neutral text-white absolute bottom-[25px] left-4 w-[100px]"
        onClick={() => onCloseClick()}
        disabled={isSaving}>
        Close
      </button>

      <button
        className="btn btn-primary text-white absolute bottom-[25px] right-4"
        onClick={() => onSaveClick()}
        disabled={isSaving}>
        {isSaving && <span className="loading loading-spinner" />}
        Save Workout
      </button>
    </div>
  );
};
