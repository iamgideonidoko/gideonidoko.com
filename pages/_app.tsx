/* eslint-disable @next/next/no-img-element */
import '../styles/globals.css';
import '../styles/prism-night-owl.css';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeSwitch from '../components/ThemeSwitch';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Lenis from '@studio-freight/lenis';
import Cursor from '../classes/Cursor';
import ButtonCtrl from '../classes/ButtonCtrl';
import Canvas from '../classes/Canvas';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';
import PageLoader from '../classes/PageLoader';

const pageWithoutHeader: string[] = ['/p/test'];
const pageWithoutFooter: string[] = ['/p/test'];

function MyApp({ Component, pageProps }: AppProps) {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
  const contentScrollPos = useRef<number>(0);

  const closeNav = () => {
    contentScrollPos.current = 0;
    setIsNavOpen(true);
  };

  const router = useRouter();

  const shouldHaveHeader = pageWithoutHeader.indexOf(router.pathname) === -1;
  const shouldHaveFooter = pageWithoutFooter.indexOf(router.pathname) === -1;

  // REFS
  const cursorRef = useRef<Cursor | null>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const pageLoaderRef = useRef<PageLoader | null>(null);
  const isBackOrForwardNav = useRef(false);

  // HANDLERS
  const handleRouteChangeStart = () => {
    pageLoaderRef.current?.animateIn();
    const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
    if (canvasElement) {
      canvasElement.style.visibility = 'hidden';
    }
  };

  const handleRouteChangeComplete = () => {
    if (window.lenis && !isBackOrForwardNav.current) {
      window.lenis.scrollTo(0, {
        lock: true,
        duration: 0,
        immediate: true,
        force: true,
      });
    }
    isBackOrForwardNav.current = false;
    const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
    if (canvasElement) {
      setTimeout(() => {
        canvasElement.style.visibility = 'visible';
      }, 1000);
    }
    setTimeout(() => pageLoaderRef.current?.animateOut(), 1000);
  };

  const handleRouteChangeError = () => {
    const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
    if (canvasElement) {
      setTimeout(() => {
        canvasElement.style.visibility = 'visible';
      }, 1000);
    }
    setTimeout(() => pageLoaderRef.current?.animateOut(), 1000);
  };

  // EFFECTS

  useEffect(() => {
    const mainWrapper = window.document.querySelector('.main-wrapper') as HTMLDivElement;
    if (isNavOpen) {
      window.scrollTo(0, contentScrollPos.current);
    } else {
      mainWrapper?.scrollTo(0, contentScrollPos.current);
    }
  }, [isNavOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Page loader
    pageLoaderRef.current = new PageLoader();
    setTimeout(() => {
      pageLoaderRef.current?.animateOut();
    }, 2000);
    // Enable Lenis scrolling
    const lenis = new Lenis({
      lerp: 0.04,
      // smoothTouch: true,
      smoothWheel: true,
      syncTouch: true,
      gestureOrientation: 'both',
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const scrollFn = (time: number) => {
      lenis.raf(time); // Runs lenis' requestAnimationFrame method
      requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn); // Start the animation frame loop

    const cursorElement = document.querySelector<SVGElement>('.cursor');
    if (cursorElement) {
      cursorRef.current = new Cursor(cursorElement);
    }

    // ANALYTICS
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...arg: (string | Date)[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push(Object.assign({}, arg));
      }
      gtag('js', new Date());

      gtag('config', 'G-QJ2RYXMK6E');
    }
  }, []);

  useEffect(() => {
    const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
    if (canvasElement) {
      canvasRef.current = new Canvas(canvasElement);
    }

    router.beforePopState(() => {
      isBackOrForwardNav.current = true;
      return true;
    });
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    // Register when route changes
    if (cursorRef.current) {
      [...document.querySelectorAll('a'), ...document.querySelectorAll('.wl-word .char')].forEach((el) => {
        el.addEventListener('mouseenter', () => cursorRef.current?.emit('enter'));
        el.addEventListener('mouseleave', () => cursorRef.current?.emit('leave'));
      });

      setTimeout(() => {
        [...document.querySelectorAll('.wl-word .char')].forEach((el) => {
          el.addEventListener('mouseenter', () => cursorRef.current?.emit('enter'));
          el.addEventListener('mouseleave', () => cursorRef.current?.emit('leave'));
        });
      }, 1000);

      [...document.querySelectorAll<HTMLButtonElement>('.scroll-button')].forEach((el) => {
        const button = new ButtonCtrl(el);
        button.on('enter', () => cursorRef.current?.emit('enter'));
        button.on('leave', () => cursorRef.current?.emit('leave'));
      });
    }

    return () => {
      canvasRef.current?.cleanUp();
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={!isNavOpen ? 'mobileNavSection' : 'mobileNavSection addNegativeIndex'} suppressHydrationWarning>
        <div className="mobileNavActionBtn">
          <button onClick={() => setIsNavOpen(true)} className="closeMenuBtn">
            <i className="neu-close-lg"></i>Close Menu
          </button>
          {/* <FullscreenSwitch allowForMobile={true} /> */}
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
              <Link href="/blog" onClick={closeNav}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={closeNav}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeNav}>
                Contact
              </Link>
            </li>
            <li>
              <a
                href="mailto:iamgideonidoko@gmail.com?subject=I%20want%20to%20connect%20with%20you&body=Hello%2C%20I%27m%20..."
                // className="animated-button animated-button--pallene__outline"
              >
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
      <div
        {...(router.pathname.startsWith('/blog/') ? { 'data-lenis-prevent': true } : {})}
        className={!isNavOpen ? 'main-wrapper mobile-nav-view' : 'main-wrapper'}
      >
        <div className="fixed-line" />
        <canvas id="canvas" />
        <div className="noise-bg"></div>
        {shouldHaveHeader && (
          <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} contentScrollPos={contentScrollPos} />
        )}
        <Component {...pageProps} />
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

export default MyApp;
