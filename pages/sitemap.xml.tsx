import { GetServerSideProps } from 'next';
import { authGet } from '../helper';
import { Post } from '../interfaces/post.interface';
import dayjs from 'dayjs';

const Sitemap = () => null;

const staticDate = '2022-08-11T05:42:06+00:00';

const getSitemap = (extraUrls: Array<{ url: string; date: string }> = []) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    <url>
        <loc>https://gideonidoko.com/</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/blog</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/about</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/contact</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://gideonidoko.com/blog/search</loc>
        <lastmod>${staticDate}</lastmod>
        <priority>1.00</priority>
    </url>
    ${extraUrls.map(
        (url) => `<url>
    <loc>${url.url}</loc>
    <lastmod>${url.date}</lastmod>
    <priority>1.00</priority>
</url>
    `,
    )}
</urlset>
`;

const getPosts = async (): Promise<Post[]> => {
    try {
        const res = await authGet(`/posts?page=1&per_page=45`);
        return (res?.data?.posts?.docs as Post[]) || [];
    } catch (err) {
        return [];
    }
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // Fetch data from external API
    const posts = await getPosts();

    const slugUrls = posts.map((item) => ({
        url: `https://gideonidoko.com/blog/${item?.slug}`,
        date: dayjs(item?.created_at).format(),
    }));

    const sitemap = getSitemap(slugUrls);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default Sitemap;
