import styles from '../../styles/Home.module.css'

const SectionTwo = () => {

	const projects = [
		{
			id: 1,
			name: 'Color Converter',
			about: 'An app that converts color values.',
			cover: '/assets/img/colorconverter-cover.png',
			coverAlt: 'View of Color Converter',
			codeLink: 'https://github.com/IamGideonIdoko/colorconverter',
			projectLink: 'https://colorconverter.surge.sh',
			tech: ['HTML', 'CSS', 'JavaScript']
		},
		{
			id: 2,
			name: 'Cyprobar',
			about: 'Lightweight JavaScript libary for creating circular progress bars.',
			cover: '/assets/img/cyprobar-cover.png',
			coverAlt: 'View of Cyprobar\'s doc site.',
			codeLink: 'https://github.com/IamGideonIdoko/cyprobar',
			projectLink: 'https://IamGideonIdoko.github.io/cyprobar',
			tech: ['JavaScript', 'Parcel', 'TailwindCSS']
		},
		{
			id: 3,
			name: 'Sirimazone',
			about: 'Full-stack online movie store.',
			cover: '/assets/img/sirimazone-cover.png',
			coverAlt: 'View of Sirimazone.',
			codeLink: 'https://github.com/IamGideonIdoko/sirimazone',
			tech: ['SCSS', 'JavaScript', 'PHP', 'MySQL']
		},
		{
			id: 4,
			name: 'Text to Speech',
			about: 'Text to speech app that uses the Web Speech API.',
			cover: '/assets/img/webtts-cover.png',
			coverAlt: 'View of Text-to-speech app.',
			codeLink: 'https://github.com/IamGideonIdoko/text-to-speech-app',
			projectLink: 'https://webtts.vercel.app',
			tech: ['React']
		},
		{
			id: 5,
			name: 'Music Ecom UI',
			about: 'Implementation of a music ecommerce single page ui.',
			cover: '/assets/img/music-ecom-ui-cover.png',
			coverAlt: 'View of UI Implementation.',
			codeLink: 'https://github.com/IamGideonIdoko/music-ecom-ui',
			projectLink: 'https://music-ecom-ui.surge.sh',
			tech: ['HTML', 'SCSS', 'JavaScript']
		},
		{
			id: 6,
			name: 'Border Radius Previewer',
			about: 'Previews border radius and generates its css value.',
			cover: '/assets/img/borderradiuspreviewer-cover.png',
			coverAlt: 'View of Border Radius Previewer app.',
			codeLink: 'https://github.com/IamGideonIdoko/border-radius-previewer',
			projectLink: 'https://borderradiuspreviewer.surge.sh',
			tech: ['HTML', 'CSS', 'JavaScript']
		}
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

	const firstLetter = (str) => {
		str = str.split('');
		return str[0];
	}

	return (
		<div className={styles.sectionTwo}>
			<div className="container-max-1248px">
				<h2 className={styles.projectsHead}>Projects - </h2>

				<div className={styles.projectsWrapper}>
				{projects.map(project => (
					<div key={project.id} className={`${parseInt(project.id) % 2 === 0 ? styles.projectStyleOne : styles.projectStyleTwo}`}>
						<div data-first-letter={firstLetter(project.about)} className={styles.projectSectionOne}>
							<div className={styles.nameAboutWrapper}>
								<h3>{project.name}</h3>
								<p>{project.about}</p>
							</div>
							<div className={styles.projectExtLinks}>
								{
									project.projectLink && (<a href={project.projectLink} target="_blank" rel="noopener noreferrer">View Project <i className="neu-right-lg" ></i></a>)}
									{
									project.codeLink && (<a href={project.codeLink} target="_blank" rel="noopener noreferrer">View Code <i className="neu-right-lg"></i></a>)
								
								}
							</div>

						</div>
						<div className={styles.projectSectionTwo}>
							<div>
								<div className={styles.projectTech}>{
									project.tech.map((x, idx) => (<span key={idx}>{x}</span>))
								}</div>
								<img src={project.cover} alt={project.coverAlt} />
							</div>
						</div>
						
					</div>
					))}
					
				</div>
				<div className={styles.moreProjects}>
					<p className={styles.aboutSeeMore}><span><a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer">View more projects.</a></span> <span></span></p>
				</div>
			</div>
		</div>
	);

}


export default SectionTwo;
