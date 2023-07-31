import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FloatingButton } from '@/components/shared/floating-button';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { useState } from 'react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="flex justify-center text-center m-5">
        Workouts
        <BottomOffcanvas isOpen={isOpen} onClose={() => onClose()}>
          <div className="mt-5">
            <input className="input input-bordered w-full max-w-xs mb-2" type="text" />
            <input className="input input-bordered w-full max-w-xs mb-2" type="text" />
            <input className="input input-bordered w-full max-w-xs mb-2" type="text" />
          </div>
        </BottomOffcanvas>
        <FloatingButton onClick={() => setIsOpen(!isOpen)} />
      </div>
    </Layout>
  );
}
