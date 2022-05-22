/* eslint-disable @next/next/no-img-element */
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import Wobble from 'react-reveal/Wobble';
import styles from '../../styles/Home.module.css';

const SectionTwo = () => {
    const projects = [
        {
            id: 1,
            name: 'LinAssess',
            about: 'Ace that LinkedIn assessment.',
            cover: '/assets/img/linassessdesktopview.jpg',
            coverAlt: 'View of LinAssess',
            codeLink: 'https://github.com/IamGideonIdoko/linassess',
            projectLink: 'https://linassess.netlify.app',
            tech: ['React', 'Node.js', 'Zustand'],
        },
        {
            id: 2,
            name: 'Color Converter',
            about: 'An app that converts color values.',
            cover: '/assets/img/colorconverter-cover.png',
            coverAlt: 'View of Color Converter',
            codeLink: 'https://github.com/IamGideonIdoko/colorconverter',
            projectLink: 'https://colorconverter.surge.sh',
            tech: ['HTML', 'CSS', 'JavaScript'],
        },
        {
            id: 3,
            name: 'Cyprobar',
            about: 'Lightweight JavaScript libary for creating circular progress bars.',
            cover: '/assets/img/cyprobar-cover.png',
            coverAlt: "View of Cyprobar's doc site.",
            codeLink: 'https://github.com/IamGideonIdoko/cyprobar',
            projectLink: 'https://IamGideonIdoko.github.io/cyprobar',
            tech: ['JavaScript', 'Parcel', 'TailwindCSS'],
        },
        {
            id: 4,
            name: 'Sirimazone',
            about: 'Full-stack online movie store.',
            cover: '/assets/img/sirimazone-cover.png',
            coverAlt: 'View of Sirimazone.',
            codeLink: 'https://github.com/IamGideonIdoko/sirimazone',
            tech: ['SCSS', 'JavaScript', 'PHP', 'MySQL'],
        },
        {
            id: 5,
            name: 'Text to Speech',
            about: 'Text to speech app that uses the Web Speech API.',
            cover: '/assets/img/webtts-cover.png',
            coverAlt: 'View of Text-to-speech app.',
            codeLink: 'https://github.com/IamGideonIdoko/text-to-speech-app',
            projectLink: 'https://webtts.vercel.app',
            tech: ['React'],
        },
        {
            id: 6,
            name: 'ASCL Website',
            about: "Rebuild of ASCL's website with modern tools.",
            cover: '/assets/img/asclhomepage.jpg',
            coverAlt: 'View of UI Implementation.',
            codeLink: 'https://github.com/IamGideonIdoko/ascl-website-frontend',
            projectLink: 'https://ajaokutasteel.com.ng',
            tech: ['React', 'Node.js', 'Express.js', 'MongoDB'],
        },
        {
            id: 7,
            name: 'Border Radius Previewer',
            about: 'Previews border radius and generates its css value.',
            cover: '/assets/img/borderradiuspreviewer-cover.png',
            coverAlt: 'View of Border Radius Previewer app.',
            codeLink: 'https://github.com/IamGideonIdoko/border-radius-previewer',
            projectLink: 'https://borderradiuspreviewer.surge.sh',
            tech: ['HTML', 'CSS', 'JavaScript'],
        },
        /*
		{
			id: 6,
			name: 'G231',
			about: 'Landing page for Logitech G231 headphone.',
			cover: '/assets/img/g231-cover.png',
			coverAlt: 'View of G231 landing page.',
			codeLink: 'https://github.com/IamGideonIdoko/g231',
			projectLink: 'http://g231.surge.sh',
			tech: ['HTML', 'CSS']
		}
		*/
    ];

    const firstLetter = (str: string) => {
        const newStr = str.split('');
        return newStr[0];
    };

    return (
        <div className={styles.sectionTwo}>
            <div className="container-max-1248px">
                <Bounce left duration={1800}>
                    <h2 className={styles.projectsHead}>Projects - </h2>
                </Bounce>

                <div className={styles.projectsWrapper}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`${project.id % 2 === 0 ? styles.projectStyleOne : styles.projectStyleTwo}`}
                        >
                            <Fade bottom duration={2000}>
                                <div
                                    data-first-letter={firstLetter(project.about)}
                                    className={styles.projectSectionOne}
                                >
                                    <div className={styles.nameAboutWrapper}>
                                        <h3>{project.name}</h3>
                                        <p className="project-abt">{project.about}</p>
                                    </div>
                                    <div className={styles.projectExtLinks}>
                                        {project.projectLink && (
                                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                                                View Project <i className="neu-right-lg"></i>
                                            </a>
                                        )}
                                        {project.codeLink && (
                                            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                                                View Code <i className="neu-right-lg"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Fade>
                            <Fade duration={2000} right={!(project.id % 2 === 0)} left={project.id % 2 === 0}>
                                <div className={styles.projectSectionTwo}>
                                    <div>
                                        <div className={styles.projectTech}>
                                            {project.tech.map((x, idx) => (
                                                <span key={idx}>{x}</span>
                                            ))}
                                        </div>
                                        <img src={project.cover} alt={project.coverAlt} />
                                    </div>
                                </div>
                            </Fade>
                        </div>
                    ))}
                </div>
                <div className={styles.moreProjects}>
                    <Wobble duration={2000}>
                        <p className={styles.aboutSeeMore}>
                            <span>
                                <a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">
                                    View more projects.
                                </a>
                            </span>{' '}
                            <span></span>
                        </p>
                    </Wobble>
                </div>
            </div>
        </div>
    );
};

export default SectionTwo;
