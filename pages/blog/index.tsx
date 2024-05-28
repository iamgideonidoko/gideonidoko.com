import { type FC, useMemo, useState, useEffect, useCallback } from 'react';
import styles from '../../styles/Blog.module.css';
import { serialize } from 'next-mdx-remote/serialize';
import type { InferGetStaticPropsType } from 'next';
import { getReadTime } from '../../helper';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'path';
import RenderPosts from '../../components/blog/RenderPosts';
import FeaturedPost from '../../components/blog/FeaturedPost';
import BlogTags from '../../components/blog/BlogTags';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import BlogIntro from '../../components/blog/BlogIntro';
import Fuse from 'fuse.js';

dayjs.extend(advancedFormat);

export const getStaticProps = async () => {
  const blogPath = join(process.cwd(), 'blog');
  const files = await readdir(blogPath);
  const mdFiles = files.filter((file) => /\.md(x|)$/gi.test(file));
  const posts = await Promise.all(
    mdFiles.map(async (filename) => {
      const blog = await readFile(join(blogPath, filename), 'utf-8');
      const { frontmatter } = await serialize<
        unknown,
        Partial<Record<'title' | 'cover' | 'description' | 'date', string> & { tags: string[] }>
      >(blog, { parseFrontmatter: true });
      return {
        frontmatter,
        slug: filename.split('.')[0],
        readTime: getReadTime(blog),
      };
    }),
  );
  const sortedPosts = [...posts]
    // Formatter date ought to be in the format: YYYY-MM-DD
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date ?? new Date()).getTime() - new Date(a.frontmatter.date ?? new Date()).getTime(),
    )
    .map((post) => {
      const { frontmatter, slug, readTime } = post;
      const { title, cover, date, tags } = frontmatter;
      return {
        title,
        cover,
        slug,
        date: date && dayjs(date).format('MMMM Do, YYYY'),
        readTime,
        tags,
      };
    });
  const dummyPosts: typeof sortedPosts = new Array(12).fill(sortedPosts[0]);
  // return { props: { posts: sortedPosts } };
  return { props: { posts: dummyPosts } };
};

const Posts: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ posts }) => {
  const postsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState(posts);
  const [searchTerm, setSearchTerm] = useState(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') ?? '' : '',
  );
  const featuredPost = useMemo(() => posts[Math.floor(Math.random() * posts.length)], [posts]);
  const paginatedCurrentPosts = useMemo(
    () => currentPosts.slice(0, postsPerPage * currentPage),
    [currentPage, currentPosts],
  );
  const tags = useMemo(
    () => Array.from(new Set(posts.reduce<string[]>((acc, curr) => [...acc, ...(curr.tags ?? [])], []))),
    [posts],
  );

  useEffect(() => {
    (() => {
      /* Handle post search */
      if (searchTerm) {
        setCurrentPage(1);
        setCurrentPosts(
          new Fuse(posts, { keys: ['title', 'tags'] })
            .search(searchTerm.trim())
            .map((searchedPost) => searchedPost.item),
        );
      } else {
        setCurrentPage(1);
        setCurrentPosts(posts);
      }
    })();
  }, [posts, searchTerm]);

  const handleSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const trimmedTerm = term.trim();
    urlParams.set('q', trimmedTerm);
    window.history.replaceState({}, '', `${window.location.pathname}${trimmedTerm ? `?${urlParams}` : ''}`);
  }, []);

  const hasNextPage = currentPosts.length / postsPerPage > currentPage;

  return (
    <>
      <main className={`padding-top-10rem ${styles.blogMain}`}>
        <div className="container-max-1248px">
          <BlogIntro postCount={currentPosts.length} handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} />
          <BlogTags tags={tags} handleSearchTerm={handleSearchTerm} />
          <FeaturedPost post={featuredPost} />
          <RenderPosts posts={paginatedCurrentPosts} />
          {hasNextPage && (
            <div className={styles.loadMore}>
              <button
                className={`animated-button animated-button--pallene__outline`}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Load more articles <i className="neu-add-lg"></i>
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Posts;
