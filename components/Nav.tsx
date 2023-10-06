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
            </ul>
        </nav>
    );
};

export default Nav;
