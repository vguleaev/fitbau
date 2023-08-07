import { LuMoon, LuSun } from 'react-icons/lu';
import styles from '../../styles/theme-toggle.module.scss';
import React, { useEffect } from 'react';

export const ThemeToggle = () => {
  useEffect(() => {
    themeCheck();
  }, []);

  const applyThemeClass = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const applyThemeAttribute = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const themeCheck = () => {
    const storedTheme =
      localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (storedTheme) {
      applyThemeAttribute(storedTheme);
      applyThemeClass(storedTheme);
    }
  };

  const onToggleClick = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = 'light';

    if (currentTheme === 'light') {
      targetTheme = 'dark';
    }
    localStorage.setItem('theme', targetTheme);
    applyThemeAttribute(targetTheme);
    applyThemeClass(targetTheme);
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
