'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import PhysicsBox from '../../classes/PhysicsBox';
import styles from '../../styles/About.module.css';

export default function AboutPage() {
  const physicsBoxesRef = useRef<PhysicsBox[] | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: '.about-stack-section',
      start: 'clamp(top bottom-=90%)',
      end: 'top top',
      markers: false,
      once: true,
      onEnter: () => {
        physicsBoxesRef.current = [...document.querySelectorAll<HTMLElement>('.physics--box')].map((elem) => {
          return new PhysicsBox(elem, {
            radius: {
              unit: 'vw',
              value: 3,
            },
            minRadius: {
              unit: 'px',
              value: 50,
            },
            maxRadius: {
              unit: 'vw',
              value: 3,
            },
          });
        });
      },
    });

    return () => {
      physicsBoxesRef.current?.forEach((item) => item.destroy());
      trigger?.kill();
    };
  }, []);

  return (
    <main className={`padding-top-10rem ${styles.aboutMain}`}>
      <div className="container-full">
        <div className={styles.aboutSectionOne}>
          <div>
            <h3>Hi there! 👋🏽</h3>
            <h1>
              I&apos;m <strong style={{ fontFamily: 'AkiraExpanded', fontSize: '1.5em' }}>GIDEON IDOKO</strong>.
            </h1>
            <div className={styles.profileImgWrapper}>
              <div className="gooey__image">
                <Image
                  src="/assets/img/gideon.jpeg"
                  data-hover="/assets/img/gideon-hover.jpeg"
                  alt="Gideon Idoko"
                  width={1242}
                  height={1652}
                  style={{ maxWidth: '100%', width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
          <div>
            <p>
              a software engineer interested in creative technology, design, AI, research, and building impactful
              solutions. I go a long way to ensure the security, accessibility and usability of any product/solution I
              work on and that they meet the business requirements while focusing on providing the best experience for
              their end users.
            </p>

            <p>
              I write about Software Engineering topics and tools in <Link href="/writing">Writing</Link> and on other
              platforms. When I am not in front of my IDE, I&apos;ll prolly be engaged in surfing or sports like play
              tennis and badminton.
            </p>

            <div className={styles.resumeBtnWrapper}>
              <a
                href="https://docs.google.com/document/d/1VKBYjOOj0pSSD1G8aLOXoY-SZnfyMg-24VGd3wQuF-w/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="scroll-button"
                suppressHydrationWarning
              >
                <div className="button__deco button__deco--2" suppressHydrationWarning></div>
                <div className="button__deco button__deco--1" suppressHydrationWarning></div>
                <span className="button__text button__text__sectionone">
                  <span className={`button__text-inner ${styles.resumeBtnText}`}>
                    <span>RESUME</span>
                    <i className="neu-arrow"></i>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={`${styles.aboutStack} about-stack-section`}>
          <h2>Stack {`<Tools / Languages / Frameworks / Libraries>`}</h2>
          <ul className={`physics--box ${ScrollTrigger.isTouch ? 'pointer-events-none' : ''}`}>
            <span className="physics--box__text">{`>CLICK & DRAG<`}</span>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              SCSS
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              JavaScript
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              TypeScript
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              GraphQL
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              React
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              React Native
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              RTK
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              NextJS
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              NodeJS
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              ExpressJS
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              NoSQL
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              Redis
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              Firebase
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              Supabase
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              PHP
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              SQL
            </li>
            <li
              className={`physics--box__item ${ScrollTrigger.isTouch ? 'pointer-events-all' : ''}`}
              data-lenis-prevent
            >
              Wordpress
            </li>
          </ul>
        </div>

        <div className={styles.aboutFooter}>
          <p>
            <b>No idea of what you really want?</b> I&apos;ll assist you come up with a strategic plan which will help
            your business seamlessly grow.
          </p>

          <p>
            <b>Want to chat about my content?</b> I&apos;d be happy to engage in a discussion with you.
          </p>

          <p>
            <b>Want your idea to be a reality?</b> I&apos;ll pay close attention to what your idea is and aim to achieve
            and with suggestions, will create the best possible product as envisioned.
          </p>

          <p>
            <b>Need more hands in your team?</b> I can work with any team, even if they&apos;re part way through a
            project. Just hit me up when you need me.
          </p>
        </div>
      </div>
    </main>
  );
}
