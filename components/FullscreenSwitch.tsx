import { useState, type FC } from 'react';

const FullscreenSwitch: FC<Record<'isNavOpen' | 'allowForMobile', boolean>> = (props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getFullscreenElement = () => {
    if (typeof window !== 'undefined') {
      return window.document.fullscreenElement;
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
        !props.isNavOpen && props.allowForMobile ? 'fullscreenswitch-wrapper' : 'fullscreenswitch-wrapper navOpen'
      }
    >
      <button onClick={handleFullscreenSwitch} title="Fullscreen">
        <i className={isFullscreen ? 'neu-compress' : 'neu-expand-view'}></i>
      </button>
    </div>
  );
};

export default FullscreenSwitch;
