import Link from 'next/link';

const Footer = () => {
	//get current year
	const date = new Date();
	const currentYear = date.getFullYear();

	return (
		<footer className="footer">
			<div className="container-max-1248px footer-wrapper">
				<div className="footer-content-1"><Link href="/"><a><img src="/assets/img/GideonIdokoDevLogo.png" className="site-footer-logo" alt="Gideon Idoko"/></a></Link></div>
				<div className="footer-content-2">
					<div>
						<h3>Gideon Idoko</h3>
						<p>I love building positive solutions with awesome technologies. I also give back to the community by sharing my experiences. I'm currently available for hiring. <br /> <br /> In need of a developer?</p>
						<p className="lets-talk"><Link href="/contact"><a>Let's talk <i className="neu-right-lg"></i></a></Link></p>	
						<div className="social-links">
		                  <ul>
		                    <li><a href="https://github.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a></li>
		                    <li><a href="https://codepen.io/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-codepen"></i></a></li>
		                    <li><a href="https://twitter.com/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
		                    <li><a href="https://linkedin.com/in/IamGideonIdoko" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a></li>
		                  </ul>
		                </div>
					</div>
					<div className="quick-links">
						<h4>Quick Links</h4>
						<ul>
							<li><Link href="/"><a>Home</a></Link></li>
							<li><Link href="/blog"><a>Blog</a></Link></li>
							<li><Link href="/about"><a>About</a></Link></li>
							{/*
							<li><Link href="/#services"><a>Services</a></Link></li>
							*/}
							<li><Link href="/contact"><a>Contact</a></Link></li>
						</ul>
					</div>
				</div>
				<div className="footer-content-3">
					<p><i className="neu-code"></i> with <i className="neu-love"></i> by Gideon Idoko &copy; {currentYear}</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer;