import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createPageMetadata } from '../lib/site';
import styles from '../styles/Custom404.module.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Page Not Found',
  description: 'The page you were trying to view does not exist.',
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className={`padding-top-10rem ${styles.custom404Main}`}>
      <div className="container-max-1248px">
        <div className={styles.custom404Container}>
          <div className={styles.custom404ContainerChild}>
            <div className={styles.custom404ImageWrap}>
              <Image src="/assets/img/404.svg" alt="404" width={400} height={200} />
            </div>
            <p>
              <small>Well, this is awkward, the page you were trying to view does not exist.</small>
            </p>
            <div className={styles.custom404ExitLinks}>
              <span>
                <Link href="/" className={`animated-button animated-button--pallene__outline ${styles.aboutSeeMore}`}>
                  Home
                </Link>
              </span>
              <span>
                <Link
                  href="/writing"
                  className={`animated-button animated-button--pallene__outlineless ${styles.aboutSeeMore}`}
                >
                  Writing
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
