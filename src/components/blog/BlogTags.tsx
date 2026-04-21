import type { FC } from 'react';
import styles from '../../styles/Blog.module.css';

const BlogTags: FC<{ tags: string[]; handleSearchTerm: (term: string) => void }> = ({ tags, handleSearchTerm }) => {
  return (
    <div className={styles.blogTagsWrapper}>
      <h5>Search blog by tags</h5>
      <div className={styles.blogTags}>
        {tags.map((tag, idx) => (
          <span key={idx} onClick={() => handleSearchTerm(tag)}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogTags;
