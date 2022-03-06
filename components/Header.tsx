/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import FullscreenSwitch from './FullscreenSwitch';
import Nav from './Nav';
import AdminMenu from './AdminMenu';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Header = (props) => {
    const auth = useSelector(({ auth }: RootState) => auth);
    const store = useSelector((state: RootState) => state);
    console.log('Store => ', store);

    const handleNavMenuBtnClick = () => {
        props.setIsNavOpen(!props.isNavOpen);
    };

    return (
        <header className="header">
            <div className="logo-wrap">
                <Link href="/">
                    <a>
                        <img src="/assets/img/GideonIdokoDevLogo.png" className="site-logo" alt="Gideon Idoko" />
                    </a>
                </Link>
            </div>
            <div className="nav-adminmenu-wrap">
                <div>
                    <button onClick={handleNavMenuBtnClick} className="nav-menu-btn">
                        <i className={!props.isNavOpen ? 'neu-close-lg' : 'neu-hamburger-menu'}></i>
                    </button>
                </div>
                <FullscreenSwitch isNavOpen={props.isNavOpen} />
                <ThemeSwitch isNavOpen={props.isNavOpen} />
                <Nav isNavOpen={props.isNavOpen} />
                {
                    //if user is authenticated, show the admin menu
                    auth.isAuthenticated && (
                        <AdminMenu adminUsername={'props.auth.adminuser.username'} isNavOpen={props.isNavOpen} />
                    )
                }
            </div>
        </header>
    );
};

export default Header;
