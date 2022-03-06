/* eslint-disable @next/next/no-img-element */
import '../styles/globals.css';
import React, { Fragment, useState, useEffect } from 'react';
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
import { saveState } from '../helper';
import { AppProps } from 'next/app';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

store.subscribe(
    // we use debounce to save the state once each 800ms
    // for better performances in case multiple changes occur in a short time
    debounce(() => {
        saveState(store.getState());
    }, 800),
);

function MyApp({ Component, pageProps }: AppProps) {
    const [isNavOpen, setIsNavOpen] = useState<boolean>(true);
    const [loadCursor, setLoadCursor] = useState<boolean>(false);
    const auth = useSelector(({ auth }: RootState) => auth);

    const closeNav = () => setIsNavOpen(true);

    useEffect(() => {
        setLoadCursor(true);
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
            {loadCursor && <AnimatedCursor color="217, 149, 67" innerSize={10} outerSize={10} outerScale={4.2} />}
            <div className={!isNavOpen ? 'mobileNavSection' : 'mobileNavSection addNegativeIndex'}>
                {store.getState().auth.isAuthenticated && (
                    <div className="mobileNavAdminMenu">
                        <div>
                            <AdminMenu
                                allowForMobile={true}
                                adminUsername={auth.isAuthenticated && auth.userInfo?.user?.username}
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
                    <Link href="/">
                        <a onClick={closeNav}>
                            <img src="/assets/img/GideonIdokoDevLogo.png" className="site-logo" alt="Gideon Idoko" />
                        </a>
                    </Link>
                    <span>Gideon Idoko</span>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link href="/">
                                <a onClick={closeNav}>Home</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog">
                                <a onClick={closeNav}>Blog</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about">
                                <a onClick={closeNav}>About</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact">
                                <a onClick={closeNav}>Get in touch</a>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="social-links mobile-social-links">
                    <ul>
                        <li>
                            <a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://codepen.io/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-codepen"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a>
                        </li>
                        <li>
                            <a href="https://linkedin.com/in/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={!isNavOpen ? 'main-wrapper mobile-nav-view' : 'main-wrapper'}>
                <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
                <Component {...pageProps} />
                <Footer />
            </div>
        </Fragment>
    );
}

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
