import { Fragment, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import AllPostsRender from '../../components/blog/AllPostsRender';
import { config } from '../../config/keys';
import styles from '../../styles/Blog.module.css';
import { NextSeo } from 'next-seo';
import { authGet } from '../../helper';
import { Post } from '../../interfaces/post.interface';

let postFetchTimer: ReturnType<typeof setTimeout>;

const getPosts = (inputValue: string): Promise<Post[]> => {
    return new Promise<Post[]>(async (resolve) => {
        if (inputValue.length < 2) return;
        clearTimeout(postFetchTimer);
        postFetchTimer = setTimeout(async () => {
            try {
                const res = await authGet(`/posts/search?q=${inputValue}`);
                resolve(res?.data?.posts);
            } catch (err) {
                console.error('Post Search Error => ', err);
                resolve([]);
            }
        }, 3000);
    });
};

const Search = ({}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchedPosts, setSearchedPosts] = useState<Array<Post>>([]);
    const [load, setLoad] = useState<{ loading: boolean; loaded: boolean }>({ loading: false, loaded: false });

    const handleSearchInput: React.ChangeEventHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value.toLowerCase());
    };

    useEffect(() => {
        (async () => {
            if (searchValue.length < 2) return load.loading && setLoad({ loading: false, loaded: false });
            try {
                !load.loading && setLoad({ loading: true, loaded: false });
                const res = await getPosts(searchValue);
                setLoad({ loading: false, loaded: true });
                setSearchedPosts(res);
            } catch (err) {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue]);

    return (
        <Fragment>
            <NextSeo
                title={`Blog (Search Articles) - Gideon Idoko`}
                description="Search through my posts. I write about Software Development & web engineering topics and tools on my blog here."
                canonical="https://gideonidoko.com/blog"
                openGraph={{
                    url: 'https://gideonidoko.com/blog/search',
                    title: `Blog (Search Articles) - Gideon Idoko`,
                    description:
                        'Search through my posts. I write about Software Development & web engineering topics and tools on my blog here.',
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
                <title>Blog (Search Articles) - Gideon Idoko</title>
            </Head>
            <main className={`padding-top-10rem ${styles.blogMain}`}>
                <div className="container-max-1248px">
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
                                {load.loading && <div>Loading...</div>}
                                {load.loaded &&
                                    (searchedPosts.length < 1 ? (
                                        <span>
                                            <b>No</b> result found.
                                        </span>
                                    ) : (
                                        <span>
                                            <b>Results</b> found.
                                        </span>
                                    ))}
                            </p>
                        )}

                        {searchedPosts.length > 0 && <AllPostsRender posts={searchedPosts} />}
                    </Fragment>
                </div>
            </main>
        </Fragment>
    );
};

export default Search;
