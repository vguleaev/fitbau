import { LuMoon, LuSun } from 'react-icons/lu';
import styles from '../../styles/theme-toggle.module.scss';
import React, { useEffect } from 'react';

export const ThemeToggle = () => {
  useEffect(() => {
    themeCheck();
  }, []);

  const themeCheck = () => {
    const storedTheme =
      localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  };

  const onToggleClick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = 'light';

    if (currentTheme === 'light') {
      targetTheme = 'dark';
    }

    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  };

  return (
    <div>
      <button
        className={`btn btn-primary text-white no-animation fade-in ${styles.themeLight} hidden`}
        onClick={() => onToggleClick()}>
        <LuSun className="h-5 w-5" />
      </button>
      <button
        className={`btn btn-primary text-white no-animation fade-in ${styles.themeDark} hidden`}
        onClick={() => onToggleClick()}>
        <LuMoon className="h-5 w-5" />
      </button>
    </div>
  );
};
