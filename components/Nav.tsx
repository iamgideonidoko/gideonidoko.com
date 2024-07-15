import Link from 'next/link';

const Nav = () => {
  return (
    <nav className={'main-nav navOpen'}>
      <ul>
        <li>
          <Link href="/blog" className="animated-button animated-button--pallene__outlineless">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/about" className="animated-button animated-button--pallene__outlineless">
            About
          </Link>
        </li>
        <li>
          <Link href="/uses" className="animated-button animated-button--pallene__outlineless">
            Uses
          </Link>
        </li>
        {false && (
          <li>
            <Link href="/stats" className="animated-button animated-button--pallene__outlineless">
              Stats
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
