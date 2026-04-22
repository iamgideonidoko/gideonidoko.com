import type { FC } from 'react';
import styles from '../../styles/Blog.module.css';

const BlogTags: FC<{ tags: string[]; handleSearchTerm: (term: string) => void; searchTerm: string }> = ({
  tags,
  handleSearchTerm,
  searchTerm,
}) => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return (
    <details className={styles.blogTagsWrapper}>
      <summary>
        <span className={styles.blogTagsSummary}>Browse writing by tag</span>
      </summary>
      <div className={styles.blogTags}>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={styles.blogTagButton}
            aria-pressed={normalizedSearchTerm === tag.toLowerCase()}
            onClick={() => handleSearchTerm(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </details>
  );
};

export default BlogTags;
