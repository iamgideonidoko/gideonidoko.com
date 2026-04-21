'use client';

/* eslint-disable @next/next/no-img-element */
import { type ReactNode, useEffect } from 'react';
import Link from 'next/link';
import copyToClipboard from 'copy-to-clipboard';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import type { IPost } from '../../interfaces/post.interface';
import styles from '../../styles/SinglePost.module.css';
import DisqusComments from './DisqusComments';

type CopyWindow = Window & {
  customCopy?: typeof copyToClipboard;
};

export default function BlogPostClient({ children, post }: { children: ReactNode; post: IPost }) {
  useEffect(() => {
    (window as CopyWindow).customCopy = copyToClipboard;

    return () => {
      delete (window as CopyWindow).customCopy;
    };
  }, []);

  useEffect(() => {
    const cleanupFns: Array<() => void> = [];

    const allPostBodyAnchors = window.document.querySelectorAll<HTMLAnchorElement>('.truePostBody a');
    const allPostBodyPreCode = window.document.querySelectorAll<HTMLPreElement>('pre:has(> code.code-highlight)');
    const allPostBodyTable = window.document.querySelectorAll<HTMLTableElement>('.truePostBody table');

    allPostBodyTable.forEach((table) => {
      if (table.parentElement?.classList.contains('postBodyTable')) {
        return;
      }

      const tableDiv = window.document.createElement('div');
      tableDiv.classList.add('postBodyTable');
      table.replaceWith(tableDiv);
      tableDiv.appendChild(table);
    });

    allPostBodyAnchors.forEach((anchor) => {
      const siteHostname = window.location.href.split('/')[2];
      const linkHostname = anchor.href.split('/')[2];

      if (siteHostname !== linkHostname) {
        if (!anchor.hasAttribute('target')) {
          anchor.setAttribute('target', '_blank');
        }
        if (!anchor.hasAttribute('rel')) {
          anchor.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });

    allPostBodyPreCode.forEach((pre) => {
      if (pre.querySelector('.codeCopyBtn')) {
        return;
      }

      const code = pre.querySelector('code.code-highlight');
      const codeText = code?.textContent;

      if (!codeText) {
        return;
      }

      const copyBtn = window.document.createElement('button');
      const icon = window.document.createElement('i');
      const copyState = window.document.createElement('span');
      copyState.textContent = 'Copied';

      icon.classList.add('neu-copy');
      copyBtn.classList.add('codeCopyBtn');
      copyBtn.appendChild(icon);
      copyBtn.appendChild(copyState);

      let feedbackTimeout = 0;
      const handleCopy = () => {
        copyToClipboard(codeText);
        copyState.style.display = 'inline';
        window.clearTimeout(feedbackTimeout);
        feedbackTimeout = window.setTimeout(() => {
          copyState.style.display = 'none';
        }, 3000);
      };

      copyBtn.addEventListener('click', handleCopy);
      cleanupFns.push(() => {
        window.clearTimeout(feedbackTimeout);
        copyBtn.removeEventListener('click', handleCopy);
      });

      pre.appendChild(copyBtn);
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [post.slug]);

  const shareUrl = typeof window !== 'undefined' ? window.document.URL : `https://gideonidoko.com/writing/${post.slug}`;

  return (
    <main className={`padding-top-10rem ${styles.singlePostMain}`}>
      <div className="container-max-1248px">
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
              <img className={styles.postCover} src={post.cover} alt="Article cover" />
            </div>
          </div>

          <div className={styles.blogBody}>
            <div className={`${styles.postBody} truePostBody`}>{children}</div>
            <div className={styles.postTags}>
              {post.tags?.map((tag, idx) => (
                <span key={idx}>
                  <Link href={`/writing?q=${tag}`}>#{tag}</Link>
                </span>
              ))}
            </div>
            {post.title && (
              <div className={styles.postShare}>
                <div className={styles.postShareBtns}>
                  <span>Share: </span>
                  <TwitterShareButton
                    title={post.title}
                    hashtags={post.tags ?? []}
                    url={shareUrl}
                    via="IamGideonIdoko"
                  >
                    <TwitterIcon size={32} round={true} />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    title={post.title}
                    url={shareUrl}
                    summary={post.description}
                    source="Gideon Idoko"
                  >
                    <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>
                  <FacebookShareButton url={shareUrl} hashtag={post.tags ? post.tags[0] : ''}>
                    <FacebookIcon size={32} round={true} />
                  </FacebookShareButton>
                  <WhatsappShareButton title={post.title} url={shareUrl} separator=": ">
                    <WhatsappIcon size={32} round={true} />
                  </WhatsappShareButton>
                </div>
              </div>
            )}
            {post.title && post.slug && <DisqusComments title={post.title} slug={post.slug} />}
          </div>
        </div>
      </div>
    </main>
  );
}
