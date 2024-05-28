import type { FC } from 'react';
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
  console.log('sortedPosts: ', JSON.stringify(sortedPosts, null, 2));
  const dummyPosts: typeof sortedPosts = new Array(12).fill(sortedPosts[0]);
  // return { props: { posts: sortedPosts } };
  return { props: { posts: dummyPosts } };
};

const Posts: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ posts }) => {
  return (
    <>
      <main className={`padding-top-10rem ${styles.blogMain}`}>
        <div className="container-max-1248px">
          <BlogIntro />
          <BlogTags />
          <FeaturedPost post={posts[Math.floor(Math.random() * posts.length)]} />
          <RenderPosts posts={posts} />
        </div>
      </main>
    </>
  );
};

export default Posts;
