import { Fragment, useRef, useState } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import { addContact, startSending, stopSending } from '../store/actions/contactActions';
import { config } from '../config/keys';
import SimpleReactValidator from 'simple-react-validator';
import styles from '../styles/Contact.module.css';
import { NextSeo } from 'next-seo';
import { PropTypes } from 'prop-types';

const Contact = (props) => {

	// internal state
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [, forceUpdate] = useState();

	//instantiate the validator as a singleton
	const simpleValidator = useRef(new SimpleReactValidator({
		element: (message, className) => <div className={'formErrorMsg'}>{message}</div>
	}));
	
	if (props.contact.isMessageSent) {
	    props.stopSending(); 
		swal({
	        title: "",
	        text: `Your message has been successfully sent.`,
	        icon: "success",
	        buttons: false
	      }).then(res => {
	      	setName('');
	      	setEmail('');
	      	setMessage('');
		});
	}

	const handleContactFormSubmit = e => {
		e.preventDefault();

		if(simpleValidator.current.allValid()) {
			//all input is valid

			swal({
				title: "Send message?",
				text: `${name}, do you really want to send this message?`,
				icon: "warning",
				buttons: {
					cancel: "Cancel",
					confirm: {
						text: "Yes, Send",
						className: "uploadConfirmBtn"
					},
				}
			}).then(willSend => {
				if (willSend) {
					props.startSending();
					const newContact = {
						name,
						email,
						message,
						contactPostAccessKey: config.contactPostAccessKey
					}
					props.addContact(newContact);
				}
			})


		} else {
			//input not valid, so show error
			simpleValidator.current.showMessages(); //show all errors if exist
			forceUpdate(1); //force update component to display error
		}
	}

	const handleInputChange = e => {
		switch(e.target.name) {
			case 'name':
				setName(e.target.value);
				break;
			case 'email':
				setEmail(e.target.value);
				break;
			case 'message':
				setMessage(e.target.value);
				break;
		}
	}

	return (
		<Fragment>
			<NextSeo
					title="Contact me - Gideon Idoko"
					description="Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out."
					canonical="https://gideonidoko.com"
					openGraph={{
					url: "https://gideonidoko.com/contact",
					title: "Gideon Idoko - Software Developer and Technical Writer",
					description: "Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out.",
					images: [
						{
						url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
						width: 1004,
						height: 591,
						alt: 'Gideon Idoko\'s card image'
						}
					],
					site_name: "Gideon Idoko - Software Developer and Technical Writer"
					}}
					twitter={{
					handle: "@IamGideonIdoko",
					site: "@IamGideonIdoko",
					cardType: "summary_large_image"
					}}
				/>
			<Head>
				<title>Contact me - Gideon Idoko</title>
				<meta name="keywords" content="gideon idoko,contact gideon idoko,gideon, contact gideon,,idoko,software developer,technical writer,software engineer,developer,engineer,writer, get in touch"></meta>
			</Head>
			<main className={`padding-top-10rem ${styles.contactMain}`}>
				<div className="container-max-1248px">
					<h1>Contact me.</h1>
					<div className={styles.contactBody}>
						<div className={styles.contactLeft}>
							<img src="/assets/img/WebDesign.svg" alt="Contact Me" />
						</div>
						<div className={styles.contactRight}>
							<p>Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out.</p>

							<form className={styles.contactForm} onSubmit={handleContactFormSubmit}>
								<div className={styles.contactNameAndEmail}>
									<div>
										<label htmlFor="name">Your Name</label>
										<input type="text" id="name" name="name" value={name} onChange={handleInputChange} placeholder="What's your name?" />
										{ /* simple validation */
											simpleValidator.current.message('name', name, 'required|alpha_space|between:2,25')
										}
									</div>
									<div>
										<label htmlFor="email">Your Email</label>
										<input type="email" id="email" name="email" value={email} onChange={handleInputChange} placeholder="What's your Email?" />
										{ /* simple validation */
											simpleValidator.current.message('email', email, 'required|email|between:4,25')
										}
									</div>
								</div>
								<div>
									<label htmlFor="message">Your Message</label>
									<textarea name="message" value={message} id="message" cols="30" rows="10" onChange={handleInputChange} placeholder="Hello, I want to ..."></textarea>
									{ /* simple validation */
										simpleValidator.current.message('message', message, 'required|alpha_num_dash_space|between:2,500')
									}
								</div>
								<div className={styles.submitBtnWrap}>
									<button type="submit">{props.contact.isSending ? <span>Sending Message...</span> : <span>Send Message <i className="neu-paper-plane"></i></span>}</button>
								</div>
							</form>

							<div className={styles.contactSectionTwo}>
								<p>You can reach me via email: <a href="mailto:iamgideonidoko@gmail.com">iamgideonidoko@gmail.com</a>.</p>
								<p>Check out my <b>social media</b> presence below to get to know me better:</p>
								<div className={`${styles.socialLinks} social-links`}>
				                  <ul>
				                    <li><a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a></li>
				                    <li><a href="https://codepen.io/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-codepen"></i></a></li>
				                    <li><a href="https://twitter.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
				                    <li><a href="https://linkedin.com/in/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a></li>
				                  </ul>
				                </div>
								
							</div>
						</div>
					</div>
				</div>
			</main>
		</Fragment>
	)
}

Contact.propTypes = {
	contact: PropTypes.object,
	addContact: PropTypes.func,
	startSending: PropTypes.func,
	stopSending: PropTypes.func,
	error: PropTypes.object
}

const mapStateToProps = state =>({
	contact: state.contact,
	error: state.error
});

export default connect(mapStateToProps, { addContact, startSending, stopSending })(Contact);