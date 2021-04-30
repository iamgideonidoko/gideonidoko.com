import Head from 'next/head';
import { Fragment } from 'react';
import SectionOne from '../components/home/SectionOne';
import SectionTwo from '../components/home/SectionTwo';
import SectionThree from '../components/home/SectionThree';
import SectionFour from '../components/home/SectionFour';
import SectionFive from '../components/home/SectionFive';
import styles from '../styles/Home.module.css'
import { NextSeo } from 'next-seo';

function Home(props) {
  return (
    <Fragment>
      <NextSeo
        title="Gideon Idoko - Software Developer and Technical Writer"
        description="I develop unique digital experiences. Get in touch."
        canonical="https://gideonidoko.com"
        openGraph={{
          url: "https://gideonidoko.com",
          title: "Gideon Idoko - Software Developer and Technical Writer",
          description: "Gideon Idoko is a Software Developer and Technical Writer that develops unique digital experiences. Get in touch.",
          images: [
            {
              url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
              width: 1004,
              height: 591,
              alt: 'Gideon Idoko\'s card image'
              },
            {
              url: 'https://gideonidoko.com/welcomeview.jpg',
              width: 800,
              height: 600,
              alt: 'Gideon Idoko\'s portfolio home view'
              }
            ],
            site_name: "Gideon Idoko - Software Developer and Technical Writer"
        }}
        twitter={{
          handle: "@IamGideonIdoko",
          site: "@IamGideonIdoko",
          cardType: "summary_large_image"
        }}
        />
      <Head>
        <title>Gideon Idoko - Software Developer and Technical Writer</title>
        <meta name="keywords" content="gideon idoko,gideon,idoko,software developer,technical writer,software engineer,developer,engineer,writer"></meta>
      </Head>

      <main>
      <div className={styles.section1Wrapper}>
        <SectionOne />
      </div>
      <SectionTwo />
      <div className={styles.section34Wrapper}>
        <SectionThree />
        <SectionFour />
      </div>
      <SectionFive />

      </main>
    </Fragment>
  )
}

export default Home;