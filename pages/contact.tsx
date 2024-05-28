import { Fragment } from 'react';
import styles from '../styles/Contact.module.css';
import { NextSeo } from 'next-seo';

const Contact = ({}) => {
  return (
    <Fragment>
      <NextSeo
        title="Contact me - Gideon Idoko"
        description="Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out."
        canonical="https://gideonidoko.com/contact"
        openGraph={{
          url: 'https://gideonidoko.com/contact',
          title: 'Contact me - Gideon Idoko',
          description:
            'Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out.',
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
      <main className={`padding-top-10rem ${styles.contactMain}`}>
        <div className="container-full">
          <h1>Contact me</h1>
          <div className={`${styles.scrollText}`}>
            SCROLL <i className="neu-down-lg"></i> DOWN
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default Contact;
