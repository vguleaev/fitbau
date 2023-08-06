import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FloatingButton } from '@/components/shared/floating-button';
import { WorkoutsList } from '@/components/workouts-list';
import { useWorkoutCanvasStore } from '@/stores/workout-canvas.store';
import { useEffect, useState } from 'react';
import { useWorkoutsStore } from '@/stores/workouts.store';
import { DialogModal } from '@/components/shared/dialog-modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Workouts() {
  const { createWorkout } = useWorkoutCanvasStore((state) => ({
    createWorkout: state.createWorkout,
  }));

  const { loadWorkouts } = useWorkoutsStore((state) => ({
    loadWorkouts: state.loadWorkouts,
  }));

  const [isAddWorkoutDialogOpen, setAddWorkoutDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const showAddWorkoutModal = () => {
    setAddWorkoutDialogOpen(true);
  };

  const addWorkoutSchema = z.object({
    name: z.string().nonempty(),
  });

  type AddWorkoutSchema = z.infer<typeof addWorkoutSchema>;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AddWorkoutSchema>({
    resolver: zodResolver(addWorkoutSchema),
  });

  const onAddWorkoutClick = async (data: AddWorkoutSchema) => {
    await createWorkout(data);
    loadWorkouts();
    setAddWorkoutDialogOpen(false);
    reset();
  };

  const renderAddWorkoutModal = () => {
    return (
      <DialogModal isOpened={isAddWorkoutDialogOpen} onClose={() => setAddWorkoutDialogOpen(false)}>
        <div>
          <h3 className="font-bold text-lg">Add Workout</h3>
          <form onSubmit={handleSubmit(onAddWorkoutClick)}>
            <div className="mb-5">
              <label className="label">Name</label>
              <input required {...register('name')} className="input input-bordered w-full w-full mb-2" type="text" />
            </div>
            <div className="flex flex-row justify-between">
              <button
                type="reset"
                className="btn btn-default min-w-[80px]"
                onClick={() => setAddWorkoutDialogOpen(false)}>
                No
              </button>
              <button type="submit" className="btn btn-primary min-w-[80px] text-white" disabled={isSubmitting}>
                {isSubmitting && <span className="loading loading-spinner" />}
                Yes
              </button>
            </div>
          </form>
        </div>
      </DialogModal>
    );
  };

  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="m-5">
        <h1 className="text-lg mb-10">Workouts</h1>
        <WorkoutsList />
        <FloatingButton onClick={() => showAddWorkoutModal()} />
        {renderAddWorkoutModal()}
      </div>
    </Layout>
  );
}
