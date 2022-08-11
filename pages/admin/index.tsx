/* eslint-disable @next/next/no-img-element */
import { Fragment, useState, useEffect } from 'react';
import styles from '../../styles/AdminProfile.module.css';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { authGet } from '../../helper';

const AdminProfile = ({}) => {
    const router = useRouter();
    const [loaded, setLoaded] = useState<boolean>(false);
    const auth = useSelector(({ auth }: RootState) => auth);
    const [postsStats, setPostsStats] = useState<{
        no_of_posts: number;
        no_of_published_posts: number;
        no_of_pinned_posts: number;
    } | null>(null);

    useEffect(() => {
        setLoaded(true);
        (async () => {
            try {
                const res = await authGet(`/posts/stats`);
                setPostsStats(res?.data?.stats);
            } catch (err) {
                console.error('Post stats fetch error => ', err);
            }
        })();
    }, []);

    return (
        <Fragment>
            <NextSeo title="Your Admin Profile - Gideon Idoko" noindex={true} nofollow={true} />
            {loaded && (
                <main className={`padding-top-10rem`}>
                    <div className="container-max-1248px">
                        {!auth.isAuthenticated ? (
                            <Fragment>
                                {!auth.isAuthenticated && (
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
                        ) : (
                            <Fragment>
                                {/*ADMIN PROFILE PAGE*/}
                                <div className={styles.adminProfileWrap}>
                                    <div className={styles.profileHead}>
                                        <div>
                                            <div className={styles.profileAvatar}>
                                                <img src={auth.userGithubInfo?.avatar_url} alt="" />
                                            </div>
                                            <h1 className={styles.adminName}>{auth.userGithubInfo?.name}</h1>
                                            <p className={styles.adminBio}>{auth.userGithubInfo?.bio}</p>
                                            <ul className={styles.socialInfo}>
                                                <li>
                                                    <span>Joined:</span>{' '}
                                                    <span>
                                                        {moment(auth.userInfo?.user?.created_at).format('MMM DD, YYYY')}
                                                    </span>
                                                </li>
                                                <li>
                                                    <span>Email:</span>{' '}
                                                    <span>
                                                        <i className="neu-email"></i>
                                                        <span>{auth.userInfo?.user?.email}</span>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span>Social Media:</span>{' '}
                                                    <span>
                                                        <a
                                                            href={`https://twitter.com/${auth.userGithubInfo?.twitter_username}`}
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fab fa-twitter"></i>
                                                        </a>{' '}
                                                        &nbsp;&nbsp;&nbsp;
                                                        <a
                                                            href={auth.userGithubInfo?.html_url}
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fab fa-github"></i>
                                                        </a>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span>Location:</span> <span>{auth.userGithubInfo?.location}</span>
                                                </li>
                                            </ul>
                                            {postsStats ? (
                                                <ul className={styles.statInfo}>
                                                    <li>
                                                        <b>POST STATS</b>
                                                    </li>
                                                    <li>No of Posts: {postsStats?.no_of_posts}</li>
                                                    <li>No of Published Posts: {postsStats?.no_of_published_posts}</li>
                                                    <li>
                                                        No of Unpublished Posts:{' '}
                                                        {postsStats?.no_of_posts - postsStats?.no_of_published_posts}
                                                    </li>
                                                    <li>No of Pinned Posts: {postsStats?.no_of_pinned_posts}</li>
                                                </ul>
                                            ) : (
                                                <div>Loading posts stats...</div>
                                            )}
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
            )}
        </Fragment>
    );
};

export default AdminProfile;
