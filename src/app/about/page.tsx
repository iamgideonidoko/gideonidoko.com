import type { Metadata } from 'next';
import AboutPage from '../../components/pages/AboutPage';
import { createPageMetadata } from '../../lib/site';

export const metadata: Metadata = createPageMetadata({
  title: 'About me - Gideon Idoko',
  description:
    'Gideon Idoko is a solution-driven Software Engineer interested in learning, building solutions with unique experiences, sharing technical ideas, writing and community building.',
  path: '/about',
});

export default function AboutRoute() {
  return <AboutPage />;
}
