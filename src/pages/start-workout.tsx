import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';

export default function StartWorkout() {
  return (
    <Layout page={PAGE_URL.START_WORKOUT}>
      <div className="flex justify-center text-center m-5">Start Workout</div>
    </Layout>
  );
}
