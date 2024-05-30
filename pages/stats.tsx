import { Fragment } from 'react';
import styles from '../styles/Stats.module.css';
import { NextSeo } from 'next-seo';
import GitHubCalendar from 'react-github-calendar';

const Uses = () => {
  return (
    <Fragment>
      <NextSeo
        title="Stats - Gideon Idoko"
        description="Work stats"
        canonical="https://gideonidoko.com/stats"
        openGraph={{
          url: 'https://gideonidoko.com/stats',
          title: 'Stats - Gideon Idoko',
          description: 'Work stats',
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
      <main className={`padding-top-10rem ${styles.mail}`}>
        <div className="container-full">
          <div className={styles.intro}>
            <div>
              <figure>
                <embed src="https://wakatime.com/share/@bfe3e848-2339-4b06-a852-e6a84ab877ec/f8b2f8b4-c714-4fac-9de2-5e3de7ac328d.svg"></embed>
              </figure>
            </div>
            <div>
              <div>
                <h1 className={styles.title}>Stats</h1>
              </div>
              <div>
                <figure>
                  <embed src="https://wakatime.com/share/@bfe3e848-2339-4b06-a852-e6a84ab877ec/62642977-75d0-4de2-a5ec-13deae6739a8.svg"></embed>
                </figure>
              </div>
            </div>
            <div>
              <figure>
                <embed src="https://wakatime.com/share/@bfe3e848-2339-4b06-a852-e6a84ab877ec/bc9a2694-523d-48c1-a068-ff59d36ad3d6.svg"></embed>
              </figure>
            </div>
          </div>
          <div className={styles.github}>
            <div data-lenis-prevent className={`lenis-scroll-fix ${styles.github_child}`}>
              <GitHubCalendar username="IamGideonIdoko" />
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Uses;
