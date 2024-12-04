'use client';

import { useEffect } from 'react';
import { themeChange } from 'theme-change';

export const useTheme = () => {
  useEffect(() => {
    themeChange(false);
    // false parameter is required for react project
  }, []);

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const getTheme = () => {
    return document.documentElement.getAttribute('data-theme');
  };

  return {
    setTheme,
    getTheme,
  };
}; 