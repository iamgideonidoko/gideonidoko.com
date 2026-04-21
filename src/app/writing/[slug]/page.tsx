import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from '../../../components/blog/BlogPostClient';
import { getAllPostSlugs, getPostBySlug } from '../../../lib/blog';
import { siteConfig } from '../../../lib/site';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const postEntry = await getPostBySlug(slug);

  if (!postEntry) {
    return {
      title: 'Page Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { post } = postEntry;
  const canonical = `${siteConfig.url}/writing/${post.slug}`;
  const title = `${post.title} - Gideon Idoko`;
  const description = post.description ?? siteConfig.description;
  const image = post.cover ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          alt: `${post.title}'s cover image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: siteConfig.xHandle,
      site: siteConfig.xHandle,
    },
    authors: [{ name: siteConfig.name }],
    keywords: post.tags,
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postEntry = await getPostBySlug(slug);

  if (!postEntry) {
    notFound();
  }

  return <BlogPostClient post={postEntry.post}>{postEntry.content}</BlogPostClient>;
}
