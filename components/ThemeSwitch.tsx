import React, { useState, useEffect } from 'react';

const ThemeSwitch = (props) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        setTheme(
            window.localStorage.getItem('gideonidoko.com-theme')
                ? window.localStorage.getItem('gideonidoko.com-theme')
                : 'dark',
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
            <button style={{ zIndex: '50000' }} onClick={handleSwitch}>
                <i className={theme === 'dark' ? 'neu-moon-stars' : 'neu-sun'}></i>
            </button>
        </div>
    );
};

export default ThemeSwitch;
