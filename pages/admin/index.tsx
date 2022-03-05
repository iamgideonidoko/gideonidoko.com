import Head from 'next/head';
import { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../store/actions/postActions';
import styles from '../../styles/AdminProfile.module.css';
import { config } from '../../config/keys';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import moment from 'moment';

//get router
import { useRouter } from 'next/router';

const AdminProfile = (props) => {
    const router = useRouter();

    return (
        <Fragment>
            <NextSeo noindex={true} nofollow={true} />
            <Head>
                <title>Your Admin Profile - Gideon Idoko</title>
            </Head>
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    {!props.isAuthenticated ? (
                        <Fragment>
                            {!props.isAdminUserLoaded ? (
                                <div>
                                    <div className="complex-loader-wrap">
                                        <div className="complex-loader"></div>
                                    </div>
                                </div>
                            ) : (
                                <Fragment>
                                    {!props.isAuthenticated && (
                                        <div className={`loginRedirectMsg`}>
                                            <h1>You are not logged in.</h1>
                                            <p>Redirecting to login page...</p>
                                            {typeof window !== 'undefined' &&
                                                window.setTimeout(() => {
                                                    router.push('/login');
                                                }, 3000)}
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {/*ADMIN PROFILE PAGE*/}
                            <div className={styles.adminProfileWrap}>
                                <div className={styles.profileHead}>
                                    <div className={styles.profileAvatar}>
                                        <img src={props.githubUser.avatar_url} alt="" />
                                    </div>
                                    <h1 className={styles.adminName}>{props.adminuser.name}</h1>
                                    <p className={styles.adminBio}>{props.githubUser.bio}</p>
                                    <ul className={styles.socialInfo}>
                                        <li>
                                            <span>Joined:</span>{' '}
                                            <span>{moment(props.adminuser.created_at).format('MMM DD, YYYY')}</span>
                                        </li>
                                        <li>
                                            <span>Email:</span>{' '}
                                            <span>
                                                <i className="neu-email"></i> {props.adminuser.email}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Social Media:</span>{' '}
                                            <span>
                                                <a
                                                    href={`https://twitter.com/${props.githubUser.twitter_username}`}
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-twitter"></i>
                                                </a>{' '}
                                                &nbsp;&nbsp;&nbsp;
                                                <a href={props.githubUser.html_url} rel="noopener noreferrer">
                                                    <i className="fab fa-github"></i>
                                                </a>
                                            </span>
                                        </li>
                                        <li>
                                            <span>Location:</span> <span>{props.githubUser.location}</span>
                                        </li>
                                    </ul>
                                    <div className={styles.statInfo}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <span>
                                                            Posts:{' '}
                                                            {
                                                                props.post.posts.filter(
                                                                    (post) =>
                                                                        post.author_username ===
                                                                        props.adminuser.username,
                                                                ).length
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            Published Posts:{' '}
                                                            {
                                                                props.post.posts.filter(
                                                                    (post) =>
                                                                        post.author_username ===
                                                                            props.adminuser.username &&
                                                                        post.is_published === true,
                                                                ).length
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span>
                                                            Pinned Posts:{' '}
                                                            {
                                                                props.post.posts.filter(
                                                                    (post) =>
                                                                        post.author_username ===
                                                                            props.adminuser.username &&
                                                                        post.is_pinned === true,
                                                                ).length
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={styles.profileBody}>
                                        <div className={styles.actionLinks}>
                                            <ul>
                                                <li>
                                                    <Link href="/admin/create-post">
                                                        <a>Create Post</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/manage-post">
                                                        <a>Manage Post</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/upload-asset">
                                                        <a>Upload Asset</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/delete-asset">
                                                        <a>Delete Asset</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/contacts">
                                                        <a>Your Contacts</a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/admin/all-comments">
                                                        <a>All Comments</a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            </main>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    post: state.post,
    isAuthenticated: state.auth.isAuthenticated,
    isAdminUserLoaded: state.auth.isAdminUserLoaded,
    adminuser: state.auth.adminuser,
    isLoading: state.auth.isLoading,
    githubUser: state.user.githubUser,
});

export default connect(mapStateToProps, { getPosts })(AdminProfile);
