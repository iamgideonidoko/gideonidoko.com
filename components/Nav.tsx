import Link from 'next/link';

const Nav = ({}) => {
    return (
        <nav className={'main-nav navOpen'}>
            <ul>
                <li>
                    <Link href="/blog">Blog</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li className="get-in-touch-wrapper">
                    <div className="get-in-touch">
                        <Link href="/contact">Get in touch</Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
