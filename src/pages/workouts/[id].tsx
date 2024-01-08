import React, { useEffect } from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import { ExercisesList } from '@/components/exercises-list';
import { useWorkoutDetailsStore } from '@/stores/workout-details.store';
import { FloatingButton } from '@/components/shared/floating-button';
import { useExerciseCanvasStore } from '@/stores/exercise-canvas.store';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { ExercisesForm } from '@/components/exercises-form';

export default function WorkoutDetails() {
  const router = useRouter();
  const workoutId = router.query.id as string;

  const { workout, loadWorkout, isLoading } = useWorkoutDetailsStore((state) => ({
    loadWorkout: state.loadWorkout,
    isLoading: state.isLoading,
    workout: state.workout,
  }));

  const { isCanvasOpen, setIsCanvasOpen, setWorkout } = useExerciseCanvasStore((state) => ({
    isCanvasOpen: state.isCanvasOpen,
    setIsCanvasOpen: state.setIsCanvasOpen,
    setWorkout: state.setWorkout,
  }));

  useEffect(() => {
    if (!workoutId) {
      return;
    }
    loadWorkout(workoutId);
  }, [workoutId]);

  const showAddExerciseCanvas = () => {
    setWorkout(workout);
    setIsCanvasOpen(true);
  };

  const onBottomCanvasClose = () => {
    setIsCanvasOpen(false);
  };

  const getWorkoutFormTitle = () => {
    return 'New Exercise';
  };

  const renderWorkoutDetails = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="m-5">
        <div className="link mb-2" onClick={() => router.push('/workouts')}>
          Back
        </div>
        <h1 className="text-lg mb-10">Workout: {workout.name}</h1>
        <ExercisesList />
        <FloatingButton onClick={() => showAddExerciseCanvas()} />

        <BottomOffcanvas title={getWorkoutFormTitle()} isOpen={isCanvasOpen} onClose={() => onBottomCanvasClose()}>
          <ExercisesForm />
        </BottomOffcanvas>
      </div>
    );
  };

  return <Layout page={PAGE_URL.WORKOUT_DETAILS}>{renderWorkoutDetails()}</Layout>;
}
