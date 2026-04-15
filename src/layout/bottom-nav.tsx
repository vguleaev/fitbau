import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import { FaDumbbell, FaPlayCircle, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

type ComponentProps = {
  page: string;
};

export const BottomNav = ({ page }: ComponentProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-base-200 shadow-lg flex flex-row z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 text-primary bg-base-200 border-t-2 ${
          [PAGE_URL.WORKOUTS, PAGE_URL.WORKOUT_DETAILS].includes(page) ? 'border-primary' : 'border-transparent'
        }`}
        onClick={() => router.push(PAGE_URL.WORKOUTS)}>
        <FaDumbbell className="h-5 w-5" />
        <span className="text-[12px]">{t('Workouts')}</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 text-primary bg-base-200 border-t-2 ${
          PAGE_URL.START_WORKOUT == page ? 'border-primary' : 'border-transparent'
        }`}
        onClick={() => router.push(PAGE_URL.START_WORKOUT)}>
        <FaPlayCircle className="h-5 w-5" />
        <span className="text-[12px]">{t('Start Workout')}</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 text-primary bg-base-200 border-t-2 ${
          PAGE_URL.HISTORY == page ? 'border-primary' : 'border-transparent'
        }`}
        onClick={() => router.push(PAGE_URL.HISTORY)}>
        <FaClock className="h-5 w-5" />
        <span className="text-[12px]">{t('History')}</span>
      </button>
    </div>
  );
};
