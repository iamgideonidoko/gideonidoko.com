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
                title="Gideon Idoko - Software Engineer and Technical Writer"
                description="Gideon Idoko is a solution-driven Software Engineer and Technical Writer interested in learning, building positive solutions with awesome experiences, sharing technical ideas, writing, and community building."
                canonical="https://gideonidoko.com"
                openGraph={{
                    url: 'https://gideonidoko.com',
                    title: 'Gideon Idoko - Software Engineer and Technical Writer',
                    description:
                        'Gideon Idoko is a solution-driven Software Engineer and Technical Writer interested in learning, building positive solutions with awesome experiences, sharing technical ideas, writing, and community building.',
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
                    <div className={styles.section1WrapperBg}></div>
                    <SectionOne />
                </div>
                <SectionThree />
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
