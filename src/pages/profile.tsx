import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { registerServiceWorker } from '@/utils/service-worker.helper';

export default function Profile() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const onSubscribeToNotificationsClick = async () => {
    registerServiceWorker();
  };

  return (
    <Layout page={PAGE_URL.PROFILE}>
      <div className="m-5">
        <div>
          <h1 className="text-lg mb-5">{t('My Account')}</h1>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t('Person Name')}</span>
            </label>
            <input
              type="text"
              defaultValue={session?.user?.name as string}
              className="input input-bordered w-full mb-2 !text-slate-600 dark:!text-slate-400"
              disabled
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t('Email')}</span>
            </label>
            <input
              type="text"
              defaultValue={session?.user?.email as string}
              className="input input-bordered w-full mb-2 !text-slate-600 dark:!text-slate-400"
              disabled
            />
          </div>

          <button className="btn w-36 mt-5" onClick={() => onSubscribeToNotificationsClick()}>
            Subscribe to Notifications
          </button>

          <button className="btn w-36 mt-5" onClick={() => signOut()}>
            <FaSignOutAlt className="w-4 h-4 mr-2" />
            {t('Sign out')}
          </button>
        </div>
      </div>
    </Layout>
  );
}
