import React, { useState } from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useWorkoutPlaysHistory } from '@/hooks/workouts.hooks';
import dayjs from 'dayjs';
import { WorkoutPlay } from '@prisma/client';
import { LuHourglass } from 'react-icons/lu';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { WorkoutPlayDetails } from '@/components/workout-play-details';
import { getWorkoutPlayDuration } from '@/utils/workout-play.helper';

export default function History() {
  const [isPlayDetailsCanvasOpen, setPlayDetailsCanvasOpen] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState<WorkoutPlay | null>(null);
  const { isFetching, data: history } = useWorkoutPlaysHistory();

  const renderHistory = (history: WorkoutPlay[]) => {
    return (
      <div className="flex flex-col gap-5">
        {history.map((workoutPlay) => (
          <div
            onClick={() => {
              setSelectedPlay(workoutPlay);
              setPlayDetailsCanvasOpen(true);
            }}
            key={workoutPlay.id}
            className="bg-base-200 rounded-md p-4 transition ease-in-out delay-100 duration-300">
            <h2 className="text-lg mb-4 font-semibold">{workoutPlay.name}</h2>
            <div className="flex fle-row justify-between">
              <div>{dayjs(workoutPlay.createdAt).format('DD.MM.YYYY')}</div>
              <div className="flex items-center">
                {getWorkoutPlayDuration(workoutPlay)} minutes
                <LuHourglass className="h-5 w-5 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getPlayTitle = () => {
    return selectedPlay?.name || 'Play Details';
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
        {renderHistory(history)}
        <BottomOffcanvas
          title={getPlayTitle()}
          isOpen={isPlayDetailsCanvasOpen}
          onClose={() => setPlayDetailsCanvasOpen(false)}>
          <WorkoutPlayDetails workoutPlay={selectedPlay} onClose={() => setPlayDetailsCanvasOpen(false)} />
        </BottomOffcanvas>
      </>
    );
  };

  return (
    <Layout page={PAGE_URL.HISTORY}>
      <div className="m-5 mb-20">{renderContent()}</div>
    </Layout>
  );
}
