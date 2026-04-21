import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import { IPost } from '../../interfaces/post.interface';

const RenderPosts = ({ posts }: { posts: Array<IPost> }) => {
  if (posts.length === 0) {
    return <b>No writing yet.</b>;
  } else {
    return (
      <div className={styles.blogPostsList}>
        {posts.map((post, idx) => (
          <Link className={styles.blogBoxAnchor} href={`/writing/${post.slug}`} key={idx}>
            <article className={styles.blogBox}>
              <div className={styles.blogBoxMeta}>
                <div className={styles.bbrSmallMetaOne}>
                  <span>{post.date}</span>
                  {post?.readTime && (
                    <>
                      &nbsp;&nbsp;—&nbsp;&nbsp;
                      <span>{post.readTime}</span>
                    </>
                  )}
                </div>
                {post.tags?.length ? (
                  <div className={styles.blogBoxTags}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={styles.blogBoxRight}>
                <h3>{post.title}</h3>
                {post.description ? <p>{post.description}</p> : null}
              </div>
              <div className={styles.blogBoxFooter}>
                <span className={styles.blogBoxReadMore}>Read piece</span>
                <i className="neu-arrow"></i>
              </div>
            </article>
          </Link>
        ))}
      </div>
    );
  }
};

export default RenderPosts;
