import { permanentRedirect } from 'next/navigation';

export default function BlogPage() {
  permanentRedirect('/writing');
}
