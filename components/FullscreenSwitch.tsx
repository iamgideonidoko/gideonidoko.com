import React, { useState } from 'react';

const FullscreenSwitch = (props) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const getFullscreenElement = () => {
        if (typeof window !== 'undefined') {
            return (
                window.document.fullscreenElement ||
                window.document.webkitFullscreenElemnt ||
                window.document.mozFullscreenElement ||
                window.document.msFullscreenElement
            );
        } else {
            return null;
        }
    };

    const handleFullscreenSwitch = () => {
        if (typeof window !== 'undefined') {
            if (getFullscreenElement()) {
                window.document.exitFullscreen();
            } else {
                window.document.documentElement.requestFullscreen().catch((e) => {
                    console.error(e);
                });
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.document.addEventListener('fullscreenchange', () => {
            setIsFullscreen(!isFullscreen);
        });
    }

    return (
        <div
            className={
                !props.isNavOpen && props.allowForMobile
                    ? 'fullscreenswitch-wrapper'
                    : 'fullscreenswitch-wrapper navOpen'
            }
        >
            <button onClick={handleFullscreenSwitch} title="Fullscreen">
                <i className={isFullscreen ? 'neu-compress' : 'neu-expand-view'}></i>
            </button>
        </div>
    );
};

export default FullscreenSwitch;
