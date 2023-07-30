import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';
import { FaSignOutAlt } from 'react-icons/fa';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <Layout page={PAGE_URL.PROFILE}>
      <div className="m-5">
        <div>
          <h1 className="text-2xl mb-5">My Account:</h1>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={session?.user?.name as string}
              className="input input-bordered w-full mb-2"
              disabled
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              value={session?.user?.email as string}
              className="input input-bordered w-full mb-2"
              disabled
            />
          </div>

          <button className="btn w-36 mt-5" onClick={() => signOut()}>
            <FaSignOutAlt className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </Layout>
  );
}
