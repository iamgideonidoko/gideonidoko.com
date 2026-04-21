import Link from 'next/link';

const Nav = () => {
  return (
    <nav className={'main-nav navOpen'}>
      <ul>
        <li>
          <Link href="/writing" className="animated-button animated-button--pallene__outlineless">
            Writing
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
        <li>
          <Link
            href="https://lab.gideonidoko.com"
            target="_blank"
            className="animated-button animated-button--pallene__outlineless"
          >
            Lab
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
