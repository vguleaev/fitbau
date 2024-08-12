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
      <div>
        <div className="w-[60px] h-6 mb-2 bg-base-300 skeleton" />
        <div className="w-[160px] h-6 mb-5 bg-base-300 skeleton" />
      </div>
    );
  };

  const renderWorkoutHeader = () => {
    if (isFetching) {
      return renderWorkoutSkeleton();
    }

    return (
      <div>
        <div className="link flex flex-row items-center mb-2 no-underline" onClick={() => router.push('/workouts')}>
          <LuChevronsLeft className="w-5 h-5 mr-1" />
          {t('Back')}
        </div>
        <h1 className="text-lg mb-5 font-bold">{workout?.name}</h1>
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
