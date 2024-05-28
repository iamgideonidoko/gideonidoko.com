import Link from 'next/link';
import styles from '../../styles/Home.module.css';

const SectionFive = ({}) => {
  return (
    <div className={`${styles.sectionFive} section-five`}>
      <div className="container-full">
        <div className={styles.sectionFiveWrapper}>
          <h3 className={styles.servicesHead}>— Articles —</h3>

          <p className={styles.sec5Intro}>
            Yup! I also <b>write</b> ✍🏽👨🏽‍🏫.
          </p>
          <div>
            <div className={styles.sec5SeeMore}>
              <Link href="/blog" className={`animated-button animated-button--pallene__outline ${styles.aboutSeeMore}`}>
                Check out my blog.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFive;
