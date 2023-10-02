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
                        
                            <Image
                                src="/assets/img/GideonIdokoDevLogo.png"
                                className="site-footer-logo"
                                alt="Gideon Idoko"
                                width={27}
                                height={34}
                            />
                        
                    </Link> */}
                </div>
                <div className="footer-content-2">
                    <div>
                        <h3 className="footer-h3-1">
                            <Link href="/">
                                <img
                                    src="/assets/img/GideonIdokoDevLogo.png"
                                    className="site-footer-logo"
                                    alt="Gideon Idoko"
                                />
                            </Link>{' '}
                            <span>Gideon Idoko</span>
                        </h3>
                        <p>
                            I love building positive solutions with awesome technologies. I also give back to the
                            community by sharing my experiences. <br /> <br /> In need of a developer?
                        </p>
                        <p className="lets-talk">
                            <Link href="/contact">
                                Let&apos;s talk <i className="neu-right-lg"></i>
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
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/blog">Blog</Link>
                            </li>
                            <li>
                                <Link href="/about">About</Link>
                            </li>
                            {/*
							<li><Link href="/#services">Services</Link></li>
							*/}
                            <li>
                                <Link href="/contact">Contact</Link>
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
