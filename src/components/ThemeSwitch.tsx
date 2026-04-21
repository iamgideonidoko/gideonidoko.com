'use client';

import { useEffect, useState, type FC } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'gideonidoko.com-theme';

const systemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getTheme = (): Theme => {
  const currentTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return currentTheme === 'light' || currentTheme === 'dark' ? currentTheme : systemTheme();
};

const applyTheme = (theme: Theme) => {
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
  document.documentElement.setAttribute('data-theme', theme);
};

const ThemeSwitch: FC<Partial<Record<'isNavOpen' | 'allowForMobile', boolean>>> = (props) => {
  const [theme, setTheme] = useState<Theme>(() => (typeof window === 'undefined' ? 'light' : getTheme()));

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleSwitch = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  return (
    <div className={!props.isNavOpen && props.allowForMobile ? 'themeswitch-wrapper' : 'themeswitch-wrapper navOpen'}>
      <button
        type="button"
        className="switch"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
        onClick={handleSwitch}
      >
        <span className="offscreen">{theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}</span>
      </button>
    </div>
  );
};

export default ThemeSwitch;
