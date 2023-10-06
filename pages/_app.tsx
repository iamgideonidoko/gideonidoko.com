/* eslint-disable @next/next/no-img-element */
import '../styles/globals.css';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createWrapper } from 'next-redux-wrapper';
import makeStore, { store } from '../store/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeSwitch from '../components/ThemeSwitch';
import FullscreenSwitch from '../components/FullscreenSwitch';
import AdminMenu from '../components/AdminMenu';
import Head from 'next/head';
import { debounce } from 'debounce';
import { saveState, refreshUserTokens } from '../helper';
import { AppProps } from 'next/app';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { loadFirebase } from '../helper';
import 'prismjs/themes/prism-tomorrow.css';
// import Image from 'next/image';
import Lenis from '@studio-freight/lenis';
import Cursor from '../classes/Cursor';
import ButtonCtrl from '../classes/ButtonCtrl';

store.subscribe(
    // we use debounce to save the state once each 800ms
    // for better performances in case multiple changes occur in a short time
    debounce(() => {
        saveState(store.getState());
    }, 800),
);

const pageWithoutHeader = ['/p/test'];
const pageWithoutFooter = ['/p/test'];

function MyApp({ Component, pageProps }: AppProps) {
    const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
    const auth = useSelector(({ auth }: RootState) => auth);
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

    // HANDLERS
    const handleRouteChangeStart = () => {
        NProgress.start();
    };

    const handleRouteChangeComplete = () => {
        NProgress.done();
    };

    const handleRouteChangeError = () => {
        NProgress.done();
    };

    const handleScrollButtonEffect = () => {
        if (cursorRef.current) {
            [...document.querySelectorAll<HTMLButtonElement>('.scroll-button')].forEach((el) => {
                const button = new ButtonCtrl(el);
                button.on('enter', () => cursorRef.current?.emit('enter'));
                button.on('leave', () => cursorRef.current?.emit('leave'));
            });
        }
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
        // check for token and refresh on page load
        (async () => await refreshUserTokens())();
        // load an initialize a firebase app
        loadFirebase();
        // enable smooth scrolling
        const lenis = new Lenis({
            lerp: 0.05,
            smoothTouch: true,
            smoothWheel: true,
        });

        lenis.on('scroll', () => {
            //
        });
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
        NProgress.configure({ showSpinner: false });

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
        }

        handleScrollButtonEffect();
        window.addEventListener('resize', handleScrollButtonEffect);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
            window.removeEventListener('resize', handleScrollButtonEffect);
        };
    }, [router]);

    return (
        <Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={!isNavOpen ? 'mobileNavSection' : 'mobileNavSection addNegativeIndex'}>
                {store.getState().auth.isAuthenticated && (
                    <div className="mobileNavAdminMenu">
                        <div>
                            <AdminMenu
                                isNavOpen={isNavOpen}
                                allowForMobile={true}
                                adminUsername={auth.isAuthenticated ? (auth.userInfo?.user?.username as string) : ''}
                            />
                        </div>
                    </div>
                )}

                <div className="mobileNavActionBtn">
                    <button onClick={() => setIsNavOpen(true)} className="closeMenuBtn">
                        <i className="neu-close-lg"></i>Close Menu
                    </button>
                    <FullscreenSwitch allowForMobile={true} />
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
                                Get in touch
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={!isNavOpen ? 'main-wrapper mobile-nav-view' : 'main-wrapper'}>
                <div className="noise-bg">backgroud</div>
                {shouldHaveHeader && (
                    <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} contentScrollPos={contentScrollPos} />
                )}
                <Component {...pageProps} />
                {shouldHaveFooter && <Footer />}
            </div>
            <svg className="cursor" width="140" height="140" viewBox="0 0 140 140">
                <defs>
                    <filter id="filter-1" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                        <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="10" result="warp" />
                        <feDisplacementMap
                            xChannelSelector="R"
                            yChannelSelector="G"
                            scale="60"
                            in="SourceGraphic"
                            in2="warp"
                        />
                    </filter>
                </defs>
                <circle className="cursor__inner" cx="70" cy="70" r="60" />
            </svg>
        </Fragment>
    );
}

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
