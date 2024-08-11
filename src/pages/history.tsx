import React, { useState } from 'react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { useWorkoutPlaysHistory } from '@/hooks/workouts.hooks';
import dayjs from 'dayjs';
import { WorkoutPlay } from '@prisma/client';
import { LuClock, LuHourglass } from 'react-icons/lu';
import { BottomOffcanvas } from '@/components/shared/bottom-offcanvas';
import { WorkoutPlayDetails } from '@/components/workout-play-details';
import { getWorkoutPlayDuration } from '@/utils/workout-play.helper';
import { useTranslation } from 'react-i18next';

export default function History() {
  const { t } = useTranslation();
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
            className="bg-base-200 rounded-md p-4">
            <h2 className="text-lg mb-4 font-semibold">{workoutPlay.name}</h2>
            <div className="flex fle-row justify-between">
              <div>{dayjs(workoutPlay.createdAt).format('DD.MM.YYYY')}</div>
              <div className="flex items-center">
                {getWorkoutPlayDuration(workoutPlay)} {t('minutes')}
                <LuHourglass className="h-5 w-5 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getPlayTitle = () => {
    return selectedPlay?.name || '';
  };

  const renderContent = () => {
    if (isFetching) {
      return (
        <div>
          <div className="flex flex-col gap-5">
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
            <div className="skeleton w-full h-[100px] p-4 bg-base-200">
              <div className="skeleton w-[180px] h-6 mb-4 bg-base-300" />
            </div>
          </div>
        </div>
      );
    }

    if (!history || !history.length) {
      return (
        <div className="mt-10 flex flex-col gap-5 text-center items-center">
          <div>{t('You do not have any workout history yet.')}</div>
          <LuClock className="h-10 w-10 text-primary" />
        </div>
      );
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
      <div className="m-5 mb-20">
        <h1 className="text-lg mb-5">{t('History')}</h1>
        {renderContent()}
      </div>
    </Layout>
  );
}
