'use client';

/* eslint-disable @next/next/no-img-element */
import { type ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import Header from '../Header';
import Footer from '../Footer';
import ThemeSwitch from '../ThemeSwitch';
import ButtonCtrl from '../../classes/ButtonCtrl';
import Canvas from '../../classes/Canvas';
import Cursor from '../../classes/Cursor';
import PageLoader from '../../classes/PageLoader';

const pageWithoutHeader: string[] = ['/p/test'];
const pageWithoutFooter: string[] = ['/p/test'];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const routeKey = pathname;

  const [isNavOpen, setIsNavOpen] = useState(true);
  const contentScrollPos = useRef(0);
  const cursorRef = useRef<Cursor | null>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const pageLoaderRef = useRef<PageLoader | null>(null);
  const isBackOrForwardNav = useRef(false);
  const initialRouteRender = useRef(true);

  const closeNav = () => {
    contentScrollPos.current = 0;
    setIsNavOpen(true);
  };

  const shouldHaveHeader = !pageWithoutHeader.includes(pathname);
  const shouldHaveFooter = !pageWithoutFooter.includes(pathname);

  useEffect(() => {
    const mainWrapper = window.document.querySelector<HTMLDivElement>('.main-wrapper');
    if (isNavOpen) {
      window.scrollTo(0, contentScrollPos.current);
      return;
    }

    mainWrapper?.scrollTo(0, contentScrollPos.current);
  }, [isNavOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    pageLoaderRef.current = new PageLoader();
    const initialLoaderTimeout = window.setTimeout(() => {
      pageLoaderRef.current?.animateOut();
    }, 2000);

    const lenis = new Lenis({
      lerp: 0.04,
      smoothWheel: true,
      syncTouch: false,
    });

    window.appLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    let animationFrameId = 0;
    const scrollFn = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      animationFrameId = window.requestAnimationFrame(scrollFn);
    };
    animationFrameId = window.requestAnimationFrame(scrollFn);

    const cursorElement = document.querySelector<SVGElement>('.cursor');
    if (cursorElement) {
      cursorRef.current = new Cursor(cursorElement);
    }

    return () => {
      window.clearTimeout(initialLoaderTimeout);
      window.cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.appLenis;
      canvasRef.current?.cleanUp();
    };
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      pageLoaderRef.current?.animateIn();
      const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
      if (canvasElement) {
        canvasElement.style.visibility = 'hidden';
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (
        nextUrl.origin !== currentUrl.origin ||
        `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}` ===
          `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      ) {
        return;
      }

      handleRouteChangeStart();
    };

    const handlePopState = () => {
      isBackOrForwardNav.current = true;
      handleRouteChangeStart();
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
    if (canvasElement && !ScrollTrigger.isTouch) {
      canvasRef.current?.cleanUp();
      canvasRef.current = new Canvas(canvasElement);
    }

    const cleanups: Array<() => void> = [];
    const bindCursorTargets = (elements: Iterable<Element>) => {
      for (const element of elements) {
        const handleEnter = () => cursorRef.current?.emit('enter');
        const handleLeave = () => cursorRef.current?.emit('leave');

        element.addEventListener('mouseenter', handleEnter);
        element.addEventListener('mouseleave', handleLeave);

        cleanups.push(() => {
          element.removeEventListener('mouseenter', handleEnter);
          element.removeEventListener('mouseleave', handleLeave);
        });
      }
    };

    bindCursorTargets(document.querySelectorAll('a'));
    bindCursorTargets(document.querySelectorAll('.wl-word .char'));

    const delayedBind = window.setTimeout(() => {
      bindCursorTargets(document.querySelectorAll('.wl-word .char'));
    }, 1000);

    const buttonControllers = [...document.querySelectorAll<HTMLElement>('.scroll-button')].map((el) => {
      const button = new ButtonCtrl(el);
      const handleEnter = () => cursorRef.current?.emit('enter');
      const handleLeave = () => cursorRef.current?.emit('leave');

      button.on('enter', handleEnter);
      button.on('leave', handleLeave);

      cleanups.push(() => {
        button.removeListener('enter', handleEnter);
        button.removeListener('leave', handleLeave);
      });

      return button;
    });

    if (initialRouteRender.current) {
      initialRouteRender.current = false;
      return () => {
        window.clearTimeout(delayedBind);
        cleanups.forEach((cleanup) => cleanup());
        buttonControllers.length = 0;
        canvasRef.current?.cleanUp();
      };
    }

    if (window.appLenis && !isBackOrForwardNav.current) {
      window.appLenis.scrollTo(0, {
        lock: true,
        duration: 0,
        immediate: true,
        force: true,
      });
    }

    isBackOrForwardNav.current = false;

    const showCanvasTimeout = window.setTimeout(() => {
      if (canvasElement) {
        canvasElement.style.visibility = 'visible';
      }
    }, 1000);
    const loaderTimeout = window.setTimeout(() => {
      pageLoaderRef.current?.animateOut();
    }, 1000);

    return () => {
      window.clearTimeout(delayedBind);
      window.clearTimeout(showCanvasTimeout);
      window.clearTimeout(loaderTimeout);
      cleanups.forEach((cleanup) => cleanup());
      buttonControllers.length = 0;
      canvasRef.current?.cleanUp();
    };
  }, [routeKey]);

  return (
    <>
      <div className={!isNavOpen ? 'mobileNavSection' : 'mobileNavSection addNegativeIndex'} suppressHydrationWarning>
        <div className="mobileNavActionBtn">
          <button onClick={() => setIsNavOpen(true)} className="closeMenuBtn">
            <i className="neu-close-lg"></i>Close Menu
          </button>
          <ThemeSwitch allowForMobile={true} />
        </div>

        <div className="mobileAdminName">
          <Link href="/" onClick={closeNav}>
            <img src="/assets/img/GideonIdokoDevLogo.png" className="site-footer-logo" alt="Gideon Idoko" />
          </Link>
          <span>Gideon Idoko</span>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/" onClick={closeNav}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/writing" onClick={closeNav}>
                Writing
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeNav}>
                About
              </Link>
            </li>
            <li>
              <Link href="/uses" onClick={closeNav}>
                Uses
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeNav}>
                Contact
              </Link>
            </li>
            <li>
              <a href="mailto:iamgideonidoko@gmail.com?subject=I%20want%20to%20connect%20with%20you&body=Hello%2C%20I%27m%20...">
                AVAILABLE FOR WORK
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} suppressHydrationWarning>
        <svg className="cursor" width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <filter id="filter-1" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
              <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="10" result="warp" />
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="60" in="SourceGraphic" in2="warp" />
            </filter>
          </defs>
          <circle className="cursor__inner" cx="70" cy="70" r="60" />
        </svg>
      </div>
      <div className={!isNavOpen ? 'main-wrapper mobile-nav-view' : 'main-wrapper'}>
        <div className="fixed-line" style={pathname.startsWith('/writing/') ? { background: 'none' } : {}} />
        <canvas id="canvas" />
        <div className="noise-bg"></div>
        {shouldHaveHeader && (
          <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} contentScrollPos={contentScrollPos} />
        )}
        {children}
        {shouldHaveFooter && <Footer />}
        <div className="page--overlay">
          <div className="page--overlay__loader">
            <img
              src="/assets/img/GideonIdokoDevLogo.png"
              width={50}
              height={50}
              className="site-logo"
              alt="Gideon Idoko"
            />
          </div>
        </div>
      </div>
    </>
  );
}
