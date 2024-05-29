/* eslint-disable @next/next/no-img-element */
import { useEffect, type FC, useState } from 'react';
import Link from 'next/link';
import Custom404 from '../../404';
import { getReadTime } from '../../../helper';
import copy from 'copy-to-clipboard';
import styles from '../../../styles/SinglePost.module.css';
import { NextSeo } from 'next-seo';
import type { InferGetStaticPropsType } from 'next';
import { IPost } from '../../../interfaces/post.interface';
import {
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from 'react-share';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);
import { MDXRemote } from 'next-mdx-remote';
import { mdxScope, mdxComponents } from '../../../MDXInfo';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import remarkCodeTitles from 'remark-flexible-code-titles';
import DisqusComments from '../../../components/blog/DisqusComments';

export const getStaticProps = async ({ params }: { params: { slug?: string } }) => {
  const slug = params?.slug;
  const blogPath = join(process.cwd(), 'blog');
  const files = await readdir(blogPath);
  const mdFiles = files.filter((file) => /\.md(x|)$/gi.test(file));
  const filename = mdFiles.find((file) => file.split('.')[0] === slug);
  let post: IPost | null = null;
  if (!filename) return { props: { source: null, post } };

  const blog = await readFile(join(blogPath, filename), 'utf-8');
  const source = await serialize<
    unknown,
    Partial<Record<'title' | 'cover' | 'description' | 'date', string> & { tags: string[] }>
  >(blog, {
    parseFrontmatter: true,
    scope: mdxScope,
    mdxOptions: {
      remarkPlugins: [[remarkGfm], [remarkCodeTitles]],
      rehypePlugins: [[rehypePrism, { ignoreMissing: true, showLineNumbers: false }]],
    },
  });

  post = {
    title: source.frontmatter.title,
    cover: source.frontmatter.cover,
    slug: slug as string,
    date: source.frontmatter.date && dayjs(source.frontmatter.date).format('MMMM Do, YYYY'),
    readTime: getReadTime(blog),
    tags: source.frontmatter.tags,
  };

  return { props: { source, post } };
};

