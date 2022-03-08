import Head from 'next/head';
import { Fragment } from 'react';
import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import { config } from '../../config/keys';

import AllPostsRender from '../../components/blog/AllPostsRender';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { PaginatedPosts } from '../../interfaces/post.interface';
import { GetServerSideProps } from 'next';
import { authGet } from '../../helper';

const BlogHome = ({ posts }: { posts: PaginatedPosts }) => {
    console.log('Posts => ', posts);

    return (
        <Fragment>
            <NextSeo
                title="Blog - Gideon Idoko"
                description="I write about Software Development & web engineering topics and tools on my blog here."
                canonical="https://gideonidoko.com/blog"
                openGraph={{
                    url: 'https://gideonidoko.com/blog',
                    title: 'Blog - Gideon Idoko',
                    description:
                        'I write about Software Development & web engineering topics and tools on my blog here.',
                    images: [
                        {
                            url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
                            width: 1004,
                            height: 591,
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
                <title>Blog - Gideon Idoko</title>
                <meta
                    name="keywords"
                    content="blog,writing,posts,gideon idoko,software developer,technical writer,software engineer,developer,engineer,writer"
                ></meta>
            </Head>
            <main className={`padding-top-10rem ${styles.blogMain}`}>
                <div className="container-max-1248px">
                    {
                        <Fragment>
                            <div className={styles.searchLinkWrapper}>
                                <Link href="/blog/search">
                                    <a>
                                        <i className="neu-browse"></i> Search articles
                                    </a>
                                </Link>
                            </div>

                            {/* PINNED POSTS
                             {props.post.posts.filter((post) => post.is_pinned).length !== 0 ? (
                                <div className={styles.pinnedPostWrapper}>
                                    <h3>
                                        <i className="neu-pin"></i> Pinned Posts.
                                    </h3>
                                    <AllPostsRender posts={props.post.posts.filter((post) => post.is_pinned)} />
                                </div>
                            ) : null} */}
                            <AllPostsRender posts={posts?.docs} />

                            {posts?.hasNextPage && (
                                <div className={styles.paginationWrapper}>
                                    <div className={`${styles.pagination} ${styles.pgnFlexEnd}`}>
                                        <span>
                                            <Link href={`/blog/page/${Number(posts?.page) + 1}`}>
                                                <a>Next Page →</a>
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    }
                </div>
            </main>
        </Fragment>
    );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
    // Fetch data from external API
    try {
        const res = await authGet(`/posts`);
        return { props: { posts: res?.data?.posts } };
    } catch (err) {
        console.log('Fetch Error => ', err);
        return { props: { posts: { docs: [] } } };
    }
};

export default BlogHome;
