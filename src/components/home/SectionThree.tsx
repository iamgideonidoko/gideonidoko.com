import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

const SectionThree = () => {
  return (
    <div className={styles.sectionThree} id="section-three-wrapper">
      <div className="container-full">
        <div className={styles.sectionThreeBgTextWrap}>
          <div className={styles.sectionThreeBgText}>G.I</div>
        </div>

        <div className={`marquee ${styles.nameMarquee}`}>
          <div className="marquee__inner" aria-hidden="true">
            <span>Gideon Idoko -&nbsp;</span>
            <span>Gideon Idoko -&nbsp;</span>
            <span>Gideon Idoko -&nbsp;</span>
          </div>
        </div>

        <div className={styles.profileImgWrapper}>
          <div className="gooey__image">
            <Image
              src="/assets/img/gideon.jpg"
              data-hover="/assets/img/gideon-hover.jpg"
              alt="Gideon Idoko"
              width={1242}
              height={1652}
              priority
              sizes="(max-width: 768px) 92vw, 40vw"
              style={{ maxWidth: '100%', width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        <div className={styles.briefInfo}>
          <p>
            Hello, My name is Gideon, I&apos;m a creative Software Engineer with a knack for building products with
            unique experiences.
          </p>

          <div className={styles.learnMoreAboutBtn}>
            <Link href="/about" className="scroll-button">
              <div className="button__deco button__deco--2"></div>
              <div className="button__deco button__deco--1"></div>
              <span className="button__text button__text__sectionone">
                <span className="button__text-inner">
                  LEARN <br /> MORE
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
