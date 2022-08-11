/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from 'react';
import Link from 'next/link';
import styles from '../styles/Custom404.module.css';
import { NextSeo } from 'next-seo';
// import Image from 'next/image';

const Custom404 = () => {
    return (
        <Fragment>
            <NextSeo title="Page Not Found 😔" noindex={true} nofollow={true} />
            {/* <Head>
                <title>Page Not Found : ( </title>
            </Head> */}
            <main className={`padding-top-10rem ${styles.custom404Main}`}>
                <div className="container-max-1248px">
                    <div className={styles.custom404Container}>
                        <div className={styles.custom404ContainerChild}>
                            <div className={styles.custom404ImageWrap}>
                                <img src="/assets/img/404.svg" alt="404" style={{ maxWidth: '100%' }} width={300} />
                            </div>
                            {/* <h1>Page Not Found😢</h1> */}
                            <p>
                                <small>Well, this is awkward, the page you were trying to view does not exist.</small>
                            </p>
                            <div className={styles.custom404ExitLinks}>
                                <span>
                                    <Link href="/">
                                        <a>Go Home</a>
                                    </Link>
                                </span>
                                <span>
                                    <Link href="/blog">
                                        <a>Go to Blog</a>
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default Custom404;
