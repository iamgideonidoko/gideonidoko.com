import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AllPostsRender from '../../../../components/blog/AllPostsRender';
import styles from '../../../../styles/Blog.module.css';
import { NextSeo } from 'next-seo';
import Custom404 from '../../../404';
import { PaginatedPosts } from '../../../../interfaces/post.interface';
import { GetServerSideProps } from 'next';
import { authGet } from '../../../../helper';

const Page = ({ posts }: { posts: PaginatedPosts }) => {
    const router = useRouter();
    const { pageno } = router.query;
    const currentPageNumber = Number(pageno);

    return (
        <Fragment>
            {posts?.docs.length === 0 ? (
                <Custom404 />
            ) : (
                <Fragment>
                    <NextSeo
                        title={`Blog (Page ${currentPageNumber}) - Gideon Idoko`}
                        description={`Check out posts on page ${currentPageNumber} of this blog where Gideon Idoko writes about software engineering topics, tips, tricks, and tools.`}
                        canonical={`https://gideonidoko.com/blog/page/${currentPageNumber}`}
                        openGraph={{
                            url: `https://gideonidoko.com/blog/page/${currentPageNumber}`,
                            title: `Blog (Page ${currentPageNumber}) - Gideon Idoko`,
                            description: `Check out posts on page ${currentPageNumber} of this blog where Gideon Idoko writes about software engineering topics, tips, tricks, and tools.`,
                            images: [
                                {
                                    url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
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
                            <Fragment>
                                <div className={styles.searchLinkWrapper}>
                                    <Link href="/blog/search">
                                        <a>
                                            <i className="neu-browse"></i> Search articles
                                        </a>
                                    </Link>
                                </div>

                                <AllPostsRender posts={posts?.docs} />

                                <div className={styles.paginationWrapper}>
                                    <div className={styles.pagination}>
                                        <span>
                                            {posts?.hasPrevPage && (
                                                <Link
                                                    href={`/blog${
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
                                                <Link href={`/blog/page/${Number(posts?.page) + 1}`}>
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
    const pageno = context.params?.pageno;

    // check is the value of pageno is a wrong input
    if (!Number.isInteger(Number(pageno)) || Number(pageno) < 1) return { props: { posts: { docs: [] } } };

    // Fetch data from external API
    try {
        const res = await authGet(`/posts?page=${pageno}`);
        if (res?.data?.posts?.docs?.length === 0) return { notFound: true };
        return { props: { posts: res?.data?.posts } };
    } catch (err) {
        // return { props: { posts: { docs: [] } } };
        return { notFound: true };
    }
};

export default Page;
