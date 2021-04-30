import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/Home.module.css'

const SectionThree = () => {

	const aboutInfo = [
		"I'm a Creative Software Developer",
		"I'm a Web Designer/Developer",
		"I'm a freelancer",
		"I also write",
		"I've a liking to sharing knowledge",
		"I love building positive solutions",
		"I reside in Nigeria",
		"I'm interested in community building"
	];

	const [aboutText, setAboutText] = useState(null);

	useEffect(() => {
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