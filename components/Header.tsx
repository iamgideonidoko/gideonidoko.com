/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import FullscreenSwitch from './FullscreenSwitch';
import Nav from './Nav';
import AdminMenu from './AdminMenu';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Image from 'next/image';

const Header = ({
    isNavOpen,
    setIsNavOpen,
}: {
    isNavOpen: boolean;
    setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const auth = useSelector(({ auth }: RootState) => auth);
    const store = useSelector((state: RootState) => state);

    console.log('Store => ', store);

    const handleNavMenuBtnClick = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header className="header">
            <div className="logo-wrap">
                <Link href="/">
                    <a>
                        <Image
                            src="/assets/img/GideonIdokoDevLogo.png"
                            className="site-logo"
                            alt="Gideon Idoko"
                            width={60}
                            height={50}
                        />
                    </a>
                </Link>
            </div>
            <div className="nav-adminmenu-wrap">
                <div>
                    <button onClick={handleNavMenuBtnClick} className="nav-menu-btn">
                        <i className={!isNavOpen ? 'neu-close-lg' : 'neu-hamburger-menu'}></i>
                    </button>
                </div>
                <FullscreenSwitch isNavOpen={isNavOpen} />
                <ThemeSwitch isNavOpen={isNavOpen} />
                <Nav />
                {
                    //if user is authenticated, show the admin menu
                    auth.isAuthenticated && (
                        <AdminMenu
                            adminUsername={auth.userInfo?.user?.username as string}
                            isNavOpen={isNavOpen}
                            allowForMobile={false}
                        />
                    )
                }
            </div>
        </header>
    );
};

export default Header;
