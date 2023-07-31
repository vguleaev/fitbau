import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import { FaDumbbell, FaUser, FaPlayCircle } from 'react-icons/fa';

type ComponentProps = {
  page: string;
};

export const BottomNav = ({ page }: ComponentProps) => {
  const router = useRouter();

  return (
    <div className="btm-nav bg-base-200 shadow-lg">
      <button
        className={`text-primary bg-base-200 ${PAGE_URL.WORKOUTS == page && 'active'}`}
        onClick={() => router.push(PAGE_URL.WORKOUTS)}>
        <FaDumbbell className="h-6 w-6 m-3" />
      </button>
      <button
        className={`text-primary bg-base-200 ${PAGE_URL.START_WORKOUT == page && 'active'}`}
        onClick={() => router.push(PAGE_URL.START_WORKOUT)}>
        <FaPlayCircle className="h-6 w-6 m-3" />
      </button>
      <button
        className={`text-primary bg-base-200 ${PAGE_URL.PROFILE == page && 'active'}`}
        onClick={() => router.push(PAGE_URL.PROFILE)}>
        <FaUser className="h-6 w-6 m-3" />
      </button>
    </div>
  );
};
