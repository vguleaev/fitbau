import { LuMoon, LuSun } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>('dark');

  useEffect(() => {
    const storedTheme =
      localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(storedTheme);
    setTheme(storedTheme);
  }, []);

  const applyTheme = (t: string) => {
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
  };

  const onToggleClick = () => {
    const targetTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', targetTheme);
    applyTheme(targetTheme);
    setTheme(targetTheme);
  };

  return (
    <button
      className="btn btn-primary text-white no-animation fade-in"
      style={{ touchAction: 'manipulation' }}
      onClick={onToggleClick}>
      {theme === 'light' ? <LuSun className="h-5 w-5" /> : <LuMoon className="h-5 w-5" />}
    </button>
  );
};
