import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FloatingButton } from '@/components/shared/floating-button';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { useWorkoutsStore } from '@/stores/workouts.store';
import { WorkoutsList } from '@/components/workouts-list';
import { useWorkoutCanvasStore } from '@/stores/workout-canvas.store';

export default function Home() {
  const { loadWorkouts } = useWorkoutsStore((state) => ({
    loadWorkouts: state.loadWorkouts,
  }));

  const { isSaving, isCanvasOpen, setIsCanvasOpen, createWorkout, workoutModel, clearWorkoutModel, setWorkoutModel } =
    useWorkoutCanvasStore((state) => ({
      isCanvasOpen: state.isCanvasOpen,
      workoutModel: state.workoutModel,
      isSaving: state.isSaving,
      setIsCanvasOpen: state.setIsCanvasOpen,
      createWorkout: state.createWorkout,
      clearWorkoutModel: state.clearWorkoutModel,
      setWorkoutModel: state.setWorkoutModel,
    }));

  const onClose = () => {
    setIsCanvasOpen(false);
    clearWorkoutModel();
  };

  const onSaveClick = async () => {
    await createWorkout();
    clearWorkoutModel();
    loadWorkouts();
  };

  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="m-5">
        <h1 className="text-lg mb-10">Workouts</h1>

        <WorkoutsList />

        <BottomOffcanvas title="Add Workout" isOpen={isCanvasOpen} onClose={() => onClose()}>
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
              <div>
                <div className="mb-5">Exercises:</div>
                <div>
                  <label className="label">Exercise Name</label>
                  <input name="exerciseName" className="input input-bordered w-full w-full mb-2" type="text" />
                </div>
                <div className="flex flex-row gap-2">
                  <div>
                    <label className="label">Reps</label>
                    <input name="exerciseName" className="input input-bordered w-full w-full mb-2" type="number" />
                  </div>
                  <div>
                    <label className="label">Sets</label>
                    <input name="exerciseName" className="input input-bordered w-full w-full mb-2" type="number" />
                  </div>
                </div>
              </div>
              <button className="btn btn-outline">Add</button>
              <button
                className="btn btn-primary text-white absolute bottom-[80px] right-[20px]"
                onClick={() => onSaveClick()}
                disabled={isSaving}>
                {isSaving && <span className="loading loading-spinner" />}
                Save Workout
              </button>
            </div>
          </div>
        </BottomOffcanvas>
        <FloatingButton onClick={() => setIsCanvasOpen(true)} />
      </div>
    </Layout>
  );
}
