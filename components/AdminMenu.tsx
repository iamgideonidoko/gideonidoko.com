/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import swal from 'sweetalert';
import { Menu, MenuItem, MenuButton, MenuDivider } from '@szhsin/react-menu';
import { logout } from '../store/actions/authActions';
import '@szhsin/react-menu/dist/index.css';

const AdminMenu = (props) => {
    const logoutAdmin = () => {
        swal({
            title: 'Log out?',
            text: `Do you really want to log out?`,
            icon: 'warning',
            buttons: {
                cancel: 'No',
                confirm: {
                    text: 'Yes, Log out',
                    className: 'uploadConfirmBtn',
                },
            },
        }).then((willLogout) => {
            if (willLogout) {
                // props.logout();
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
                    className={
                        !props.isNavOpen && props.allowForMobile
                            ? 'admin-menu-initiator'
                            : 'admin-menu-initiator navOpen'
                    }
                >
                    <span>
                        <img src={'null'} alt="" />
                    </span>{' '}
                    <span>
                        <i className="neu-so-triangle"></i>
                    </span>
                </button>
            }
        >
            <MenuItem className="admin-menu-item" id="admin-menu-username">
                <span>@{'props.adminUsername'}</span>
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
