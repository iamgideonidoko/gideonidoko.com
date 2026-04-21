'use client';

import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import Nav from './Nav';

const Header = ({
  isNavOpen,
  setIsNavOpen,
  contentScrollPos: contentScrollPosRef,
}: {
  isNavOpen: boolean;
  setIsNavOpen: Dispatch<SetStateAction<boolean>>;
  contentScrollPos: MutableRefObject<number>;
}) => {
  const handleNavMenuBtnClick = () => {
    if (isNavOpen) {
      contentScrollPosRef.current = window.scrollY;
    }
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className={`header ${!isNavOpen ? 'force-sticky' : ''}`}>
      <div className="logo-wrap">
        <Link href="/">
          <Image
            src="/assets/img/GideonIdokoDevLogo.png"
            className="site-logo"
            alt="Gideon Idoko"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div>
        <ThemeSwitch isNavOpen={isNavOpen} />
        <Nav />
      </div>
      <div className="nav-adminmenu-wrap">
        <div>
          <button
            type="button"
            onClick={handleNavMenuBtnClick}
            className="nav-menu-btn"
            aria-haspopup="dialog"
            aria-controls="mobile-site-navigation"
            aria-expanded={!isNavOpen}
            aria-label={isNavOpen ? 'Open site navigation' : 'Close site navigation'}
          >
            <i className={!isNavOpen ? 'neu-close-lg' : 'neu-hamburger-menu'}></i>
          </button>
        </div>
        <div className="get-in-touch-desktop">
          <a
            href="mailto:iamgideonidoko@gmail.com?subject=I%20want%20to%20connect%20with%20you&body=Hello%2C%20I%27m%20..."
            className="animated-button animated-button--pallene__outline"
          >
            AVAILABLE FOR WORK
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
