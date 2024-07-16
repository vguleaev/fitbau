import React from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useWorkoutPlaysHistory } from '@/hooks/workouts.hooks';
import dayjs from 'dayjs';
import { WorkoutPlay } from '@prisma/client';

export default function History() {
  const { isFetching, data: history } = useWorkoutPlaysHistory();

  const getDuration = (workoutPlay: WorkoutPlay) => {
    return dayjs(workoutPlay.finishedOn).diff(workoutPlay.createdAt, 'minute');
  };

  const renderHistory = (history: WorkoutPlay[]) => {
    return (
      <div className="flex flex-col gap-5">
        {history.map((workoutPlay) => (
          <div
            key={workoutPlay.id}
            className="bg-base-200 rounded-md p-4 transition ease-in-out delay-100 duration-300">
            <h2 className="text-lg mb-4 font-semibold">{workoutPlay.name}</h2>
            <div>
              <div>Date: {dayjs(workoutPlay.createdAt).format('DD.MM.YYYY')}</div>
              <div>Duration: {getDuration(workoutPlay)} minutes</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isFetching) {
      return <div>Loading...</div>;
    }

    if (!history || !history.length) {
      return <div className="mb-5">You do not have any workout history yet.</div>;
    }

    return (
      <>
        <h1 className="text-lg mb-5">Workout History</h1>
        {renderHistory(history)}
      </>
    );
  };

  return (
    <Layout page={PAGE_URL.HISTORY}>
      <div className="m-5 mb-20">{renderContent()}</div>
    </Layout>
  );
}
