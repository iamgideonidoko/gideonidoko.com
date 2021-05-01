import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'

const SectionThree = () => {

	const aboutInfo = [
		"I'm a Software Developer",
		"I'm a Technical Writer",
		"I focus more on web engineering",
		"I love building positive solutions",
		"I write and create contents",
		"I've a liking to sharing knowledge",
		"I'm interested in community building",
		"I reside in Nigeria"
	];

	const [aboutText, setAboutText] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			let scrambler;
			if (typeof window !== "undefined") {
				try {
					scrambler = new window.Scrambler();
				} catch(err) {
					console.log("Scrambler Error: ", err);
				}
				
				if (scrambler) {
					let i = 0;
					const printText = () => {
						scrambler.scramble(aboutInfo[i % aboutInfo.length], setAboutText)
						setTimeout(printText, 7000);
						i++;
					}
					printText();
				}
			}
		}, 3000);
		}, [])

	return (
		<div className={styles.sectionThree}>
			<div className="container-max-1248px">
			<div className={styles.sectionThreeBgTextWrap}>
				<div className={styles.sectionThreeBgText}>G.I</div>
			</div>
				<h3>I'm Gideon Idoko.</h3>
				<h4 className={styles.aboutText}>- {aboutText}.</h4>
				<div className={styles.s3AboutLink}>
				<p className={styles.aboutSeeMore}><span><Link href="/about"><a>See more about me.</a></Link></span> <span></span></p>
				</div>
			</div>			
			
		</div>
	);

}


export default SectionThree;