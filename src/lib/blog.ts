import 'server-only';

import type { ReactNode } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import rehypePrism from 'rehype-prism-plus';
import remarkCodeTitles from 'remark-flexible-code-titles';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '../MDXInfo';
import { getReadTime } from '../helper';
import type { IPost } from '../interfaces/post.interface';

dayjs.extend(advancedFormat);

const BLOG_PATH = join(process.cwd(), 'src', 'blog');

type BlogFrontmatter = Partial<Record<'title' | 'cover' | 'description' | 'date', string>> & {
  tags?: string[];
};

export type BlogPost = IPost;

export type BlogPostDetail = {
  content: ReactNode;
  post: BlogPost;
};

const getBlogFiles = async () => {
  const files = await readdir(BLOG_PATH);
  return files.filter((file) => /\.md(x|)$/gi.test(file));
};

const createPostSummary = ({
  slug,
  frontmatter,
  source,
}: {
  slug: string;
  frontmatter: BlogFrontmatter;
  source: string;
}): BlogPost => ({
  title: frontmatter.title,
  cover: frontmatter.cover,
  description: frontmatter.description,
  slug,
  date: frontmatter.date ? dayjs(frontmatter.date).format('MMMM Do, YYYY') : undefined,
  publishedAt: frontmatter.date ? dayjs(frontmatter.date).toISOString() : undefined,
  readTime: getReadTime(source),
  tags: frontmatter.tags,
});

const readPostSource = async (slug: string) => {
  const files = await getBlogFiles();
  const filename = files.find((file) => file.split('.')[0] === slug);

  if (!filename) {
    return null;
  }

  const source = await readFile(join(BLOG_PATH, filename), 'utf-8');

  return {
    filename,
    source,
  };
};

export const getAllPostSlugs = async () => {
  const files = await getBlogFiles();
  return files.map((file) => file.split('.')[0]);
};

export const getAllPosts = async () => {
  const files = await getBlogFiles();

  const posts = await Promise.all(
    files.map(async (filename) => {
      const source = await readFile(join(BLOG_PATH, filename), 'utf-8');
      const { frontmatter } = await serialize<unknown, BlogFrontmatter>(source, {
        parseFrontmatter: true,
      });

      return createPostSummary({
        slug: filename.split('.')[0],
        frontmatter,
        source,
      });
    }),
  );

  return posts.sort((a, b) => new Date(b.date ?? new Date()).getTime() - new Date(a.date ?? new Date()).getTime());
};

export const getPostBySlug = async (slug: string): Promise<BlogPostDetail | null> => {
  const postSource = await readPostSource(slug);

  if (!postSource) {
    return null;
  }

  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source: postSource.source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkCodeTitles],
        rehypePlugins: [[rehypePrism, { ignoreMissing: true, showLineNumbers: false }]],
      },
    },
  });

  return {
    content,
    post: createPostSummary({
      slug,
      frontmatter,
      source: postSource.source,
    }),
  };
};
