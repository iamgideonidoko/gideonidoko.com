'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type KillableTimeline = {
  kill: () => void;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const footerRef = useRef<HTMLElement | null>(null);
  const timeLineRefs = useRef<KillableTimeline[]>([]);
  const refreshFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cancelled = false;
    let initFrameId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const initFooterAnimations = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([import('gsap'), import('gsap/dist/ScrollTrigger')]);

      if (cancelled) {
        return;
      }

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const addTrigger = () => {
        timeLineRefs.current.forEach((timeline) => timeline.kill());
        timeLineRefs.current = [];

        const footerElement = footerRef.current;
        if (!footerElement) {
          return;
        }

        [...footerElement.querySelectorAll('.footer-main-heading')].forEach((element) => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              markers: false,
              start: 'clamp(top bottom-=0%)',
              end: 'center center',
              trigger: element,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            element,
            {
              letterSpacing: '0.5em',
              opacity: 0,
            },
            {
              letterSpacing: '0em',
              opacity: 1,
            },
          );

          timeLineRefs.current.push(timeline);
        });

        [...footerElement.querySelectorAll('.footer-bg')].forEach((element) => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              markers: false,
              start: 'clamp(top bottom-=50%)',
              end: 'top top',
              trigger: element,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            element,
            {
              width: '100%',
              height: '100%',
              xPercent: 0,
              yPercent: 0,
              opacity: -1,
            },
            {
              width: '90%',
              height: '80%',
              xPercent: 5,
              yPercent: 12.5,
              opacity: 0.8,
            },
          );

          timeLineRefs.current.push(timeline);
        });
      };

      const refreshTriggers = () => {
        if (refreshFrameRef.current) {
          window.cancelAnimationFrame(refreshFrameRef.current);
        }

        refreshFrameRef.current = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };

      initFrameId = window.requestAnimationFrame(() => {
        addTrigger();
        refreshTriggers();
      });

      resizeObserver = new ResizeObserver(() => {
        refreshTriggers();
      });

      if (footerRef.current) {
        resizeObserver.observe(footerRef.current);
      }
      resizeObserver.observe(document.documentElement);
    };

    void initFooterAnimations();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(initFrameId);
      if (refreshFrameRef.current) {
        window.cancelAnimationFrame(refreshFrameRef.current);
      }
      resizeObserver?.disconnect();
      timeLineRefs.current.forEach((timeline) => timeline.kill());
      timeLineRefs.current = [];
    };
  }, [pathname]);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-bg"></div>
      <div className=" footer-wrapper">
        <div>
          <Image src="/logo.svg" className="site-footer-logo" alt="Gideon Idoko" width={25} height={25} />
        </div>
        <p className="footer-question">GOT A PROJECT IN MIND?</p>
        <h3 className="footer-main-heading">LET&apos;S CONNECT</h3>
        <div className="write-msg-btn">
          <a
            href="mailto:iamgideonidoko@gmail.com?subject=I%20want%20to%20connect%20with%20you&body=Hello%2C%20I%27m%20..."
            className="scroll-button"
          >
            <div className="button__deco button__deco--2"></div>
            <div className="button__deco button__deco--1"></div>
            <span className="button__text button__text__sectionone">
              <span className="button__text-inner footer-write-text">
                WRITE A <br /> &nbsp;&nbsp;MESSAGE
              </span>
            </span>
          </a>
        </div>
      </div>
      <div className="footer-footer">
        <div>
          <span>FEEL FREE TO CONNECT WITH ME ON SOCIAL</span>
        </div>
        <div>
          <span>
            <a
              href="https://x.com/iamgideonidoko"
              target="_blank"
              rel="noopener noreferrer"
              className="animated-button animated-button--pallene__outlineless"
            >
              X
            </a>
          </span>
          <span>
            <a
              href="https://linkedin.com/in/iamgideonidoko"
              target="_blank"
              rel="noopener noreferrer"
              className="animated-button animated-button--pallene__outlineless"
            >
              LINKEDIN
            </a>
          </span>
          <span>
            <a
              href="https://instagram.com/iamgideonidoko"
              target="_blank"
              rel="noopener noreferrer"
              className="animated-button animated-button--pallene__outlineless"
            >
              INSTAGRAM
            </a>
          </span>
          <span>
            <Link href="/contact">
              CONTACT <i className="neu-arrow"></i>
            </Link>
          </span>
          <span>&copy; {currentYear}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
