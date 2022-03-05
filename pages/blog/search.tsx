import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import AllPostsRender from '../../components/blog/AllPostsRender';
import { config } from '../../config/keys';
import styles from '../../styles/Blog.module.css';
import { NextSeo } from 'next-seo';

const Search = (props) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchedPosts, setSearchedPosts] = useState([]);

    const allPosts = props.post.posts ? props.post.posts.filter((post) => post.is_published === true) : [];

    useEffect(() => {
        if (searchValue.length > 0) {
            setSearchedPosts(
                allPosts.filter(
                    (post) =>
                        post.title.toLowerCase().includes(searchValue) ||
                        post.body.toLowerCase().replace(/[*#`]/g, '').substr(0, 196).includes(searchValue),
                ),
            );
        } else {
            setSearchedPosts([]);
        }
    }, [searchValue]);

    const handleSearchInput = (e) => {
        setSearchValue(e.target.value.toLowerCase());
    };

    return (
        <Fragment>
            <NextSeo
                title={!props.post.isLoaded ? 'Loading...' : `Blog (Search Articles) - Gideon Idoko`}
                description="Search through my posts. I write about Software Development & web engineering topics and tools on my blog here."
                canonical="https://gideonidoko.com/blog"
                openGraph={{
                    url: 'https://gideonidoko.com/blog/search',
                    title: !props.post.isLoaded ? 'Loading...' : `Blog (Search Articles) - Gideon Idoko`,
                    description:
                        'Search through my posts. I write about Software Development & web engineering topics and tools on my blog here.',
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
                <title>{!props.post.isLoaded ? 'Loading...' : `Blog (Search Articles) - Gideon Idoko`}</title>
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
                        ) : (
                            <Fragment>
                                <h2 style={{ marginBottom: '2rem' }}>
                                    <i className="neu-browse"></i> Search all posts.
                                </h2>
                                <div className={styles.searchInputWrapper}>
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={handleSearchInput}
                                        placeholder="Search articles..."
                                    />
                                </div>
                                {searchValue.length > 0 && (
                                    <p className={styles.resultCount}>
                                        {searchedPosts.length <= 1 ? (
                                            <span>
                                                <b>{searchedPosts.length}</b> result found.
                                            </span>
                                        ) : (
                                            <span>
                                                <b>{searchedPosts.length}</b> results found.
                                            </span>
                                        )}
                                    </p>
                                )}

                                {searchValue.length > 0 && <AllPostsRender posts={searchedPosts} />}
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

export default connect(mapStateToProps, null)(Search);
