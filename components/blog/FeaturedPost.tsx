import type { FC } from 'react';
import styles from '../../styles/Blog.module.css';
import { IPost } from '../../interfaces/post.interface';
import Image from 'next/image';
import Link from 'next/link';

const blogCoverDefault = '/assets/img/BlogCoverDefault.jpg';

const FeaturedPost: FC<{ post: IPost }> = ({ post }) => {
  return (
    <Link className={styles.featPostAnchor} href={`/blog/${post.slug}`}>
      <div className={styles.featPost}>
        <div className={styles.featPostLeft}>
          <div>
            <h4>Featured article</h4>
            <h1>{post.title}</h1>
            <div className={styles.featPostExtra}>
              <span>{post.date}</span>
              {post.readTime && (
                <>
                  &nbsp;&nbsp;—&nbsp;&nbsp;
                  <span>{post.readTime}</span>
                </>
              )}
            </div>
          </div>
          <div>
            <div className={styles.featPostReadMore}>
              <span>Read this</span>
              <div>
                <i className={`neu-arrow ${styles.featPostArrow}`}></i>
                <svg height="56" width="56">
                  <circle className={styles.featPostCircle} cx="28" cy="28" r="22" stroke-width="3" fill-opacity="0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.featPostRight}>
          <Image
            src={post.cover || blogCoverDefault}
            className={styles.featPostCover}
            title={post.title}
            alt={`${post.title ?? 'Featured Post'} cover image`}
            loading="lazy"
            width={383}
            height={484}
          />
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPost;
