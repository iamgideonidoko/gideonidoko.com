import React, { useState, useEffect } from 'react';

const systemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

const ThemeSwitch = (props) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const currentTheme = window.localStorage.getItem('gideonidoko.com-theme');
        setTheme(
            currentTheme && ['light', 'dark'].includes(currentTheme)
                ? (window.localStorage.getItem('gideonidoko.com-theme') as string)
                : systemTheme(),
        );
    }, []);

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
        document.documentElement.setAttribute(
            'data-theme',
            window.localStorage.getItem('gideonidoko.com-theme') || theme,
        );
    }

    return (
        <div
            className={!props.isNavOpen && props.allowForMobile ? 'themeswitch-wrapper' : 'themeswitch-wrapper navOpen'}
        >
            {/* <button style={{ zIndex: '50000' }} onClick={handleSwitch}>
                <i className={theme === 'dark' ? 'neu-moon-stars' : 'neu-sun'}></i>
            </button> */}
            <span>
                <input type="checkbox" id="toggle" checked={theme === 'dark'} className="offscreen" />
                <label htmlFor="toggle" className="switch" onClick={handleSwitch}></label>
            </span>
        </div>
    );
};

export default ThemeSwitch;