export async function getStaticPaths() {
  const blogPath = join(process.cwd(), 'blog');
  const files = await readdir(blogPath);
  const mdFiles = files.filter((file) => /\.md(x|)$/gi.test(file));
  // Get the paths we want to pre-render based on posts
  const paths = mdFiles.map((filename) => ({
    params: { slug: filename.split('.')[0] },
  }));
  // Pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

const SinglePost: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ source, post }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (window as typeof window & { [key: string]: unknown }).customCopy = copy;
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (post) {
      const allPostBodyAnchors = window.document.querySelectorAll('.truePostBody a');
      const allPostBodyPreCode = window.document.querySelectorAll('pre:has(> code.code-highlight)');

      const allPostBodyTable = window.document.querySelectorAll('.truePostBody table');
      if (!window.document.querySelector('.postBodyTable')) {
        allPostBodyTable.forEach((table) => {
          try {
            const tableDiv = window.document.createElement('div');
            tableDiv.classList.add('postBodyTable');
            const clonedTable = table.cloneNode(true);
            tableDiv.appendChild(clonedTable);
            table.replaceWith(tableDiv);
          } catch (e) {
            console.error(e);
          }
        });
      }

      allPostBodyAnchors.forEach((a) => {
        //get hostname of website address and link address
        const siteHostname = window.location.href.split('/')[2];
        const linkHostname = (a as Element & { href: string }).href.split('/')[2];

        if (siteHostname !== linkHostname) {
          //add target attribut to external links
          !a.hasAttribute('target') && a.setAttribute('target', '_blank');
          !a.hasAttribute('rel') && a.setAttribute('rel', 'noopener noreferrer');
        }
      });

      allPostBodyPreCode.forEach((pre, index) => {
        // for code snippet
        const copyBtn = window.document.createElement('button');
        const copyBtnTextNode = window.document.createTextNode('Copied');
        const i = window.document.createElement('i');
        const span = window.document.createElement('span');

        i.classList.add('neu-copy');
        // span.classList.a
        span.appendChild(copyBtnTextNode);
        copyBtn.classList.add('codeCopyBtn');
        copyBtn.classList.add(`codeCopyBtn${index}`);

        copyBtn.appendChild(i);
        copyBtn.appendChild(span);
        (window as typeof window & { [key: string]: unknown })[`customCopyText${index}`] =
          pre.childNodes[0].textContent;
        copyBtn.setAttribute(
          'onclick',
          `(function copySnippet(){ window.customCopy(window.customCopyText${index}); window.document.querySelector('.codeCopyBtn${index} span').style.display='inline'; setTimeout(function() { window.document.querySelector('.codeCopyBtn${index} span').style.display='none'; }, 3000) })()`,
        );
        pre.childNodes.length === 1 && pre.appendChild(copyBtn);
      });
    }
  }, [post]);

  return (
    <>
      {!post ? (
        <Custom404 />
      ) : (
        <>
          <NextSeo
            title={`${post.title} - Gideon Idoko`}
            description={post.description}
            canonical={`https://gideonidoko.com/blog/${post.slug}`}
            openGraph={{
              url: `https://gideonidoko.com/blog/${post.slug}`,
              title: `${post.title} - Gideon Idoko`,
              description: post.description,
              type: 'article',
              article: {
                // publishedTime: post.created_at as string,
                authors: ['Gideon Idoko'],
                tags: post.tags,
              },
              images: [
                {
                  url: post.cover ?? '',
                  alt: `${post.title}'s cover image`,
                },
              ],
              site_name: 'Gideon Idoko',
            }}
            twitter={{
              handle: '@IamGideonIdoko',
              site: '@IamGideonIdoko',
              cardType: 'summary_large_image',
            }}
          />
          <main className={`padding-top-10rem ${styles.singlePostMain}`}>
            <div className="container-max-1248px">
              <>
                <div className={styles.singlePostPageWrapper}>
                  <div className={styles.blogHeader}>
                    <h1 className={styles.postTitle}>{post.title}</h1>
                    <h5 className={styles.blogMeta}>
                      <span>
                        <small>{post.date}</small>
                      </span>{' '}
                      &nbsp; —&nbsp;{' '}
                      <span>
                        <small>{post.readTime}</small>
                      </span>{' '}
                      &nbsp; —&nbsp;{' '}
                      <span>
                        <small>Gideon Idoko</small>
                      </span>
                    </h5>
                    <div className={styles.postCoverWrap}>
                      <img className={styles.postCover} src={post.cover} alt="Blog Cover" />
                    </div>
                  </div>

                  <div className={styles.blogBody}>
                    <div className={`${styles.postBody} truePostBody`}>
                      {source && <MDXRemote {...source} components={mdxComponents} />}
                    </div>
                    <div className={styles.postTags}>
                      {post.tags?.map((tag, idx) => (
                        <span key={idx}>
                          <Link href={`/blog?q=${tag}`}>#{tag}</Link>
                        </span>
                      ))}
                    </div>
                    {loaded && (
                      <div className={styles.postShare}>
                        <div className={styles.postShareBtns}>
                          <span>Share: </span>
                          <TwitterShareButton
                            title={post?.title}
                            hashtags={post.tags as string[]}
                            url={window.document.URL}
                            via={'IamGideonIdoko'}
                          >
                            <TwitterIcon size={32} round={true} />
                          </TwitterShareButton>
                          <LinkedinShareButton
                            title={post?.title}
                            url={window.document.URL}
                            summary={post?.description}
                            source={'Gideon Idoko'}
                          >
                            <LinkedinIcon size={32} round={true} />
                          </LinkedinShareButton>
                          <FacebookShareButton
                            url={window.document.URL}
                            quote={post?.description}
                            hashtag={post?.tags ? post?.tags[0] : ''}
                          >
                            <FacebookIcon size={32} round={true} />
                          </FacebookShareButton>
                          <WhatsappShareButton title={post?.title} url={window.document.URL} separator={': '}>
                            <WhatsappIcon size={32} round={true} />
                          </WhatsappShareButton>
                        </div>
                      </div>
                    )}
                    {/*
                     <div className={styles.postPagination}>
                      <div className={styles.ppLeft}>
                        {prev && prev.slug && <Link href={`/blog/${prev.slug}`}>← {prev.title}</Link>}
                      </div>
                      <div className={styles.ppRight}>
                        {next && next.slug && <Link href={`/blog/${next.slug}`}>{next.title} →</Link>}
                      </div>
                    </div>
                    */}
                    {post.title && post.slug && <DisqusComments title={post.title} slug={post.slug} />}
                  </div>
                </div>
              </>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default SinglePost;
