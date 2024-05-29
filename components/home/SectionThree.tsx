/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

// const ScrambledText = () => {
//     const aboutInfo = useMemo(
//         () => [
//             "I'm a solution-driven Software Engineer",
//             'I dabble in frontend (web + mobile) and backend',
//             'I enjoy building positive solutions',
//             "I've a liking to sharing knowledge",
//             'I create technical contents',
//             "I'm interested in community building",
//             "I'm open to collaborations and gigs 🙏🏽",
//         ],
//         [],
//     );

//     const [aboutText, setAboutText] = useState(null);

//     useEffect(() => {
//         setTimeout(() => {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             let scrambler: any;
//             if (typeof window !== 'undefined') {
//                 try {
//                     scrambler = new window.Scrambler();
//                 } catch (err) {
//                     console.error('Scrambler Error: ', err);
//                 }

//                 if (scrambler) {
//                     let i = 0;
//                     const printText = () => {
//                         scrambler.scramble(aboutInfo[i % aboutInfo.length], setAboutText);
//                         setTimeout(printText, 12000);
//                         i++;
//                     };
//                     printText();
//                 }
//             }
//         }, 1000);
//     }, [aboutInfo]);

//     return (
//         <h4 className={styles.aboutText}>
//             {'>'} {aboutText}.
//         </h4>
//     );
// };

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
            <img
              src="/assets/img/gideon.jpeg"
              data-hover="/assets/img/gideon-hover.jpeg"
              alt="Gideon Idoko"
              style={{ maxWidth: '100%' }}
              width={330}
            />
          </div>
        </div>

        {/* <ScrambledText /> */}
        <div className={styles.briefInfo}>
          <p>
            Hello, My name is Gideon, I&apos;m a solution-driven Software Engineer with a knack for building products
            with unique experiences.
          </p>

          <div className={styles.learnMoreAboutBtn}>
            <Link href="/about">
              <button className="scroll-button">
                <div className="button__deco button__deco--2"></div>
                <div className="button__deco button__deco--1"></div>
                <span className="button__text button__text__sectionone">
                  <span className="button__text-inner">
                    LEARN <br /> MORE
                  </span>
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* <div className={styles.s3AboutLink}>
                    <Wobble duration={2000}>
                        <div>
                            <Link
                                href="/about"
                                className={`animated-button animated-button--pallene__outline ${styles.aboutSeeMore}`}
                            >
                                See more about me.
                            </Link>
                        </div>
                    </Wobble>
                </div> */}
      </div>
    </div>
  );
};

export default SectionThree;
