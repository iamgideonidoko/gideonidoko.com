/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    //get current year
    const date = new Date();
    const currentYear = date.getFullYear();

    const timeLineRefs = useRef<gsap.core.Timeline[]>([]);

    useEffect(() => {
        setTimeout(() => {
            [...document.querySelectorAll('.footer-main-heading')].forEach((elem) => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        markers: false,
                        start: 'clamp(top bottom-=0%)',
                        end: 'center center',
                        trigger: elem,
                        scrub: true,
                    },
                });
                tl.fromTo(
                    elem,
                    {
                        letterSpacing: '0.5em',
                    },
                    {
                        letterSpacing: '0em',
                    },
                );
                timeLineRefs.current.push(tl);
            });
            [...document.querySelectorAll('.footer-bg')].forEach((elem) => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        markers: true,
                        start: 'clamp(top bottom-=50%)',
                        end: 'top top',
                        trigger: elem,
                        scrub: true,
                    },
                });
                tl.fromTo(
                    elem,
                    {
                        width: '100%',
                        height: '100%',
                        xPercent: 0,
                        yPercent: 0,
                        opacity: -1,
                    },
                    {
                        width: '90%',
                        height: '80%',
                        xPercent: 5,
                        yPercent: 12.5,
                        opacity: 1,
                    },
                );
                timeLineRefs.current.push(tl);
            });
        }, 3000);
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timeLineRefs.current.forEach((tl) => tl.kill());
        };
    }, []);

    return (
        <footer className="footer">
            <div className="footer-bg"></div>
            <div className=" footer-wrapper">
                <div>
                    <img src="/assets/img/GideonIdokoDevLogo.png" className="site-footer-logo" alt="Gideon Idoko" />
                </div>
                <p className="footer-question">GOT A PROJECT IN MIND?</p>
                <h3 className="footer-main-heading">LET&apos;S CONNECT</h3>
                <div className="write-msg-btn">
                    <Link href="/about">
                        <button className="scroll-button">
                            <div className="button__deco button__deco--2"></div>
                            <div className="button__deco button__deco--1"></div>
                            <span className="button__text button__text__sectionone">
                                <span className="button__text-inner footer-write-text">
                                    WRITE A <br /> &nbsp;&nbsp;MESSAGE
                                </span>
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="footer-footer">
                <div>
                    <span>FEEL FREE TO CONNECT WITH ME ON SOCIAL</span>
                </div>
                <div>
                    <span>
                        <a
                            href="https://twitter.com/IamGideonIdoko"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="animated-button animated-button--pallene__outlineless"
                        >
                            TWITTER
                        </a>
                    </span>
                    <span>
                        <a
                            href="https://linkedin.com/in/IamGideonIdoko"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="animated-button animated-button--pallene__outlineless"
                        >
                            LINKEDIN
                        </a>
                    </span>
                    <span>
                        <a
                            href="https://instagram.com/IamGideonIdoko"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="animated-button animated-button--pallene__outlineless"
                        >
                            INSTAGRAM
                        </a>
                    </span>
                    <span>
                        <Link href="/contact">
                            CONTACT <i className="neu-arrow"></i>
                        </Link>
                    </span>
                    <span>&copy; {currentYear}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
