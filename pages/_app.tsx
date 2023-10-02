/* eslint-disable @next/next/no-img-element */
import '../styles/globals.css';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createWrapper } from 'next-redux-wrapper';
import makeStore, { store } from '../store/store';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeSwitch from '../components/ThemeSwitch';
import FullscreenSwitch from '../components/FullscreenSwitch';
import AdminMenu from '../components/AdminMenu';
import AnimatedCursor from 'react-animated-cursor';
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
    const [loadCursor, setLoadCursor] = useState<boolean>(false);
    const auth = useSelector(({ auth }: RootState) => auth);
    const contentScrollPos = useRef<number>(0);

    const closeNav = () => {
        contentScrollPos.current = 0;
        setIsNavOpen(true);
    };

    const router = useRouter();

    const shouldHaveHeader = pageWithoutHeader.indexOf(router.pathname) === -1;
    const shouldHaveFooter = pageWithoutFooter.indexOf(router.pathname) === -1;

    // useEffect(() => {
    //     router.beforePopState((state) => {
    //         state.options.scroll = false;
    //         return true;
    //     });
    // }, [router]);

    useEffect(() => {
        const mainWrapper = window.document.querySelector('.main-wrapper') as HTMLDivElement;
        if (isNavOpen) {
            window.scrollTo(0, contentScrollPos.current);
        } else {
            mainWrapper?.scrollTo(0, contentScrollPos.current);
        }
    }, [isNavOpen]);

    useEffect(() => {
        NProgress.configure({ showSpinner: false });
        const handleStart = () => {
            NProgress.start();
        };
        const handleStop = () => {
            NProgress.done();
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);

    useEffect(() => {
        setLoadCursor(true);
        // check for token and refresh on page load
        (async () => await refreshUserTokens())();
        // load an initialize a firebase app
        loadFirebase();
    }, []);

    useEffect(() => {
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

    return (
        <Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            {loadCursor && <AnimatedCursor color="253, 187, 45" innerSize={10} outerSize={10} outerScale={4.2} />}
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
                {shouldHaveHeader && (
                    <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} contentScrollPos={contentScrollPos} />
                )}
                <Component {...pageProps} />
                {shouldHaveFooter && <Footer />}
            </div>
        </Fragment>
    );
}

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
