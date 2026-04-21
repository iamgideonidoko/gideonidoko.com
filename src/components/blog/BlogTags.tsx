import type { FC } from 'react';
import styles from '../../styles/Blog.module.css';

const BlogTags: FC<{ tags: string[]; handleSearchTerm: (term: string) => void }> = ({ tags, handleSearchTerm }) => {
  return (
    <details className={styles.blogTagsWrapper}>
      <summary>
        <h5>Browse writing by tag</h5>
      </summary>
      <div className={styles.blogTags}>
        {tags.map((tag, idx) => (
          <span key={idx} onClick={() => handleSearchTerm(tag)}>
            {tag}
          </span>
        ))}
      </div>
    </details>
  );
};

export default BlogTags;
