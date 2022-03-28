/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';
import { NextSeo } from 'next-seo';
// import Image from 'next/image';

const About = () => {
    return (
        <Fragment>
            <NextSeo
                title="About me - Gideon Idoko"
                description="Gideon Idoko is a Software Engineer and Technical Writer based in Nigeria. I'm interested in learning, building positive solutions with awesome experiences, sharing design and technical ideas and tips, writing, making innovative research, blogging and community building."
                canonical="https://gideonidoko.com/about"
                openGraph={{
                    url: 'https://gideonidoko.com/about',
                    title: 'About me - Gideon Idoko',
                    description:
                        'Gideon Idoko is a Software Engineer and Technical Writer based in Nigeria interested in learning, building positive solutions with awesome experiences, sharing design and technical ideas and tips, writing, making innovative research, blogging and community building.',
                    images: [
                        {
                            url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
                            width: 1500,
                            height: 500,
                            alt: "Gideon Idoko's card image",
                        },
                    ],
                    site_name: 'Gideon Idoko - Software Engineer and Technical Writer',
                }}
                twitter={{
                    handle: '@IamGideonIdoko',
                    site: '@IamGideonIdoko',
                    cardType: 'summary_large_image',
                }}
            />
            <Head>
                <title>About me - Gideon Idoko</title>
                <meta
                    name="keywords"
                    content="gideon idoko,about gideon idoko,gideon, about gideon, about idoko,idoko,software developer,technical writer,software engineer,developer,engineer,writer"
                ></meta>
            </Head>
            <main className={`padding-top-10rem ${styles.aboutMain}`}>
                <div className="container-max-1248px">
                    <div className={styles.aboutSectionOne}>
                        <div>
                            <div className={styles.photoWrapper}>
                                <img
                                    src="/assets/img/Ifex.JPG"
                                    alt="Gideon Idoko"
                                    style={{ maxWidth: '100%' }}
                                    width={330}
                                />
                            </div>
                        </div>
                        <div>
                            <h3>
                                Hi there! <i className="neu-robot"></i>
                            </h3>
                            <h1>I&apos;m Gideon Idoko.</h1>
                            {/* <h3>
                                Frontend Engineer @ <a>AlphaCX</a>
                            </h3> */}

                            <p>
                                I&apos;m a Software Engineer and Technical Writer based in Nigeria. I&apos;m interested
                                in learning, building positive solutions with awesome experiences, sharing design and
                                technical ideas and tips, writing, making innovative research, blogging and community
                                building. I develop beautiful, secured and accessible applications that meet the
                                business requirements and focus on providing the best experience for their end users. I
                                go a long way to give my best shot, this has made me keen to discovering life changing
                                tech solutions. I devote a good amount of my time to programming, solving real world
                                problems and self-development. I aim at building the next positive big thing.
                            </p>

                            <p>
                                Though familiar with some backend technologies and concerned about every aspect of a
                                product, I focus more on frontend tools. I write about Software Engineering topics and
                                tools on my{' '}
                                <Link href="/blog">
                                    <a>blog</a>
                                </Link>{' '}
                                and other platforms.
                            </p>

                            <p>
                                I play cool sports like tennis, badminton majorly. When I am not programming I&apos;ll
                                probably be reading some articles, watching movies, engaging in my other hobbies.
                            </p>

                            <p>
                                <a
                                    href="https://docs.google.com/document/d/1VKBYjOOj0pSSD1G8aLOXoY-SZnfyMg-24VGd3wQuF-w/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.resumeBtn}
                                >
                                    My Resume
                                </a>
                            </p>
                        </div>
                    </div>

                    <h2>Stack.</h2>
                    <h4>Tools (Languages/Frameworks/Libraries):</h4>
                    <ul>
                        <li>HTML & CSS.</li>
                        <li>SASS (SCSS).</li>
                        <li>Bootstrap.</li>
                        <li>Tailwind.</li>
                        <li>JavaScript.</li>
                        <li>jQuery.</li>
                        <li>React.</li>
                        <li>React Native.</li>
                        <li>Redux.</li>
                        <li>NextJS.</li>
                        <li>NodeJS.</li>
                        <li>ExpressJS.</li>
                        <li>MongoDB.</li>
                        <li>Redis.</li>
                        <li>Firebase.</li>
                        <li>PHP.</li>
                        <li>MySQL.</li>
                        <li>Wordpress.</li>
                    </ul>

                    <h4>On The Job:</h4>
                    <ul>
                        <li>Responsive Design.</li>
                        <li>PSD to HTML.</li>
                        <li>Version Control.</li>
                        <li>Clean code and best practices.</li>
                        <li>Testing.</li>
                        <li>Documentation.</li>
                        <li>CI/CD.</li>
                    </ul>

                    <div className={styles.aboutFooter}>
                        <p>
                            <b>No idea of what you really want?</b> I&apos;ll assist you come up with a strategic plan
                            which will help your business seamlessly grow.
                        </p>

                        <p>
                            <b>Want to chat about my content?</b> I&apos;d be happy to engage in a discussion with you.
                        </p>

                        <p>
                            <b>Want your idea to be a reality?</b> I&apos;ll pay close attention to what your idea is
                            and aim to achieve and with suggestions, will create the best possible product as
                            envisioned.
                        </p>

                        <p>
                            <b>Need more hands in your team?</b> I&apos;ve got pliability and I can work with any team,
                            even if they&apos;re part way through a project. Just hit me up when you need me.
                        </p>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default About;
