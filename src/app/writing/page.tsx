import type { Metadata } from 'next';
import BlogIndexPage from '../../components/blog/BlogIndexPage';
import { getAllPosts } from '../../lib/blog';
import { createPageMetadata } from '../../lib/site';

export const metadata: Metadata = createPageMetadata({
  title: 'Writing - Gideon Idoko',
  description: "Another part of the internet where I share stuff I think I (don't) know...",
  path: '/writing',
});

export default async function WritingPage() {
  const posts = await getAllPosts();

  return <BlogIndexPage posts={posts} />;
}
