import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import moment from 'moment';
import swal from 'sweetalert';
import AllPostsRender from '../../../../components/blog/AllPostsRender';
import { config } from '../../../../config/keys';
import styles from '../../../../styles/Blog.module.css';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { authGet } from '../../../../helper';
import { PaginatedPosts } from '../../../../interfaces/post.interface';
import Custom404 from '../../../404';

const Tags = ({ posts }: { posts: PaginatedPosts }) => {
    const router = useRouter();
    const { tag } = router.query;

    return (
        <Fragment>
            {posts?.docs?.length === 0 ? (
                <Custom404 />
            ) : (
                <Fragment>
                    <NextSeo
                        title={`Blog (Tag: #${tag}) - Gideon Idoko`}
                        description={`Checkout posts with the tag: #${tag}. I write about Software Development & web engineering topics and tools on my blog here.`}
                        canonical={`https://gideonidoko.com/blog/tags/${tag}`}
                        openGraph={{
                            url: `https://gideonidoko.com/blog/tags/${tag}`,
                            title: `Blog (Tag: #${tag}) - Gideon Idoko`,
                            description: `Checkout posts with the tag: #${tag}. I write about Software Development & web engineering topics and tools on my blog here.`,
                            images: [
                                {
                                    url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
                                    width: 1500,
                                    height: 500,
                                    alt: "Gideon Idoko's card image",
                                },
                            ],
                            site_name: 'Blog - Gideon Idoko',
                        }}
                        twitter={{
                            handle: '@IamGideonIdoko',
                            site: '@IamGideonIdoko',
                            cardType: 'summary_large_image',
                        }}
                    />
                    <Head>
                        <title>{`Blog (Tag: #${tag}) - Gideon Idoko`}</title>
                    </Head>
                    <main className={`padding-top-10rem ${styles.blogMain}`}>
                        <div className="container-max-1248px">
                            <Fragment>
                                <h2 style={{ marginBottom: '4rem' }}>
                                    #{tag} &nbsp;{' '}
                                    <small>
                                        (
                                        {posts?.totalDocs <= 1
                                            ? `${posts?.totalDocs} post`
                                            : `${posts?.totalDocs} posts`}
                                        )
                                    </small>{' '}
                                </h2>

                                <AllPostsRender posts={posts?.docs} />

                                <div className={styles.paginationWrapper}>
                                    <div className={styles.pagination}>
                                        <span>
                                            {posts?.hasPrevPage && (
                                                <Link
                                                    href={`/blog${tag}${
                                                        Number(posts?.page) === 2
                                                            ? ''
                                                            : `/page/${Number(posts?.page) - 1}`
                                                    }`}
                                                >
                                                    <a>← Previous Page</a>
                                                </Link>
                                            )}
                                        </span>
                                        <span>
                                            {posts?.hasNextPage && (
                                                <Link href={`/blog/${tag}/page/${Number(posts?.page) + 1}`}>
                                                    <a>Next Page →</a>
                                                </Link>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Fragment>
                        </div>
                    </main>
                </Fragment>
            )}
        </Fragment>
    );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
    const tag = context.params?.tag;

    // Fetch data from external API
    try {
        const res = await authGet(`/posts/${tag}`);
        console.log('response => ', res);
        return { props: { posts: res?.data?.posts } };
    } catch (err) {
        console.log('Fetch Error => ', err);
        return { props: { posts: { docs: [] } } };
    }
};

export default Tags;
