import styles from '../../styles/Blog.module.css';

const BlogTags = () => {
  return (
    <div className={styles.blogTagsWrapper}>
      <h5>Search blog by tags</h5>
      <div className={styles.blogTags}>
        <span>javascript</span>
        <span>typescript</span>
        <span>node</span>
      </div>
    </div>
  );
};

export default BlogTags;
