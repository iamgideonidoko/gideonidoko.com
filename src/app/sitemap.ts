import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/blog';
import { siteConfig } from '../lib/site';

const staticDate = '2024-05-28T05:42:06+00:00';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    {
      url: siteConfig.url,
      lastModified: staticDate,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/writing`,
      lastModified: staticDate,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: staticDate,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/uses`,
      lastModified: staticDate,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: staticDate,
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/writing/${post.slug}`,
      lastModified: post.publishedAt ?? staticDate,
      priority: 1,
    })),
  ];
}
