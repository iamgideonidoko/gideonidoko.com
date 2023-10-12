/* eslint-disable @next/next/no-img-element */
// import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    //get current year
    const date = new Date();
    const currentYear = date.getFullYear();

    return (
        <footer className="footer">
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
