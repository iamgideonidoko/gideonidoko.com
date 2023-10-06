import { useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import type { Result as SplittingResult } from 'splitting';

const SectionOne = () => {
    useEffect(() => {
        (async () => {
            const Splitting = await import('splitting');
            try {
                Splitting.default({
                    target: '.wl-word',
                }) as unknown as SplittingResult[];
            } catch (e) {}
        })();
    }, []);
    return (
        <div className={`${styles.sectionOne} container-full`}>
            <div className={styles.sectionScrollButtonWrapper}>
                <button className="scroll-button">
                    <div className="button__deco button__deco--2"></div>
                    <div className="button__deco button__deco--1"></div>
                    <span className="button__text button__text__sectionone">
                        <span className="button__text-inner">
                            <i className="neu-down-lg"></i>
                        </span>
                    </span>
                </button>
            </div>
            <div className={`${styles.scrollText}`}>
                scroll down <i className="neu-down-lg"></i>
            </div>

            <div>
                <h4 className={styles.welcomeLine2}>Gideon Idoko - Software Engineer</h4>
            </div>
            <h1 className={`${styles.welcomeLine} mainWelcomeLine`}>
                <span>
                    <span className="wl-word">Crafting</span>
                </span>
                <span>
                    <span className="wl-word">Awesome</span>
                </span>
                <span>
                    <span className="wl-word">Experiences</span>
                </span>
            </h1>
        </div>
    );
};

export default SectionOne;
