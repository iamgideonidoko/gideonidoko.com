import { Fragment } from 'react';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { isValidURL } from '../helper';

const Redirector = () => {
  return (
    <Fragment>
      <NextSeo title="Redirect" noindex={true} nofollow={true} />
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { url } = query as { url: string };

  // redirect to url if valid
  if (url && isValidURL(url))
    return {
      redirect: {
        permanent: false,
        destination: url,
      },
    };

  // redirect to homepage if url is not valid
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  };
};

export default Redirector;
