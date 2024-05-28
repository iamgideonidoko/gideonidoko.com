/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
// import FullscreenSwitch from './FullscreenSwitch';
import Nav from './Nav';

const Header = ({
  isNavOpen,
  setIsNavOpen,
  contentScrollPos,
}: {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contentScrollPos: React.MutableRefObject<number>;
}) => {
  const handleNavMenuBtnClick = () => {
    if (isNavOpen) {
      contentScrollPos.current = window.scrollY;
    }
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className={`header ${!isNavOpen ? 'force-sticky' : ''}`}>
      <div className="logo-wrap">
        <Link href="/">
          <img src="/assets/img/GideonIdokoDevLogo.png" loading="lazy" className="site-logo" alt="Gideon Idoko" />
        </Link>
      </div>
      <div>
        <ThemeSwitch isNavOpen={isNavOpen} />
        <Nav />
      </div>
      <div className="nav-adminmenu-wrap">
        <div>
          <button onClick={handleNavMenuBtnClick} className="nav-menu-btn">
            <i className={!isNavOpen ? 'neu-close-lg' : 'neu-hamburger-menu'}></i>
          </button>
        </div>
        {/* <FullscreenSwitch isNavOpen={isNavOpen} /> */}
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
