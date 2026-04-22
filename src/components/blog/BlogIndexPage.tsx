'use client';

import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import type { IPost } from '../../interfaces/post.interface';
import styles from '../../styles/Blog.module.css';
import BlogIntro from './BlogIntro';
import BlogTags from './BlogTags';
import RenderPosts from './RenderPosts';

const POSTS_PER_PAGE = 5;

const BlogIndexPage: FC<{ posts: IPost[] }> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState(() =>
    typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get('q') ?? ''),
  );

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    return new Fuse(posts, { keys: ['title', 'tags'], threshold: 0.3 })
      .search(searchTerm.trim())
      .map((searchedPost) => searchedPost.item);
  }, [posts, searchTerm]);

  const paginatedCurrentPosts = useMemo(
    () => filteredPosts.slice(0, POSTS_PER_PAGE * currentPage),
    [currentPage, filteredPosts],
  );

  const tags = useMemo(
    () => Array.from(new Set(posts.reduce<string[]>((acc, curr) => [...acc, ...(curr.tags ?? [])], []))),
    [posts],
  );

  const handleSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);
    const trimmedTerm = term.trim();

    if (trimmedTerm) {
      params.set('q', trimmedTerm);
    } else {
      params.delete('q');
    }

    const query = params.toString();
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  }, []);

  const hasNextPage = filteredPosts.length / POSTS_PER_PAGE > currentPage;

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setCurrentPage((prev) => prev + 1);
      },
      {
        rootMargin: '320px 0px',
      },
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, currentPage]);

  return (
    <main className={`padding-top-10rem ${styles.blogMain}`}>
      <div className="container-max-1248px">
        <BlogIntro postCount={filteredPosts.length} handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} />
        <BlogTags tags={tags} handleSearchTerm={handleSearchTerm} searchTerm={searchTerm} />
        <RenderPosts posts={paginatedCurrentPosts} />
        {hasNextPage && (
          <div ref={loadMoreRef} className={styles.loadMore} role="status" aria-live="polite">
            <span>Loading more writing...</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogIndexPage;
