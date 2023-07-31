import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FloatingButton } from '@/components/shared/floating-button';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { useEffect, useState } from 'react';
import { useWorkoutsStore } from '@/stores/workouts.store';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoading, workouts, loadWorkouts } = useWorkoutsStore((state) => ({
    isLoading: state.isLoading,
    workouts: state.workouts,
    loadWorkouts: state.loadWorkouts,
  }));

  useEffect(() => {
    loadWorkouts();
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement & {
      name: { value: string };
    };

    const result = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: target.name.value,
      }),
    });

    if (result.status === 200) {
      toast.success(`Created!`);
      loadWorkouts();
      setIsOpen(false);
    } else {
      toast.error('Something went wrong :(');
    }
  };

  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="m-5">
        <h1 className="mb-10">Workouts</h1>

        {isLoading && <div>Loading...</div>}

        {workouts.map((workout) => (
          <div key={workout.id}>
            <div>{workout.name}</div>
            <div className="divider" />
          </div>
        ))}

        <BottomOffcanvas title="Add Workout" isOpen={isOpen} onClose={() => onClose()}>
          <div className="mt-5">
            <form onSubmit={(e) => onSubmit(e)}>
              <input required name="name" className="input input-bordered w-full max-w-xs mb-2" type="text" />
              <button className="btn btn-primary">Add</button>
            </form>
          </div>
        </BottomOffcanvas>
        <FloatingButton onClick={() => setIsOpen(!isOpen)} />
      </div>
    </Layout>
  );
}
