import '../styles/globals.css';
import React, {Fragment, useState, useEffect} from 'react';
import Link from 'next/link';
import {createWrapper} from 'next-redux-wrapper';
import makeStore from '../store/store';
import {useStore} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeSwitch from '../components/ThemeSwitch';
import FullscreenSwitch from './../components/FullscreenSwitch';
import AdminMenu from './../components/AdminMenu';
import AnimatedCursor from 'react-animated-cursor';
import Head from 'next/head';
import {motion} from 'framer-motion';

function MyApp({Component, pageProps, router}) {

    const [isNavOpen,
        setIsNavOpen] = useState(true);
    const [loadCursor,
        setLoadCursor] = useState(false);

    const closeNav = () => setIsNavOpen(true);

    useEffect(() => {
        setLoadCursor(true);
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                window
                    .dataLayer
                    .push(arguments);
            }
            gtag('js', new Date());

            gtag('config', 'G-QJ2RYXMK6E');
        }

    }, [])

	const store = useStore(state => state);

    return (
        <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
            <Fragment>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </Head>
                {loadCursor && <AnimatedCursor
                    color="217, 149, 67"
                    innerSize={10}
                    outerSize={10}
                    outerScale={4.2}/>}
                <div
                    className={!isNavOpen
                    ? "mobileNavSection"
                    : "mobileNavSection addNegativeIndex"}>
                    {store
                        .getState()
                        .auth
                        .isAuthenticated && <div className="mobileNavAdminMenu">
                            <div><AdminMenu
                                allowForMobile={true}
                                adminUsername={store
                            .getState()
                            .auth
                            .isAuthenticated && store
                            .getState()
                            .auth
                            .adminuser
                            .username}/></div>
                        </div>}

                    <div className="mobileNavActionBtn">
                        <button onClick={() => setIsNavOpen(true)} className="closeMenuBtn">
                            <i className="neu-close-lg"></i>Close Menu</button>
                        <FullscreenSwitch allowForMobile={true}/>
                        <ThemeSwitch allowForMobile={true}/></div>

                    <div className="mobileAdminName">
                        <Link href="/">
                            <a onClick={closeNav}><img
                                src="/assets/img/GideonIdokoDevLogo.png"
                                className="site-logo"
                                alt="Gideon Idoko"/></a>
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
                                <a
                                    href="https://github.com/IamGideonIdoko"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-github"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://codepen.io/IamGideonIdoko"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-codepen"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://twitter.com/IamGideonIdoko"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/in/IamGideonIdoko"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div
                    className={!isNavOpen
                    ? "main-wrapper mobile-nav-view"
                    : "main-wrapper"}>
                    <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen}/>
                    <motion.div
                        key={router.route}
                        initial="pageInitial"
                        animate="pageAnimate"
                        className="container"
                        variants={{
                        pageInitial: {
                            opacity: 0
                        },
                        pageAnimate: {
                            opacity: 1
                        }
                    }}>
                        <Component {...pageProps}/>
                    </motion.div>
                    <Footer/>
                </div>
            </Fragment>
        </PersistGate>
    )
}

const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
