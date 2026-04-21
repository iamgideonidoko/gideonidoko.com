import type { Metadata } from 'next';
import BlogIndexPage from '../../components/blog/BlogIndexPage';
import { getAllPosts } from '../../lib/blog';
import { createPageMetadata } from '../../lib/site';

export const metadata: Metadata = createPageMetadata({
  title: 'Writing - Gideon Idoko',
  description: 'Essays, notes, and technical writing on software engineering, tools, and the web.',
  path: '/writing',
});

export default async function WritingPage() {
  const posts = await getAllPosts();

  return <BlogIndexPage posts={posts} />;
}
