
import Link from 'next/link';

const Nav = (props) => {
	return (
		<nav className={"main-nav navOpen"}>
			<ul>
				<li><Link href="/blog">Blog</Link></li>
				<li><Link href="/about">About</Link></li>
				{/*
				<li><Link href="/#services">Services</Link></li>
				*/}
				<li className="get-in-touch"><Link  href="/contact" >Get in touch</Link></li>
			</ul>
		</nav>
		)
}


export default Nav;