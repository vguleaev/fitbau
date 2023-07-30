import { useSession, signOut } from 'next-auth/react';
import React from 'react';
import { FaBars, FaEllipsisH, FaSignOutAlt } from 'react-icons/fa';

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-primary text-white shadow-lg">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <FaBars className="h-5 w-5" />
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case">Fitbau</a>
      </div>
      <div className="dropdown dropdown-end text-lg">
        <label tabIndex={0} className="btn btn-square btn-ghost">
          <FaEllipsisH className="h-5 w-5" />
        </label>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52 text-base-content">
          <li>
            <a className="text-md">{session?.user?.name}</a>
          </li>
          <div className="divider m-0" />
          <li>
            <a className="text-md" onClick={() => signOut()}>
              <FaSignOutAlt className="w-4 h-4 mr-2" /> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
