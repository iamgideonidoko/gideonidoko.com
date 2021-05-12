import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../../styles/Home.module.css';

const SectionOne = () => {

	useState(() => {
		if (typeof window !== "undefined") {
		setTimeout(() => {
			const h1Element = window.document.querySelector('.mainWelcomeLine');
			const h1ElementContent = h1Element && h1Element.textContent;
			const h1ElemArray = h1ElementContent && h1ElementContent.split('');
			// const h1ElemArrayClone = JSON.parse(JSON.stringify(h1ElemArray));

			const mappedH1ElemArray = h1ElemArray && h1ElemArray.map((x, index) => {
				if (x !== " ") {
					if (index === 15) {
						return `<span class="h1Span">${x}</span> <br />`;
					} else if (index === 8 || index === 23) {
						return `<span class="h1Span">${x}</span><span class=" h1SpanBlock"></span>`;
					}
					return `<span class="h1Span">${x}</span>`;
				} else {
					return " ";
				}
			});

			if (h1Element) {
				h1Element.innerHTML = mappedH1ElemArray && mappedH1ElemArray.join('');
			}


		}, 4000)
	}
	}, []);


	const h4Curate = {
		hidden: {
			x: -120,
			opacity: 0
		},
		visible: {
			x: 0,
			opacity: 1,
			transition: {
				delay: 0,
				duration: 1
			}	
		}
	}

	const h4Develop = {
		hidden: {
			y: -120,
			opacity: 0
		},
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				delay: 1,
				duration: 1
			}
		}
	}

	const h4Improve = {
		hidden: {
			x: 120,
			opacity: 0
		},
		visible: {
			x: 0,
			opacity: 1,
			transition: {
				type: "string",
				delay: 2,
				duration: 1
			}	
		}
	}

	const h1Variant = {
		hidden: {
			scale: 0,
			opacity: 0,
			y: '100vh'
		},
		visible: {
			scale: 1,
			opacity: 1,
			y: 0,
			transition: {
				delay: 3,
				duration: 2
			}
		}
	}

	return (
		<div className={`${styles.sectionOne} container-max-1248px`}>
		<div className={`${styles.sectionOneShape} ${styles.text1}`}><i className="neu-left-lg"></i>scroll down</div>
		<div className={`${styles.sectionOneShape} ${styles.shape1}`}></div>
		<div className={`${styles.sectionOneShape} ${styles.shape2}`}>
			<div className={styles.shape2Sub}></div>
		</div>
			<div>
				<h4 className={styles.welcomeLine2}>
					<motion.span initial="hidden" animate="visible" variants={h4Curate}>Curate.</motion.span>&nbsp;&nbsp;  
					<motion.span initial="hidden" animate="visible" variants={h4Develop}>Develop.</motion.span>&nbsp;&nbsp;  
					<motion.span initial="hidden" animate="visible" variants={h4Improve}> Improve.</motion.span></h4>
			</div>
			<motion.h1 initial="hidden" animate="visible" variants={h1Variant} className={`${styles.welcomeLine} mainWelcomeLine`}>I develop unique <br />digital experiences.</motion.h1>
			
		</div>
	);

}


export default SectionOne;