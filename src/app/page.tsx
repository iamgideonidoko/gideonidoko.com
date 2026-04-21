import type { Metadata } from 'next';
import SectionFour from '../components/home/SectionFour';
import SectionOne from '../components/home/SectionOne';
import SectionThree from '../components/home/SectionThree';
import SectionTwo from '../components/home/SectionTwo';
import { createPageMetadata } from '../lib/site';
import styles from '../styles/Home.module.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Gideon Idoko - Software Engineer',
  description:
    'Gideon Idoko is a solution-driven Software Engineer interested in learning, building solutions with unique experiences, sharing technical ideas, writing and community building.',
  path: '/',
});

export default function HomePage() {
  return (
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
          <a href="https://github.com/iamgideonidoko" target="_blank" rel="noopener noreferrer">
            <span className={styles.hmDesktop}>GITHUB</span>
            <span className={styles.hmMobile}>GH</span>
          </a>
          &nbsp;/&nbsp;
          <a href="https://linkedin.com/in/iamgideonidoko" target="_blank" rel="noopener noreferrer">
            <span className={styles.hmDesktop}>LINKEDIN</span>
            <span className={styles.hmMobile}>LI</span>
          </a>
          &nbsp;/&nbsp;
          <a href="https://x.com/iamgideonidoko" target="_blank" rel="noopener noreferrer">
            <span className={styles.hmDesktop}>X</span>
            <span className={styles.hmMobile}>X</span>
          </a>
          &nbsp;/&nbsp;
          <a href="https://instagram.com/iamgideonidoko" target="_blank" rel="noopener noreferrer">
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
    </main>
  );
}
