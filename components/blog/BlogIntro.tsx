import type { FC } from 'react';
import styles from '../../styles/Blog.module.css';
import Image from 'next/image';

const BlogIntro: FC<{ postCount: number; handleSearchTerm: (term: string) => void; searchTerm: string }> = ({
  postCount,
  handleSearchTerm,
  searchTerm,
}) => {
  return (
    <div className={styles.blogIntro}>
      <div className={styles.blogIntro1}>
        <div className={styles.blogIntro1Child}>
          <h2 className={styles.blogIntroMainText}>WRITING</h2>
          <div className={styles.blogIntroSearch} data-post-count={postCount}>
            <input
              type="text"
              placeholder="Search posts"
              value={searchTerm}
              onChange={(e) => handleSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Image src="/assets/img/GI-Avatar.JPEG" className={styles.blogIntroCover} alt="" width={300} height={300} />
      </div>
      <div className={styles.blogIntro2}>
        <p className={styles.blogIntroAbout}>
          Another part of the internet where I share stuff I think I (don&apos;t) know...
        </p>
      </div>
    </div>
  );
};

export default BlogIntro;
