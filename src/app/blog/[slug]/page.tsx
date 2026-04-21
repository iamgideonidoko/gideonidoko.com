import { permanentRedirect } from 'next/navigation';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  permanentRedirect(`/writing/${slug}`);
}
