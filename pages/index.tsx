import { Fragment } from 'react';
import SectionOne from '../components/home/SectionOne';
import SectionTwo from '../components/home/SectionTwo';
import SectionThree from '../components/home/SectionThree';
import SectionFour from '../components/home/SectionFour';
import SectionFive from '../components/home/SectionFive';
import styles from '../styles/Home.module.css';
import { NextSeo } from 'next-seo';

function Home({}) {
    return (
        <Fragment>
            <NextSeo
                title="Gideon Idoko - Software Engineer"
                description="Gideon Idoko is a solution-driven Software Engineer interested in learning, building positive solutions, developing unique experiences, sharing technical ideas, writing and community engagement."
                canonical="https://gideonidoko.com"
                openGraph={{
                    url: 'https://gideonidoko.com',
                    title: 'Gideon Idoko - Software Engineer',
                    description:
                        'Gideon Idoko is a solution-driven Software Engineer interested in learning, building positive solutions, developing unique experiences, sharing technical ideas, writing and community engagement.',
                    images: [
                        {
                            url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
                            width: 1500,
                            height: 500,
                            alt: "Gideon Idoko's card image",
                        },
                    ],
                    site_name: 'Gideon Idoko',
                }}
                twitter={{
                    handle: '@IamGideonIdoko',
                    site: '@IamGideonIdoko',
                    cardType: 'summary_large_image',
                }}
            />
            <main>
                <div className={styles.section1Wrapper}>
                    <SectionOne />
                </div>
                <div className="wobble-divider" />
                <div className={styles.homeMeta}>
                    <div>02/</div>
                    <div>ABOUT</div>
                    <div>
                        <a href="mailto:iamgideonidoko@gmail.com?subject=I%20want%20to%20connect%20with%20you&body=Hello%2C%20I%27m%20...">
                            <span className={styles.hmDesktop}>EMAIL</span>
                            <span className={styles.hmMobile}>EM</span>
                        </a>
                        &nbsp;/&nbsp;
                        <a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                            <span className={styles.hmDesktop}>GITHUB</span>
                            <span className={styles.hmMobile}>GH</span>
                        </a>
                        &nbsp;/&nbsp;
                        <a href="https://linkedin.com/in/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                            <span className={styles.hmDesktop}>LINKEDIN</span>
                            <span className={styles.hmMobile}>LI</span>
                        </a>
                        &nbsp;/&nbsp;
                        <a href="https://twitter.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                            <span className={styles.hmDesktop}>TWITTER</span>
                            <span className={styles.hmMobile}>TW</span>
                        </a>
                        &nbsp;/&nbsp;
                        <a href="https://instagram.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                            <span className={styles.hmDesktop}>INSTAGRAM</span>
                            <span className={styles.hmMobile}>IG</span>
                        </a>
                    </div>
                    <div>05/</div>
                </div>
                <SectionThree />
                <div className="wobble-divider" />
                <div className={styles.homeMeta}>
                    <div>03/</div>
                    <div>PROJECTS</div>
                    <div></div>
                    <div>05/</div>
                </div>
                <SectionTwo />
                <div className={styles.waveTop}></div>
                <div className={styles.section34Wrapper}>
                    <SectionFour />
                </div>
                <div className={styles.waveBottom}></div>
                <SectionFive />
            </main>
        </Fragment>
    );
}

export default Home;
