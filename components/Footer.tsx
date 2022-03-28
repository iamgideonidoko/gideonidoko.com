/* eslint-disable @next/next/no-img-element */
// import Image from 'next/image';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';
import { socialIconStyle } from '../helper';

const Footer = () => {
    //get current year
    const date = new Date();
    const currentYear = date.getFullYear();

    return (
        <footer className="footer">
            <div className="container-max-1248px footer-wrapper">
                <div className="footer-content-1">
                    {/* <Link href="/">
                        <a>
                            <Image
                                src="/assets/img/GideonIdokoDevLogo.png"
                                className="site-footer-logo"
                                alt="Gideon Idoko"
                                width={27}
                                height={34}
                            />
                        </a>
                    </Link> */}
                </div>
                <div className="footer-content-2">
                    <div>
                        <h3 className="footer-h3-1">
                            <Link href="/">
                                <a>
                                    <img
                                        src="/assets/img/GideonIdokoDevLogo.png"
                                        className="site-footer-logo"
                                        alt="Gideon Idoko"
                                    />
                                </a>
                            </Link>{' '}
                            <span>Gideon Idoko</span>
                        </h3>
                        <p>
                            I love building positive solutions with awesome technologies. I also give back to the
                            community by sharing my experiences. <br /> <br /> In need of a developer?
                        </p>
                        <p className="lets-talk">
                            <Link href="/contact">
                                <a>
                                    Let&apos;s talk <i className="neu-right-lg"></i>
                                </a>
                            </Link>
                        </p>
                        <div className="socials">
                            <SocialIcon
                                url="https://github.com/IamGideonIdoko"
                                style={socialIconStyle()}
                                bgColor="var(--font-color)"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                            <SocialIcon
                                url="https://codepen.io/IamGideonIdoko"
                                style={socialIconStyle()}
                                bgColor="var(--font-color)"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                            <SocialIcon
                                url="https://twitter.com/IamGideonIdoko"
                                style={socialIconStyle()}
                                fgColor="white"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                            <SocialIcon
                                url="https://linkedin.com/in/IamGideonIdoko"
                                style={socialIconStyle()}
                                fgColor="white"
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        </div>
                    </div>
                    <div className="quick-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li>
                                <Link href="/">
                                    <a>Home</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog">
                                    <a>Blog</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about">
                                    <a>About</a>
                                </Link>
                            </li>
                            {/*
							<li><Link href="/#services"><a>Services</a></Link></li>
							*/}
                            <li>
                                <Link href="/contact">
                                    <a>Contact</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-content-3">
                    <p>
                        <i className="neu-code"></i> with <i className="neu-love"></i> by Gideon Idoko &copy;{' '}
                        {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
