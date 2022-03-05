import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import FullscreenSwitch from './FullscreenSwitch';
import Nav from './Nav';
import AdminMenu from './AdminMenu';
import { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../store/actions/postActions';
import { getGithubUser } from '../store/actions/userActions';
import { loadAdminUser } from '../store/actions/authActions';
import { loadFirebase } from '../store/actions/firebaseActions';
import { getAssets } from '../store/actions/assetActions';
import { getContacts } from '../store/actions/contactActions';

const Header = (props) => {
    useEffect(() => {
        /* 		console.log = function () { };
		console.warn = function () { };
		console.error = function () { };
		setTimeout(() => console.clear(), 3000); */
        // props.getPosts(); //dispatch an action to update the state with all posts from server when the any page first loads
        //load firebase
        // setTimeout(() => !props.fire.firebaseApp && props.loadFirebase(), 3000);
        //load assets
        // props.getAssets();
        //load contacts
        // props.getContacts();
    }, []);

    useEffect(() => {
        !props.auth.adminuser && props.loadAdminUser(props.auth.token);
    }, [props.auth.token]);

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.getGithubUser(props.auth.adminuser.githubusername);
        }
    }, [props.auth.isAuthenticated]);

    if (typeof window !== 'undefined') {
        window.onload = function () {
            console.log('WEBSITE LOADED');
        };
    }

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
                    props.auth.isAuthenticated && (
                        <AdminMenu adminUsername={props.auth.adminuser.username} isNavOpen={props.isNavOpen} />
                    )
                }
            </div>
        </header>
    );
};

const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth,
    user: state.user,
    fire: state.fire,
});

export default connect(mapStateToProps, {
    getPosts,
    loadAdminUser,
    getGithubUser,
    loadFirebase,
    getAssets,
    getContacts,
})(Header);
