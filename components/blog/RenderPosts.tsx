/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import { IPost } from '../../interfaces/post.interface';
// import Image from 'next/image';

const blogCoverDefault = '/assets/img/BlogCoverDefault.jpg';

const RenderPosts = ({ posts }: { posts: Array<IPost> }) => {
  if (posts.length === 0) {
    return <b>No Posts.</b>;
  } else {
    return (
      <div className={styles.blogPostsList}>
        {posts.map((post, idx) => (
          <Link className={styles.blogBoxAnchor} href={`/blog/${post.slug}`} key={idx}>
            <article className={styles.blogBox}>
              <div className={styles.blogBoxLeft}>
                <img
                  src={post.cover || blogCoverDefault}
                  className={`${styles.postCover}`}
                  title={post.title}
                  alt={`${post.title ?? 'Post'} cover image`}
                  loading="lazy"
                  width={383}
                  height={484}
                />
              </div>
              <div className={styles.blogBoxRight}>
                <div className={styles.bbrSmallMetaOne}>
                  <span>{post.date}</span>
                  {post?.readTime && (
                    <>
                      &nbsp;&nbsp;—&nbsp;&nbsp;
                      <span>{post.readTime}</span>
                    </>
                  )}
                </div>
                <h3>{post.title}</h3>
              </div>
            </article>
          </Link>
        ))}
      </div>
    );
  }
};

export default RenderPosts;
