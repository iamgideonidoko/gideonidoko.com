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
        <h5>Browse writing by tag</h5>
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
