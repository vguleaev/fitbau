import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FloatingButton } from '@/components/shared/floating-button';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { WorkoutsList } from '@/components/workouts-list';
import { useWorkoutCanvasStore } from '@/stores/workout-canvas.store';
import { WorkoutForm } from '@/components/workout-form';

export default function Home() {
  const { isCanvasOpen, setIsCanvasOpen, clearWorkoutModel } = useWorkoutCanvasStore((state) => ({
    isCanvasOpen: state.isCanvasOpen,
    workoutModel: state.workoutModel,
    setIsCanvasOpen: state.setIsCanvasOpen,
    clearWorkoutModel: state.clearWorkoutModel,
  }));

  const onClose = () => {
    setIsCanvasOpen(false);
    clearWorkoutModel();
  };

  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="m-5">
        <h1 className="text-lg mb-10">Workouts</h1>

        <WorkoutsList />

        <BottomOffcanvas title="Add Workout" isOpen={isCanvasOpen} onClose={() => onClose()}>
          <WorkoutForm />
        </BottomOffcanvas>

        <FloatingButton onClick={() => setIsCanvasOpen(true)} />
      </div>
    </Layout>
  );
}
