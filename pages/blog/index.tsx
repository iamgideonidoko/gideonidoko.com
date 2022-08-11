import { Fragment } from 'react';
import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import AllPostsRender from '../../components/blog/AllPostsRender';
import { NextSeo } from 'next-seo';
import { PaginatedPosts } from '../../interfaces/post.interface';
import { GetServerSideProps } from 'next';
import { authGet } from '../../helper';

const BlogHome = ({ posts }: { posts: PaginatedPosts }) => {
    return (
        <Fragment>
            <NextSeo
                title="Blog - Gideon Idoko"
                description="Gideon Idoko writes about software engineering topics, tips, tricks, and tools on this blog."
                canonical="https://gideonidoko.com/blog"
                openGraph={{
                    url: 'https://gideonidoko.com/blog',
                    title: 'Blog - Gideon Idoko',
                    description:
                        'Gideon Idoko writes about software engineering topics, tips, tricks, and tools on this blog.',
                    images: [
                        {
                            url: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
                            width: 1500,
                            height: 500,
                            alt: "Gideon Idoko's card image",
                        },
                    ],
                    site_name: 'Gideon Idoko',
                }}
                twitter={{
                    handle: '@IamGideonIdoko',
                    site: '@IamGideonIdoko',
                    cardType: 'summary_large_image',
                }}
            />
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
        return { props: { posts: { docs: [] } } };
    }
};

export default BlogHome;
