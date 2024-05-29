import { useState, useEffect, type FC } from 'react';

const systemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const getTheme = () => {
  const currentTheme = window.localStorage.getItem('gideonidoko.com-theme');
  return currentTheme && ['light', 'dark'].includes(currentTheme)
    ? (window.localStorage.getItem('gideonidoko.com-theme') as string)
    : systemTheme();
};

const ThemeSwitch: FC<Partial<Record<'isNavOpen' | 'allowForMobile', boolean>>> = (props) => {
  const [theme, setTheme] = useState(typeof window !== 'undefined' ? getTheme() : 'light');

  const isWindow = typeof window !== 'undefined';

  useEffect(() => {
    const currentTheme = window.localStorage.getItem('gideonidoko.com-theme');
    setTheme(
      currentTheme && ['light', 'dark'].includes(currentTheme)
        ? (window.localStorage.getItem('gideonidoko.com-theme') as string)
        : systemTheme(),
    );
  }, [isWindow]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    }
  }, [theme]);

  const handleSwitch = () => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        setTheme('light');
        window.localStorage.setItem('gideonidoko.com-theme', 'light');
      } else {
        setTheme('dark');
        window.localStorage.setItem('gideonidoko.com-theme', 'dark');
      }
    }
  };

  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', window.localStorage.getItem('gideonidoko.com-theme') || theme);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleChange = () => {};

  return (
    <div className={!props.isNavOpen && props.allowForMobile ? 'themeswitch-wrapper' : 'themeswitch-wrapper navOpen'}>
      <div>
        <input type="checkbox" id="toggle" onChange={handleChange} checked={theme === 'dark'} className="offscreen" />
        <label htmlFor="toggle" className="switch" onClick={handleSwitch}></label>
      </div>
    </div>
  );
};

export default ThemeSwitch;
