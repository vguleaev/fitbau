import React from 'react';
import { FaBars, FaEllipsisH } from 'react-icons/fa';

export const Navbar = () => {
  return (
    <div className="navbar bg-primary text-white shadow-lg">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <FaBars className="h-5 w-5" />
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Fitbau</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <FaEllipsisH className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
