import React from 'react';
import { FaBars } from 'react-icons/fa';

import { Mulish } from 'next/font/google';
import { ThemeToggle } from '@/components/shared/theme-toggle';

const mulish = Mulish({ subsets: ['latin'], weight: ['400'] });

export const Navbar = () => {
  return (
    <div className="navbar bg-primary text-white shadow-lg">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-square no-animation btn-ghost">
          <FaBars className="h-5 w-5" />
        </label>
      </div>
      <div className="flex-1">
        <a className={`btn btn-ghost no-animation normal-case text-lg ${mulish.className}`}>Fitbau</a>
      </div>
      <div className="dropdown dropdown-end text-lg">
        <ThemeToggle />
      </div>
    </div>
  );
};
