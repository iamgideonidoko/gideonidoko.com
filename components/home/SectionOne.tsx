import React, { useEffect } from 'react';
import styles from '../../styles/Home.module.css';

const SectionOne = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                const h1Element = window.document.querySelector('.mainWelcomeLine');
                const h1ElementContent = h1Element && h1Element.textContent;
                const h1ElemArray = h1ElementContent && h1ElementContent.split('');
                // const h1ElemArrayClone = JSON.parse(JSON.stringify(h1ElemArray));

                const mappedH1ElemArray =
                    h1ElemArray &&
                    h1ElemArray.map((x, index) => {
                        if (x !== ' ') {
                            if (index === 15) {
                                return `<span class="h1Span">${x}</span> <br />`;
                            } else if (index === 8 || index === 23) {
                                return `<span class="h1Span">${x}</span><span class=" h1SpanBlock"></span>`;
                            }
                            return `<span class="h1Span">${x}</span>`;
                        } else {
                            return ' ';
                        }
                    });

                if (h1Element && mappedH1ElemArray) {
                    h1Element.innerHTML = mappedH1ElemArray && mappedH1ElemArray.join('');
                }
            }, 1000);
        }
    }, []);

    return (
        <div className={`${styles.sectionOne} container-max-1248px`}>
            <div className={`${styles.sectionOneShape} ${styles.text1}`}>
                <i className="neu-left-lg"></i>scroll down
            </div>
            <div className={`${styles.sectionOneShape} ${styles.shape1}`}>
                <div></div>
            </div>
            <div className={`${styles.sectionOneShape} ${styles.shape2}`}>
                <div></div>
            </div>

            <div>
                <h4 className={styles.welcomeLine2}>
                    <span>Curate.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>Build.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span> Improve.</span>
                </h4>
            </div>
            <h1 className={`${styles.welcomeLine} mainWelcomeLine`}>
                I develop unique <br />
                digital experiences.
            </h1>
        </div>
    );
};

export default SectionOne;
