import type { Metadata } from 'next';
import AboutPage from '../../components/pages/AboutPage';
import { createPageMetadata } from '../../lib/site';

export const metadata: Metadata = createPageMetadata({
  title: 'About me - Gideon Idoko',
  description:
    'Gideon Idoko is a software engineer interested in creative technology, design, AI, research, and building impactful solutions.',
  path: '/about',
});

export default function AboutRoute() {
  return <AboutPage />;
}
