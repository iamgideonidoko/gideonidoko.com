import Head from 'next/head';
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
                title="Gideon Idoko - Software Developer and Technical Writer"
                description="Gideon Idoko is a Software Engineer and Technical Writer that develops unique digital experiences and builds positive solutions. Get in touch."
                canonical="https://gideonidoko.com"
                openGraph={{
                    url: 'https://gideonidoko.com',
                    title: 'Gideon Idoko - Software Developer and Technical Writer',
                    description:
                        'Gideon Idoko is a Software Engineer and Technical Writer that develops unique digital experiences and builds positive solutions. Get in touch.',
                    images: [
                        {
                            url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
                            width: 1500,
                            height: 500,
                            alt: "Gideon Idoko's card image",
                        },
                    ],
                    site_name: 'Gideon Idoko - Software Developer and Technical Writer',
                }}
                twitter={{
                    handle: '@IamGideonIdoko',
                    site: '@IamGideonIdoko',
                    cardType: 'summary_large_image',
                }}
            />
            <Head>
                <title>Gideon Idoko - Software Developer and Technical Writer</title>
                <meta
                    name="keywords"
                    content="gideon idoko,gideon,idoko,software developer,technical writer,software engineer,developer,engineer,writer"
                ></meta>
            </Head>

            <main>
                <div className={styles.section1Wrapper}>
                    <div className={styles.section1WrapperBg}></div>
                    <SectionOne />
                </div>
                <SectionTwo />
                <div className={styles.waveTop}></div>
                <div className={styles.section34Wrapper}>
                    <SectionThree />
                    <SectionFour />
                </div>
                <div className={styles.waveBottom}></div>
                <SectionFive />
            </main>
        </Fragment>
    );
}

export default Home;
