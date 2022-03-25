/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import moment from 'moment';
import styles from '../../styles/Blog.module.css';
import { Post } from '../../interfaces/post.interface';

const AllPostsRender = ({ posts }: { posts: Array<Post> }) => {
    const blogCoverDefault = '/assets/img/BlogCoverDefault.jpg';

    /* const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
        if (typeof window !== 'undefined') {
            e.currentTarget.src = blogCoverDefault;
            const skel = window.document.querySelector(`.skeleton-loader-${id}`);
            if (skel) {
                (skel as HTMLElement).style.display = 'none';
            }
            e.currentTarget.classList.remove('d-none');
        }
    };

    const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
        if (typeof window !== 'undefined') {
            const skel = window.document.querySelector(`.skeleton-loader-${id}`);
            if (skel) {
                (skel as HTMLElement).style.display = 'none';
            }
            e.currentTarget.classList.remove('d-none');
        }
    }; */

    if (posts.length === 0) {
        return <b>No Posts.</b>;
    } else {
        return (
            <div className={styles.blogPostsList}>
                {posts.map((post) => (
                    <article className={styles.blogBox} key={post._id}>
                        <div className={styles.blogBoxLeft}>
                            <div className={styles.postCoverWrap}>
                                <Link href={`/blog/${post.slug}`}>
                                    <a>
                                        <img
                                            src={post.cover_img || blogCoverDefault}
                                            className={`${styles.postCover}`}
                                            alt={`${post.title} cover image`}
                                            /* id={post._id}
                                            onLoad={(e) => handleImgLoad(e, post._id)}
                                            onError={(e) => handleImgError(e, post._id)} */
                                        />
                                        <div className={styles.hoverEffect}></div>
                                        {/* <div className={`skeleton-loader skeleton-loader-${post._id}`}></div> */}
                                    </a>
                                </Link>
                            </div>
                        </div>
                        <div className={styles.blogBoxRight}>
                            <h3>
                                <Link href={`/blog/${post.slug}`}>
                                    <a>{post.title}</a>
                                </Link>
                            </h3>
                            <div className={styles.bbrSmallMetaOne}>
                                <span>
                                    <small>{moment(post.created_at).format('MMM DD, YYYY')}</small>
                                </span>
                                {post?.read_time && (
                                    <>
                                        &nbsp;&nbsp;|&nbsp;&nbsp;
                                        <span>
                                            <small>{post?.read_time}</small>
                                        </span>
                                    </>
                                )}
                                &nbsp;&nbsp;|&nbsp;&nbsp;
                                <span>
                                    <small>{post.author_name}</small>
                                </span>
                            </div>
                            <p>{post.description.substr(0, 196)}...</p>
                        </div>
                    </article>
                ))}
            </div>
        );
    }
};

export default AllPostsRender;
