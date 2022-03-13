/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import swal from 'sweetalert';
import { Menu, MenuItem, MenuDivider } from '@szhsin/react-menu';
// import { logout } from '../store/actions/authActions';
import '@szhsin/react-menu/dist/index.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logoutUser } from '../store/slice/auth.slice';

const AdminMenu = ({
    isNavOpen,
    adminUsername,
    allowForMobile,
}: {
    isNavOpen: boolean;
    adminUsername: string;
    allowForMobile: boolean;
}) => {
    const auth = useSelector(({ auth }: RootState) => auth);
    const dispatch = useDispatch();
    const logoutAdmin = () => {
        swal({
            title: 'Log out?',
            text: `Do you really want to log out?`,
            icon: 'warning',
            buttons: {
                cancel: 'No' as unknown as boolean,
                confirm: {
                    text: 'Yes, Log out',
                    className: 'uploadConfirmBtn',
                },
            },
        }).then((willLogout) => {
            if (willLogout) {
                dispatch(logoutUser());
            }
        });
    };

    return (
        <Menu
            className="admin-menu-wrap"
            id="admin-menu-wrap"
            arrow={true}
            menuButton={
                <button
                    className={!isNavOpen && allowForMobile ? 'admin-menu-initiator' : 'admin-menu-initiator navOpen'}
                >
                    <span>
                        <img src={auth.userGithubInfo?.avatar_url} alt="" />
                    </span>{' '}
                    <span>
                        <i className="neu-so-triangle"></i>
                    </span>
                </button>
            }
        >
            <MenuItem className="admin-menu-item" id="admin-menu-username">
                <span>@{adminUsername}</span>
            </MenuItem>
            <MenuDivider />
            <MenuItem className="admin-menu-item">
                <Link href="/blog">
                    <a>Blog Home</a>
                </Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem className="admin-menu-item">
                <Link href="/admin">
                    <a>Your Profile</a>
                </Link>
            </MenuItem>
            <MenuItem className="admin-menu-item">
                <Link href="/admin/contacts">
                    <a>Your Contacts</a>
                </Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem className="admin-menu-item">
                <Link href="/admin/create-post">
                    <a>Create Post</a>
                </Link>
            </MenuItem>
            <MenuItem className="admin-menu-item">
                <Link href="/admin/manage-post">
                    <a>Manage Post</a>
                </Link>
            </MenuItem>
            <MenuItem className="admin-menu-item">
                <Link href="/admin/upload-asset">
                    <a>Upload Asset</a>
                </Link>
            </MenuItem>
            <MenuItem className="admin-menu-item">
                <Link href="/admin/delete-asset">
                    <a>Delete Asset</a>
                </Link>
            </MenuItem>
            <MenuItem className="admin-menu-item">
                <Link href="/admin/all-comments">
                    <a>All Comments</a>
                </Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem className="admin-menu-item" onClick={logoutAdmin}>
                <span>Logout</span>
            </MenuItem>
        </Menu>
    );
};

export default AdminMenu;
