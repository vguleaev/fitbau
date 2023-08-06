import { useWorkoutCanvasStore } from '@/stores/workout-canvas.store';
import { useWorkoutsStore } from '@/stores/workouts.store';
import React from 'react';
import { LuPlusCircle, LuX } from 'react-icons/lu';

export const WorkoutForm = () => {
  const { loadWorkouts } = useWorkoutsStore((state) => ({
    loadWorkouts: state.loadWorkouts,
  }));

  const {
    isSaving,
    createWorkout,
    workoutModel,
    clearWorkoutModel,
    setWorkoutModel,
    exercises,
    exerciseModel,
    addExercise,
    setExerciseModel,
    removeExercise,
  } = useWorkoutCanvasStore((state) => ({
    workoutModel: state.workoutModel,
    isSaving: state.isSaving,
    createWorkout: state.createWorkout,
    clearWorkoutModel: state.clearWorkoutModel,
    setWorkoutModel: state.setWorkoutModel,
    addExercise: state.addExercise,
    removeExercise: state.removeExercise,
    setExerciseModel: state.setExerciseModel,
    exercises: state.exercises,
    exerciseModel: state.exerciseModel,
  }));

  const onSaveClick = async () => {
    await createWorkout();
    clearWorkoutModel();
    loadWorkouts();
  };

  const addExerciseToList = () => {
    addExercise(exerciseModel);
    setExerciseModel({ name: '', reps: 0, sets: 0, weight: 0 });
  };

  return (
    <div>
      <div className="mt-5">
        <div>
          <div className="mb-5">
            <label className="label">Name</label>
            <input
              required
              name="name"
              value={workoutModel.name}
              onChange={(e) =>
                setWorkoutModel({
                  name: e.target.value,
                })
              }
              className="input input-bordered w-full w-full mb-2"
              type="text"
            />
          </div>
          <div className="divider" />
          <div className="">
            <div>
              <label className="label">Exercise Name</label>
              <input
                name="exerciseName"
                className="input input-bordered w-full w-full mb-2"
                type="text"
                value={exerciseModel.name}
                onChange={(e) =>
                  setExerciseModel({
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div>
                <label className="label">Reps</label>
                <input
                  name="reps"
                  className="input input-bordered w-full w-full mb-2"
                  type="number"
                  value={exerciseModel.reps}
                  onChange={(e) =>
                    setExerciseModel({
                      reps: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">Sets</label>
                <input
                  name="sets"
                  className="input input-bordered w-full w-full mb-2"
                  type="number"
                  value={exerciseModel.sets}
                  onChange={(e) =>
                    setExerciseModel({
                      sets: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  name="weight"
                  className="input input-bordered w-full w-full mb-2"
                  type="number"
                  value={exerciseModel.weight}
                  onChange={(e) =>
                    setExerciseModel({
                      weight: Number(e.target.value),
                    })
                  }
                />
              </div>
              <button className="btn btn-square mt-7" onClick={() => addExerciseToList()}>
                <LuPlusCircle className="h-7 w-7" />
              </button>
            </div>
          </div>

          <div className="mt-5 mb-5">Exercises:</div>

          {exercises.length === 0 && <div>Empty list</div>}

          <div className="overflow-y-scroll h-[19rem]">
            {exercises.map((exercise) => (
              <div className="bg-base-100 p-3 rounded mb-5" key={exercise.id}>
                <div className="flex flex-row justify-between">
                  <div className="font-semibold mb-2">{exercise.name}</div>
                  <LuX className="h-5 w-5" onClick={() => removeExercise(exercise.id)} />
                </div>
                <div>Sets: {exercise.reps}</div>
                <div>Reps: {exercise.sets}</div>
                <div>Weight: {exercise.weight}</div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary text-white absolute bottom-[25px] right-4"
            onClick={() => onSaveClick()}
            disabled={isSaving}>
            {isSaving && <span className="loading loading-spinner" />}
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
};
