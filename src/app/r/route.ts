import { redirect } from 'next/navigation';
import { isValidURL } from '../../helper';

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url');

  if (url && isValidURL(url)) {
    redirect(url);
  }

  redirect('/');
}
