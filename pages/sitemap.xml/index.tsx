import { GetServerSideProps } from 'next';
import { ISitemapPost } from '../../interfaces/post.interface';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'path';

const staticDate = '2024-05-28T05:42:06+00:00';

const getSitemap = (extraUrls: ISitemapPost[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://gideonidoko.com</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>2.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/blog</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/about</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>2.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/contact</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    ${extraUrls.map((url) => {
      return `
<url>
    <loc>https://gideonidoko.com/blog/${url.slug}</loc>
    <lastmod>${url.date}</lastmod>
    <priority>1.00</priority>
</url>
    `.trim();
    })}
</urlset>
`;

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const blogPath = join(process.cwd(), 'blog');
  const files = await readdir(blogPath);
  const mdFiles = files.filter((file) => /\.md(x|)$/gi.test(file));
  const sitemapPosts = await Promise.all(
    mdFiles.map(async (filename) => {
      const blog = await readFile(join(blogPath, filename), 'utf-8');
      const { frontmatter } = await serialize<
        unknown,
        Partial<Record<'title' | 'cover' | 'description' | 'date', string> & { tags: string[] }>
      >(blog, { parseFrontmatter: true });
      const { date } = frontmatter;
      return {
        slug: filename.split('.')[0],
        date: date && dayjs(date).toISOString(),
      };
    }),
  );
  const sitemap = getSitemap(sitemapPosts);
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  return {
    props: {},
  };
};

const Sitemap = () => null;

export default Sitemap;
