import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import { ExercisesList } from '@/components/exercises-list';
import { FloatingButton } from '@/components/shared/floating-button';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { ExercisesForm } from '@/components/exercises-form';
import { useWorkout } from '@/hooks/workouts.hooks';
import { Exercise } from '@prisma/client';
import { LuChevronsLeft } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useExerciseBottomCanvasStore } from '@/stores/exercice-bottom-canvas.store';

export default function WorkoutDetails() {
  const { t } = useTranslation();

  const { isExerciseCanvasOpen, setExerciseCanvasOpen, selectedExercise, setSelectedExercise } =
    useExerciseBottomCanvasStore((state) => ({
      isExerciseCanvasOpen: state.isExerciseCanvasOpen,
      setExerciseCanvasOpen: state.setExerciseCanvasOpen,
      selectedExercise: state.selectedExercise,
      setSelectedExercise: state.setSelectedExercise,
    }));

  const router = useRouter();
  const workoutId = router.query.id as string;

  const { data: workout, isFetching } = useWorkout(workoutId);

  const onEditExercise = (exercise: Exercise) => {
    if (workout) {
      setSelectedExercise(exercise);
      setExerciseCanvasOpen(true);
    }
  };

  const showAddExerciseCanvas = () => {
    if (workout) {
      setSelectedExercise(null);
      setExerciseCanvasOpen(true);
    }
  };

  const getWorkoutFormTitle = () => {
    return selectedExercise ? t('Edit Exercise') : t('New Exercise');
  };

  const renderWorkoutSkeleton = () => {
    return (
      <div className="mb-6">
        <div className="w-[60px] h-4 mb-3 bg-base-300 skeleton rounded" />
        <div className="w-[180px] h-7 mb-1 bg-base-300 skeleton rounded" />
        <div className="w-[100px] h-4 bg-base-300 skeleton rounded" />
      </div>
    );
  };

  const renderWorkoutHeader = () => {
    if (isFetching) {
      return renderWorkoutSkeleton();
    }

    return (
      <div className="mb-6">
        <button
          className="flex flex-row items-center gap-1 text-sm text-base-content/50 hover:text-primary transition-colors mb-3"
          onClick={() => router.push('/workouts')}>
          <LuChevronsLeft className="w-4 h-4" />
          {t('Back')}
        </button>
        <h1 className="text-2xl font-bold tracking-tight">{workout?.name}</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          {workout?.exercises.length} {t('exercises')}
        </p>
      </div>
    );
  };

  return (
    <Layout page={PAGE_URL.WORKOUT_DETAILS}>
      <div className="m-5">
        {renderWorkoutHeader()}
        <ExercisesList onEditExercise={onEditExercise} />
        <FloatingButton onClick={() => showAddExerciseCanvas()} />
        <BottomOffcanvas
          title={getWorkoutFormTitle()}
          isOpen={isExerciseCanvasOpen}
          onClose={() => setExerciseCanvasOpen(false)}>
          <ExercisesForm exercise={selectedExercise} onClose={() => setExerciseCanvasOpen(false)} />
        </BottomOffcanvas>
      </div>
    </Layout>
  );
}
