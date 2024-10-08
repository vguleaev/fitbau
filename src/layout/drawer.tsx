import PAGE_URL from '@/constants/page.constant';
import { useRouter } from 'next/router';
import React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaDumbbell, FaPlayCircle, FaRegClock, FaUser } from 'react-icons/fa';

type ComponentProps = {
  children: ReactNode;
};

export const Drawer = ({ children }: ComponentProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
          <li>
            <a className="text-[18px] mb-2" onClick={() => router.push(PAGE_URL.WORKOUTS)}>
              <FaDumbbell className="h-5 w-5 mr-2" />
              {t('Workouts')}
            </a>
          </li>
          <li>
            <a className="text-[18px] mb-2" onClick={() => router.push(PAGE_URL.START_WORKOUT)}>
              <FaPlayCircle className="h-5 w-5  mr-2" />
              {t('Start Workout')}
            </a>
          </li>
          <li>
            <a className="text-[18px] mb-2" onClick={() => router.push(PAGE_URL.HISTORY)}>
              <FaRegClock className="h-5 w-5  mr-2" />
              {t('History')}
            </a>
          </li>
          <li>
            <a className="text-[18px] mb-2" onClick={() => router.push(PAGE_URL.PROFILE)}>
              <FaUser className="h-5 w-5  mr-2" />
              {t('My Account')}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
