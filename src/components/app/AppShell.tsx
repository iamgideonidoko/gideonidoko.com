'use client';

import Image from 'next/image';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import ThemeSwitch from '../ThemeSwitch';
import PageLoader from '../../classes/PageLoader';

const pageWithoutHeader: string[] = ['/p/test'];
const pageWithoutFooter: string[] = ['/p/test'];
const MOTION_SHELL_MEDIA_QUERY = '(min-width: 768px) and (pointer: fine)';
const HISTORY_NAV_REVEAL_DELAY_MS = 420;
const HISTORY_STATE_KEY = '__gideonLoaderHistoryIndex';

const getHistoryStateIndex = (state: unknown) => {
  if (typeof state !== 'object' || state === null) {
    return null;
  }

  const value = (state as Record<string, unknown>)[HISTORY_STATE_KEY];
  return typeof value === 'number' ? value : null;
};

const withHistoryStateIndex = (state: unknown, index: number) => ({
  ...(typeof state === 'object' && state !== null ? state : {}),
  [HISTORY_STATE_KEY]: index,
});

type CursorController = {
  emit: (event: 'enter' | 'leave') => void;
  destroy: () => void;
};

type CanvasController = {
  cleanUp: () => void;
};

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const [locationSearch, setLocationSearch] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.search,
  );
  const routeSearch = typeof window === 'undefined' ? locationSearch : window.location.search;
  const routeKey = routeSearch ? `${pathname}${routeSearch}` : pathname;
  const isWritingRoute = useMemo(() => /^\/(?:writing|blog)(?:\/|$)/.test(pathname), [pathname]);

  const [isNavOpen, setIsNavOpen] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [supportsMotionShell, setSupportsMotionShell] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOTION_SHELL_MEDIA_QUERY).matches,
  );
  const contentScrollPos = useRef(0);
  const cursorRef = useRef<CursorController | null>(null);
  const canvasRef = useRef<CanvasController | null>(null);
  const pageLoaderRef = useRef<PageLoader | null>(null);
  const pageLoaderElementRef = useRef<HTMLDivElement | null>(null);
  const pendingNavigationRef = useRef<string | null>(null);
  const shouldEnableMotionShellRef = useRef(false);
  const isBackOrForwardNav = useRef(false);
  const historyIndexRef = useRef(0);
  const historyRevertingRef = useRef(false);
  const historyReplayingRef = useRef(false);
  const initialRouteRender = useRef(true);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileNavCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const mobileMenuOpen = !isNavOpen;
  const shouldEnableSmoothScroll = !prefersReducedMotion;
  const shouldEnableMotionShell = supportsMotionShell && !prefersReducedMotion && !isWritingRoute;

  useEffect(() => {
    shouldEnableMotionShellRef.current = shouldEnableMotionShell;
  }, [shouldEnableMotionShell]);

  const closeNav = () => {
    contentScrollPos.current = 0;
    setIsNavOpen(true);
  };

  const shouldHaveHeader = !pageWithoutHeader.includes(pathname);
  const shouldHaveFooter = !pageWithoutFooter.includes(pathname);

  useEffect(() => {
    pageLoaderRef.current = new PageLoader(pageLoaderElementRef.current);

    return () => {
      pageLoaderRef.current?.destroy();
      pageLoaderRef.current = null;
    };
  }, []);

  useEffect(() => {
    const currentIndex = getHistoryStateIndex(window.history.state) ?? 0;
    historyIndexRef.current = currentIndex;
    window.history.replaceState(withHistoryStateIndex(window.history.state, currentIndex), '', window.location.href);

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    window.history.pushState = ((state, unused, url) => {
      const nextIndex = historyIndexRef.current + 1;
      historyIndexRef.current = nextIndex;
      originalPushState(withHistoryStateIndex(state, nextIndex), unused, url);
    }) as History['pushState'];

    window.history.replaceState = ((state, unused, url) => {
      const nextIndex = getHistoryStateIndex(state) ?? historyIndexRef.current;
      historyIndexRef.current = nextIndex;
      originalReplaceState(withHistoryStateIndex(state, nextIndex), unused, url);
    }) as History['replaceState'];

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOTION_SHELL_MEDIA_QUERY);
    const handleMotionShellChange = (event: MediaQueryListEvent) => {
      setSupportsMotionShell(event.matches);
    };

    mediaQuery.addEventListener('change', handleMotionShellChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionShellChange);
    };
  }, []);

  useEffect(() => {
    const mainWrapper = window.document.querySelector<HTMLDivElement>('.main-wrapper');
    if (isNavOpen) {
      window.scrollTo(0, contentScrollPos.current);
      return;
    }

    mainWrapper?.scrollTo(0, contentScrollPos.current);
  }, [isNavOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';

    const mobileNav = mobileNavRef.current;
    const selector =
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    mobileNavCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavOpen(true);
        return;
      }

      if (event.key !== 'Tab' || !mobileNav) {
        return;
      }

      const focusableElements = [...mobileNav.querySelectorAll<HTMLElement>(selector)].filter(
        (element) => !element.hasAttribute('hidden'),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    mobileNav?.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.removeProperty('overflow');
      mobileNav?.removeEventListener('keydown', handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const isHistoryNavigation = isBackOrForwardNav.current;
    const revealDelay = isHistoryNavigation && !prefersReducedMotion ? HISTORY_NAV_REVEAL_DELAY_MS : 0;
    const timeoutId = window.setTimeout(() => {
      void pageLoaderRef.current?.animateOut();
      if (isHistoryNavigation) {
        isBackOrForwardNav.current = false;
      }
    }, revealDelay);

    pendingNavigationRef.current = null;

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion, routeKey]);

  useEffect(() => {
    if (!shouldEnableSmoothScroll) {
      cursorRef.current?.destroy();
      cursorRef.current = null;
      canvasRef.current?.cleanUp();
      canvasRef.current = null;
      window.appLenis?.destroy();
      delete window.appLenis;
      return;
    }

    let cancelled = false;
    let animationFrameId = 0;
    let lenisCleanup: (() => void) | null = null;

    const initMotionShell = async () => {
      const lenisModulePromise = import('lenis');
      const desktopModulesPromise = shouldEnableMotionShell
        ? Promise.all([import('gsap'), import('gsap/dist/ScrollTrigger'), import('../../classes/Cursor')])
        : Promise.resolve(null);
      const [lenisModule, desktopModules] = await Promise.all([lenisModulePromise, desktopModulesPromise]);

      if (cancelled) {
        return;
      }

      const Lenis = lenisModule.default;
      const isMobileScrollMode = !supportsMotionShell;
      let scrollTrigger: (typeof import('gsap/dist/ScrollTrigger'))['default'] | null = null;

      if (desktopModules) {
        const [gsapModule, scrollTriggerModule, cursorModule] = desktopModules;
        const gsap = gsapModule.default;
        const Cursor = cursorModule.default;

        scrollTrigger = scrollTriggerModule.default;
        gsap.registerPlugin(scrollTrigger);

        const cursorElement = document.querySelector<SVGElement>('.cursor');
        if (cursorElement) {
          cursorRef.current = new Cursor(cursorElement);
        }
      } else {
        cursorRef.current?.destroy();
        cursorRef.current = null;
      }

      const lenis = new Lenis({
        lerp: isMobileScrollMode ? 0.085 : 0.04,
        smoothWheel: true,
        syncTouch: isMobileScrollMode,
        syncTouchLerp: isMobileScrollMode ? 0.12 : 0.075,
        touchMultiplier: 1,
        touchInertiaExponent: isMobileScrollMode ? 1.4 : 1.7,
        allowNestedScroll: true,
        overscroll: true,
      });

      window.appLenis = lenis;
      if (scrollTrigger) {
        lenis.on('scroll', scrollTrigger.update);
      }

      const scrollFn = (time: number) => {
        lenis.raf(time);
        scrollTrigger?.update();
        animationFrameId = window.requestAnimationFrame(scrollFn);
      };
      animationFrameId = window.requestAnimationFrame(scrollFn);

      lenisCleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        cursorRef.current?.destroy();
        cursorRef.current = null;
        lenis.destroy();
        delete window.appLenis;
        canvasRef.current?.cleanUp();
        canvasRef.current = null;
      };
    };

    void initMotionShell();

    return () => {
      cancelled = true;
      lenisCleanup?.();
    };
  }, [shouldEnableMotionShell, shouldEnableSmoothScroll, supportsMotionShell]);

  useEffect(() => {
    if (!window.appLenis) {
      return;
    }

    if (mobileMenuOpen) {
      window.appLenis.stop();
      return;
    }

    window.appLenis.start();
  }, [mobileMenuOpen]);

  useEffect(() => {
    const hideCanvasForTransition = () => {
      const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
      if (canvasElement && shouldEnableMotionShellRef.current) {
        canvasElement.style.visibility = 'hidden';
      }
    };

    const handleRouteChangeStart = async (nextHref: string) => {
      if (pendingNavigationRef.current) {
        return;
      }

      pendingNavigationRef.current = nextHref;
      hideCanvasForTransition();
      await pageLoaderRef.current?.animateIn();

      if (pendingNavigationRef.current === nextHref) {
        router.push(nextHref);
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
        `${nextUrl.pathname}${nextUrl.search}` === `${currentUrl.pathname}${currentUrl.search}` ||
        `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}` ===
          `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      ) {
        return;
      }

      event.preventDefault();
      void handleRouteChangeStart(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    };

    const handlePopState = async (event: PopStateEvent) => {
      setLocationSearch(window.location.search);
      hideCanvasForTransition();

      const nextIndex = getHistoryStateIndex(event.state);

      if (historyRevertingRef.current) {
        historyRevertingRef.current = false;
        event.stopImmediatePropagation();
        return;
      }

      if (historyReplayingRef.current) {
        historyReplayingRef.current = false;
        if (nextIndex !== null) {
          historyIndexRef.current = nextIndex;
        }
        isBackOrForwardNav.current = true;
        return;
      }

      if (nextIndex === null || nextIndex === historyIndexRef.current) {
        isBackOrForwardNav.current = true;
        return;
      }

      event.stopImmediatePropagation();

      const direction: -1 | 1 = nextIndex < historyIndexRef.current ? -1 : 1;

      historyRevertingRef.current = true;
      window.history.go(-direction);

      await pageLoaderRef.current?.animateIn();

      historyReplayingRef.current = true;
      window.history.go(direction);
    };

    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, [router]);

  useEffect(() => {
    if (!shouldEnableMotionShell) {
      canvasRef.current?.cleanUp();
      canvasRef.current = null;
      return;
    }

    let cancelled = false;
    let delayedBindFrameId = 0;
    let showCanvasFrameId = 0;
    const cleanups: Array<() => void> = [];

    const initInteractiveControls = async () => {
      const [scrollTriggerModule, buttonCtrlModule, canvasModule] = await Promise.all([
        import('gsap/dist/ScrollTrigger'),
        import('../../classes/ButtonCtrl'),
        import('../../classes/Canvas'),
      ]);

      if (cancelled) {
        return;
      }

      const ScrollTrigger = scrollTriggerModule.default;
      const ButtonCtrl = buttonCtrlModule.default;
      const Canvas = canvasModule.default;

      const canvasElement = document.querySelector<HTMLCanvasElement>('#canvas');
      if (canvasElement && !ScrollTrigger.isTouch) {
        canvasRef.current?.cleanUp();
        canvasRef.current = new Canvas(canvasElement);
      }

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

      delayedBindFrameId = window.requestAnimationFrame(() => {
        bindCursorTargets(document.querySelectorAll('.wl-word .char'));
      });

      [...document.querySelectorAll<HTMLElement>('.scroll-button')].forEach((element) => {
        const button = new ButtonCtrl(element);
        const handleEnter = () => cursorRef.current?.emit('enter');
        const handleLeave = () => cursorRef.current?.emit('leave');

        button.on('enter', handleEnter);
        button.on('leave', handleLeave);

        cleanups.push(() => {
          button.removeListener('enter', handleEnter);
          button.removeListener('leave', handleLeave);
          button.destroy();
        });
      });

      if (initialRouteRender.current) {
        initialRouteRender.current = false;
        return;
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

      showCanvasFrameId = window.requestAnimationFrame(() => {
        if (canvasElement) {
          canvasElement.style.visibility = 'visible';
        }
      });
    };

    void initInteractiveControls();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(delayedBindFrameId);
      window.cancelAnimationFrame(showCanvasFrameId);
      cleanups.forEach((cleanup) => cleanup());
      canvasRef.current?.cleanUp();
      canvasRef.current = null;
    };
  }, [routeKey, shouldEnableMotionShell]);

  return (
    <>
      <div
        ref={mobileNavRef}
        id="mobile-site-navigation"
        className={mobileMenuOpen ? 'mobileNavSection' : 'mobileNavSection addNegativeIndex'}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!mobileMenuOpen}
        suppressHydrationWarning
      >
        <div className="mobileNavActionBtn">
          <button
            ref={mobileNavCloseButtonRef}
            type="button"
            onClick={() => setIsNavOpen(true)}
            className="closeMenuBtn"
          >
            <i className="neu-close-lg"></i>Close Menu
          </button>
          <ThemeSwitch allowForMobile={true} />
        </div>

        <div className="mobileAdminName">
          <Link href="/" onClick={closeNav}>
            <Image src="/logo.svg" className="site-footer-logo" alt="Gideon Idoko" width={25} height={25} />
          </Link>
          <span>Gideon Idoko</span>
        </div>
        <nav aria-label="Mobile">
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
              <Link href="https://lab.gideonidoko.com" target="_blank" onClick={closeNav}>
                Lab
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
      {shouldEnableMotionShell && (
        <div
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          aria-hidden="true"
          suppressHydrationWarning
        >
          <svg className="cursor" width="140" height="140" viewBox="0 0 140 140" suppressHydrationWarning>
            <defs>
              <filter id="filter-1" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="10" result="warp" />
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="60" in="SourceGraphic" in2="warp" />
              </filter>
            </defs>
            <circle className="cursor__inner" cx="70" cy="70" r="60" />
          </svg>
        </div>
      )}
      <div className={mobileMenuOpen ? 'main-wrapper mobile-nav-view' : 'main-wrapper'}>
        <div
          className="fixed-line"
          aria-hidden="true"
          style={pathname.startsWith('/writing/') ? { background: 'none' } : {}}
          suppressHydrationWarning
        />
        {shouldEnableMotionShell && <canvas id="canvas" aria-hidden="true" />}
        <div className="noise-bg" aria-hidden="true"></div>
        {shouldHaveHeader && (
          <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} contentScrollPos={contentScrollPos} />
        )}
        {children}
        {shouldHaveFooter && <Footer />}
        <div
          ref={pageLoaderElementRef}
          className="page--overlay"
          data-state="covering"
          aria-hidden="true"
          suppressHydrationWarning
        >
          <div className="page--overlay__loader">
            <Image src="/logo.svg" className="site-logo" alt="Gideon Idoko" width={50} height={50} />
          </div>
        </div>
      </div>
    </>
  );
}
