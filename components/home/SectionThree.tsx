import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import Wobble from 'react-reveal/Wobble';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

const SectionThree = () => {
    const aboutInfo = [
        "I'm a solution-driven Software Engineer",
        "I'm a Technical Writer",
        'I focus more on web engineering',
        'I love building positive solutions',
        'I create technical contents',
        "I've a liking to sharing knowledge",
        "I'm interested in community building",
        'I reside in Nigeria',
        "I'm open to collaborations and gigs",
    ];

    const [aboutText, setAboutText] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let scrambler: any;
            if (typeof window !== 'undefined') {
                try {
                    scrambler = new window.Scrambler();
                } catch (err) {
                    console.error('Scrambler Error: ', err);
                }

                if (scrambler) {
                    let i = 0;
                    const printText = () => {
                        scrambler.scramble(aboutInfo[i % aboutInfo.length], setAboutText);
                        setTimeout(printText, 7000);
                        i++;
                    };
                    printText();
                }
            }
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.sectionThree}>
            <div className="container-max-1248px">
                <div className={styles.sectionThreeBgTextWrap}>
                    <div className={styles.sectionThreeBgText}>G.I</div>
                </div>
                <Bounce left duration={1500}>
                    <h3>Meet Gideon Idoko 👋🏽.</h3>
                </Bounce>
                <h4 className={styles.aboutText}>- {aboutText}.</h4>
                <div className={styles.s3AboutLink}>
                    <Wobble duration={2000}>
                        <p className={styles.aboutSeeMore}>
                            <span>
                                <Link href="/about">
                                    <a>See more about me.</a>
                                </Link>
                            </span>{' '}
                            <span></span>
                        </p>
                    </Wobble>
                </div>
            </div>
        </div>
    );
};

export default SectionThree;
