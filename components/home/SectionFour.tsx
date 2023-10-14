/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/Home.module.css';
import PhysicsBox from '../../classes/PhysicsBox';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const SectionFour = () => {
    const physicsBoxesRef = useRef<PhysicsBox[] | null>(null);
    useEffect(() => {
        try {
            ScrollTrigger.create({
                trigger: '.services-section',
                start: 'clamp(top bottom-=70%)',
                end: 'top top',
                markers: false,
                once: true,
                onEnter: () => {
                    physicsBoxesRef.current = [...document.querySelectorAll<HTMLElement>('.physics--box')].map(
                        (elem) => {
                            return new PhysicsBox(elem, {
                                radius: {
                                    unit: 'vw',
                                    value: 8,
                                },
                                minRadius: {
                                    unit: 'px',
                                    value: 100,
                                },
                                maxRadius: {
                                    unit: 'vw',
                                    value: 8,
                                },
                                // radius: {
                                //     unit: 'vw',
                                //     value: 2,
                                // },
                                // minRadius: {
                                //     unit: 'px',
                                //     value: 50,
                                // },
                                // maxRadius: {
                                //     unit: 'vw',
                                //     value: 2,
                                // },
                            });
                        },
                    );
                },
            });
        } catch (err) {
            console.error('ERROR: ', err);
        }
        return () => {
            physicsBoxesRef.current?.forEach((item) => item.destroy());
        };
    }, []);
    return (
        <div className={`${styles.sectionFour} services-section`} id="#services">
            <div className="container-full">
                <div className={styles.sectionFourWrapper}>
                    <h3 className={styles.servicesHead}>— Services —</h3>
                    <div className={styles.servicesWrapper}>
                        <ul className="physics--box">
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>Product Development</h5>
                                    <p>
                                        I develop, integrate and maintain software solutions like websites, web apps,
                                        portals, PWAs, APIs etc.
                                    </p>
                                </div>
                            </li>
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>User Friendly Products</h5>
                                    <p>
                                        I build products that are easy to use, highly user-centered and deliver value to
                                        your business.
                                    </p>
                                </div>
                            </li>
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>Product Review</h5>
                                    <p>
                                        I ensure a product is in its best performance by reviewing for potential issues
                                        and making improvements that could fix it.
                                    </p>
                                </div>
                            </li>
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>Ongoing Support</h5>
                                    <p>
                                        I cater the technical maintenance (backup, code & tools upgrade) and supports
                                        that deal with content editing and design reorganization.
                                    </p>
                                </div>
                            </li>
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>Tailored Development</h5>
                                    <p>
                                        I brief about your goals as this enables me build products that really reflect
                                        your business and its personality.
                                    </p>
                                </div>
                            </li>
                            <li className="physics--box__item" data-lenis-prevent>
                                <div>
                                    <h5>Rigorous Testing</h5>
                                    <p>
                                        I deal with all possible combinations of good testing approaches so that flaws
                                        can be found and removed from the system.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionFour;
