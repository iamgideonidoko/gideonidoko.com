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

const Tags = (props) => {
    const router = useRouter();
    const { tag } = router.query;

    const allPosts = props.post.posts ? props.post.posts.filter((post) => post.is_published === true) : [];

    const allPostsWithTag = allPosts.filter((post) => post.tags.includes(tag) === true);

    return (
        <Fragment>
            <NextSeo
                title={
                    !props.post.isLoaded
                        ? 'Loading...'
                        : allPostsWithTag.length === 0
                        ? '404 Error'
                        : `Blog (Tag: #${tag}) - Gideon Idoko`
                }
                description={
                    allPostsWithTag.length !== 0
                        ? `Checkout posts with the tag: #${tag}. I write about Software Development & web engineering topics and tools on my blog here.`
                        : ''
                }
                canonical={`https://gideonidoko.com/blog/tags/${tag}`}
                openGraph={{
                    url: `https://gideonidoko.com/blog/tags/${tag}`,
                    title: !props.post.isLoaded
                        ? 'Loading...'
                        : allPostsWithTag.length === 0
                        ? '404 Error'
                        : `Blog (Tag: #${tag}) - Gideon Idoko`,
                    description:
                        allPostsWithTag.length !== 0
                            ? `Checkout posts with the tag: #${tag}. I write about Software Development & web engineering topics and tools on my blog here.`
                            : '',
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
                <title>
                    {!props.post.isLoaded
                        ? 'Loading...'
                        : allPostsWithTag.length === 0
                        ? '404 Error'
                        : `Blog (Tag: #${tag}) - Gideon Idoko`}
                </title>
            </Head>
            <main className={`padding-top-10rem ${styles.blogMain}`}>
                <div className="container-max-1248px">
                    {
                        //check if posts has been fetched and display
                        !props.post.isLoaded ? (
                            <div>
                                <div className="complex-loader-wrap">
                                    <div className="complex-loader"></div>
                                </div>
                            </div>
                        ) : allPostsWithTag.length === 0 ? (
                            <Fragment>PAGE DOES NOT EXIST</Fragment>
                        ) : (
                            <Fragment>
                                <h2 style={{ marginBottom: '4rem' }}>
                                    #{tag} &nbsp;{' '}
                                    <small>
                                        (
                                        {allPostsWithTag.length <= 1
                                            ? `${allPostsWithTag.length} post`
                                            : `${allPostsWithTag.length} posts`}
                                        )
                                    </small>{' '}
                                </h2>

                                <AllPostsRender posts={allPostsWithTag} />
                            </Fragment>
                        )
                    }
                </div>
            </main>
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    post: state.post,
    isAuthenticated: state.auth.isAuthenticated,
    adminuser: state.auth.adminuser,
});

export default connect(mapStateToProps, null)(Tags);
