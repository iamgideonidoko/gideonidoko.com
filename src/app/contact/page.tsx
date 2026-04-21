import type { Metadata } from 'next';
import { createPageMetadata } from '../../lib/site';
import styles from '../../styles/Contact.module.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact me - Gideon Idoko',
  description:
    'Have you got a question, proposal or project in mind? Does your project need a fix? Do you want to collaborate with me on something? Feel free to reach out.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className={`padding-top-10rem ${styles.contactMain}`}>
      <div className="container-full">
        <h1>Contact me</h1>
        <div className={styles.scrollText}>
          SCROLL <i className="neu-down-lg"></i> DOWN
        </div>
      </div>
    </main>
  );
}
