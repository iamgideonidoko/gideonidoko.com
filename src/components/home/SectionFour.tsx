'use client';

import styles from '../../styles/Home.module.css';
import { useEffect, useRef } from 'react';

const SectionFour = () => {
  const physicsBoxesRef = useRef<Array<{ destroy: () => void }> | null>(null);
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    const initServiceAnimations = async () => {
      const [gsapModule, scrollTriggerModule, physicsBoxModule] = await Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger'),
        import('../../classes/PhysicsBox'),
      ]);

      if (cancelled) {
        return;
      }

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;
      const PhysicsBox = physicsBoxModule.default;

      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: '.services-section',
        start: 'clamp(top bottom-=80%)',
        end: 'top top',
        markers: false,
        once: true,
        onEnter: () => {
          physicsBoxesRef.current = [...document.querySelectorAll<HTMLElement>('.physics--box')].map((elem) => {
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
            });
          });
        },
      });
    };

    void initServiceAnimations();

    return () => {
      cancelled = true;
      physicsBoxesRef.current?.forEach((item) => item.destroy());
      trigger?.kill();
    };
  }, []);
  return (
    <div className={`${styles.sectionFour} services-section`} id="services">
      <div className="container-full">
        <div className={styles.sectionFourWrapper}>
          <h3 className={styles.servicesHead}>— Services —</h3>
          <div className={styles.servicesWrapper}>
            <ul className={`physics--box ${isTouchDevice ? 'pointer-events-none' : ''}`}>
              <li className="physics--box__text" aria-hidden="true">
                {`>CLICK & DRAG<`}
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>Product Engineering</h5>
                  <p>
                    I develop, integrate and maintain software solutions like websites, web apps, portals, PWAs, APIs
                    etc.
                  </p>
                </div>
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>User Friendly Products</h5>
                  <p>I build products that are easy to use, highly user-centered and deliver value to your business.</p>
                </div>
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>Product Review</h5>
                  <p>
                    I ensure a product is in its best performance by reviewing for potential issues and making
                    improvements on it.
                  </p>
                </div>
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>Ongoing Support</h5>
                  <p>
                    I cater the technical maintenance and supports that deal with content editing and design
                    reorganization.
                  </p>
                </div>
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>Tailored Development</h5>
                  <p>
                    I brief about your goals as this enables me build products that really reflect your business and its
                    personality.
                  </p>
                </div>
              </li>
              <li className="physics--box__item" data-lenis-prevent>
                <div>
                  <h5>Rigorous Testing</h5>
                  <p>
                    I deal with all possible combinations of good testing approaches so that flaws can be found and
                    removed from the system.
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
