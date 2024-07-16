import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import { FaDumbbell, FaPlayCircle, FaClock } from 'react-icons/fa';

type ComponentProps = {
  page: string;
};

export const BottomNav = ({ page }: ComponentProps) => {
  const router = useRouter();

  return (
    <div className="btm-nav bg-base-200 shadow-lg">
      <button
        className={`text-primary bg-base-200 ${
          [PAGE_URL.WORKOUTS, PAGE_URL.WORKOUT_DETAILS].includes(page) && 'active'
        }`}
        onClick={() => router.push(PAGE_URL.WORKOUTS)}>
        <FaDumbbell className="h-5 w-5" />
      </button>
      <button
        className={`text-primary bg-base-200 ${PAGE_URL.START_WORKOUT == page && 'active'}`}
        onClick={() => router.push(PAGE_URL.START_WORKOUT)}>
        <FaPlayCircle className="h-5 w-5" />
      </button>
      <button
        className={`text-primary bg-base-200 ${PAGE_URL.HISTORY == page && 'active'}`}
        onClick={() => router.push(PAGE_URL.HISTORY)}>
        <FaClock className="h-5 w-5" />
      </button>
    </div>
  );
};
