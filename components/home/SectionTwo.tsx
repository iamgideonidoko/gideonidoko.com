/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/Home.module.css';
import { useMemo, useEffect } from 'react';
import { firstLetter } from '../../helper';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const SectionTwo = () => {
    const projects = useMemo<
        (Record<'name' | 'about' | 'cover1' | 'cover2' | 'alt' | 'link1' | 'role', string> &
            Partial<Record<'link2' | 'link1Text' | 'link2Text', string>> & { stack: string[]; id: number })[]
    >(
        () =>
            [
                {
                    name: 'Useri',
                    about: 'Agro-exclusive market and logistics mobile platform that helps tackle food waste and optimize food supply chain.',
                    cover1: '/assets/img/useri-cover.jpg',
                    cover2: '/assets/img/useri-cover-hover.jpg',
                    alt: 'Useri cover',
                    role: 'Mobile/Backend Engineer',
                    link1: 'https://play.google.com/store/apps/details?id=com.useriapp.useri',
                    link1Text: 'View App',
                    link2: 'https://useriapp.com',
                    link2Text: 'View Site',
                    stack: ['React-Native', 'RTK', 'Node.js', 'FCM', 'Prisma', 'MySQL', '...'],
                },
                {
                    name: 'BAS',
                    about: 'Biometric attendance system that tracks student attendance using fingerprint biometrics.',
                    cover1: '/assets/img/bas-cover.png',
                    cover2: '/assets/img/bas-cover-hover.png',
                    alt: 'BAS cover',
                    role: 'Full-stack/CV Engineer',
                    link1: 'https://github.com/IamGideonIdoko/bio-attendance-sys#screenshots',
                    link2: 'https://github.com/IamGideonIdoko/bio-attendance-sys',
                    stack: [
                        'React',
                        'React-Query',
                        'Zustand',
                        'Node.js (Express)',
                        'Python',
                        'Flask',
                        'Computer Vision',
                    ],
                },
                {
                    name: 'Dentbud',
                    about: 'AI/mobile-based student smart personal assistant for tracking activities, task, courses and more.',
                    cover1: '/assets/img/dentbud-cover.png',
                    cover2: '/assets/img/dentbud-cover-hover.png',
                    alt: 'Dentbud cover',
                    role: 'Full-stack/AI Engineer',
                    link1: 'https://dentbud.surge.sh',
                    link2: 'https://github.com/IamGideonIdoko/dentbud#dentbud-architecture',
                    stack: ['React Native', 'RTK', 'Node.js', 'Python', 'Rasa', 'Sanic'],
                },
                {
                    name: 'LinAssess',
                    about: 'Functional clone of LinkedIn assessment to help you ace your assessments.',
                    cover1: '/assets/img/linassess-cover.jpg',
                    cover2: '/assets/img/linassess-cover-hover.jpg',
                    alt: 'LinAssess cover',
                    role: 'Full-stack Developer',
                    link1: 'https://linassess.netlify.app',
                    link2: 'https://github.com/IamGideonIdoko/linassess',
                    stack: ['React', 'Node.js', 'Zustand', '...'],
                },
                {
                    name: 'Cyprobar',
                    about: 'Lightweight JS libary for creating circular progress bars.',
                    cover1: '/assets/img/cyprobar-cover.png',
                    cover2: '/assets/img/cyprobar-cover-hover.png',
                    alt: 'Cyprobar cover',
                    role: 'Frontend Developer',
                    link1: 'https://IamGideonIdoko.github.io/cyprobar',
                    link2: 'https://github.com/IamGideonIdoko/cyprobar',
                    stack: ['JavaScript', 'Parcel', 'TailwindCSS'],
                },
                {
                    name: 'ASCL',
                    about: 'ASCL steel company full-stack website.',
                    cover1: '/assets/img/ascl-cover.png',
                    cover2: '/assets/img/ascl-cover-hover.png',
                    alt: 'ASCL cover',
                    role: 'Full-stack Developer',
                    link1: 'https://ajaokutasteel.com.ng',
                    link2: 'https://github.com/IamGideonIdoko/ascl-website-frontend',
                    stack: ['MERN'],
                },
            ].map((item, idx) => ({ ...item, id: idx + 1 })),
        [],
    );

    useEffect(() => {
        [
            ...document.querySelectorAll('.project-section-item-left'),
            ...document.querySelectorAll('.project-section-item-right'),
        ].forEach((elem) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    markers: false,
                    start: 'clamp(top bottom-=0%)',
                    end: 'bottom 90%',
                    trigger: elem,
                    scrub: true,
                    once: true,
                },
            });

            tl.fromTo(
                elem,
                {
                    xPercent: elem.classList.contains('project-section-item-left')
                        ? -100
                        : elem.classList.contains('project-section-item-right')
                        ? 100
                        : 0,
                    opacity: 0,
                },
                {
                    xPercent: 0,
                    opacity: 1,
                },
            );
        });
    }, []);

    return (
        <div className={styles.sectionTwo}>
            <div className="container-full">
                <div className={styles.sec2Header}>
                    <div>
                        <a
                            href="https://github.com/iamgideonidoko"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="scroll-button"
                        >
                            <div className="button__deco button__deco--2"></div>
                            <div className="button__deco button__deco--1"></div>
                            <span className="button__text button__text__sectionone">
                                <span className="button__text-inner">
                                    <i className="neu-arrow"></i>
                                </span>
                            </span>
                        </a>
                    </div>
                    <p>
                        Here&apos;re some selected projects that showcase my passion for crafting memorable experiences
                        and products:
                    </p>
                </div>
                <div className={styles.projectsWrapper}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`${project.id % 2 === 0 ? styles.projectStyleOne : styles.projectStyleTwo}`}
                        >
                            <div
                                data-first-letter={firstLetter(project.name)}
                                className={`${styles.projectSectionOne} ${
                                    project.id % 2 === 1 ? 'project-section-item-left' : 'project-section-item-right'
                                }`}
                            >
                                <div className={styles.nameAboutWrapper}>
                                    <h3>{project.name}</h3>
                                    <div className={styles.projectMeta}>
                                        <p className={styles.projectAbout}>{project.about}</p>
                                        <p className={styles.projectRole}>
                                            <strong>Role:</strong> {project.role}
                                        </p>
                                        <p className={styles.projectStack}>
                                            <strong>Stack:</strong> {project.stack.join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.projectExtLinks}>
                                    {project.link1 && (
                                        <a
                                            href={project.link1}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`animated-button animated-button--pallene__solid ${styles.aboutSeeMore}`}
                                        >
                                            {project.link1Text ? project.link1Text : 'View Project'}{' '}
                                            <i className="neu-right-lg"></i>
                                        </a>
                                    )}
                                    {project.link2 && (
                                        <a
                                            href={project.link2}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`animated-button animated-button--pallene__outline ${styles.aboutSeeMore}`}
                                        >
                                            {project.link2Text ? project.link2Text : 'View Code'}{' '}
                                            <i className="neu-right-lg"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div
                                className={`${styles.projectSectionTwo} ${
                                    project.id % 2 === 0 ? 'project-section-item-left' : 'project-section-item-right'
                                }`}
                            >
                                <div>
                                    {/* <div className={styles.projectTech}>
                                        {project.stack.map((x, idx) => (
                                            <span key={idx}>{x}</span>
                                        ))}
                                    </div> */}
                                    {/* <img src={project.cover1} alt={project.alt} /> */}
                                    <div className={styles.projectImgWrapper}>
                                        <div className="gooey__image">
                                            <img
                                                src={project.cover1}
                                                data-hover={project.cover2}
                                                alt={project.alt}
                                                style={{ maxWidth: '100%' }}
                                                // width={330}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.sec2BottomSeeMore}>
                    <a
                        href="https://github.com/iamgideonidoko"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scroll-button"
                    >
                        <div className="button__deco button__deco--2"></div>
                        <div className="button__deco button__deco--1"></div>
                        <span className="button__text button__text__sectionone">
                            <span className={`button__text-inner ${styles.sec2BottomSeeMoreText}`}>
                                SEE <br /> MORE <i className="neu-arrow"></i>
                            </span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SectionTwo;
