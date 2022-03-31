/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import Link from 'next/link';
// import { getReadTime } from '../../helper';
import Bounce from 'react-reveal/Bounce';
import Fade from 'react-reveal/Fade';
import Wobble from 'react-reveal/Wobble';
import styles from '../../styles/Home.module.css';
import { Post } from '../../interfaces/post.interface';
import { useState, useEffect } from 'react';
import { authGet } from '../../helper';

const SectionFive = ({}) => {
    const [posts, setPosts] = useState<Array<Post>>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await authGet(`/posts?per_page=3`);
                setPosts(res?.data?.posts?.docs || []);
            } catch (err) {
                console.error('Err => ', err);
            }
        })();
    }, []);

    return (
        <div className={styles.sectionFive}>
            <div className="container-max-1248px">
                <div className={styles.sectionFiveWrapper}>
                    <Bounce left duration={1800}>
                        <h3 className={styles.servicesHead}>Articles -</h3>
                    </Bounce>
                    <Bounce left duration={1800}>
                        <p>
                            I also write <b>blog articles</b>.
                        </p>
                    </Bounce>

                    <div className={styles.s5PostWrapper}>
                        {posts.map((post) => (
                            <article key={post._id}>
                                <Fade bottom duration={1800}>
                                    <div>
                                        <Link href={`/blog/${post.slug}`}>
                                            <a className={styles.s5PostHref}>
                                                <div className={styles.s5PostFlex}>
                                                    <div className={styles.s5PostImg}>
                                                        <img src={post.cover_img} alt={`${post.title} cover image`} />
                                                    </div>
                                                    <div className={styles.s5PostInfo}>
                                                        <h3>{post.title}</h3>
                                                        <div>
                                                            <span>
                                                                <small>
                                                                    {moment(post.created_at).format('MMM DD, YYYY')}
                                                                </small>
                                                            </span>
                                                            {post?.read_time && (
                                                                <>
                                                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                                                    <span>
                                                                        <small>{post?.read_time}</small>
                                                                    </span>
                                                                </>
                                                            )}
                                                            &nbsp;&nbsp;|&nbsp;&nbsp;{' '}
                                                            <span>
                                                                <small>{post.author_name}</small>
                                                            </span>
                                                        </div>
                                                        <p className={styles.postShortExcerpt}>
                                                            {post?.description?.substr(0, 196)}
                                                            ...
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                </Fade>
                            </article>
                        ))}
                    </div>

                    <div>
                        <Wobble duration={2000}>
                            <p className={styles.aboutSeeMore}>
                                <span>
                                    <Link href="/blog">
                                        <a>Check out my blog.</a>
                                    </Link>
                                </span>{' '}
                                <span></span>
                            </p>
                        </Wobble>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionFive;
