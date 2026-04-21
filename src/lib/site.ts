import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Gideon Idoko',
  title: 'Gideon Idoko - Software Engineer',
  description:
    'Gideon Idoko is a software engineer interested in creative technology, design, AI, research, and building impactful solutions.',
  url: 'https://gideonidoko.com',
  ogImage: 'https://gideonidoko.com/assets/img/GideonIdokoCardImage.png',
  xHandle: '@iamgideonidoko',
};

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export const createPageMetadata = ({
  title,
  description,
  path = '/',
  image = siteConfig.ogImage,
  imageAlt = "Gideon Idoko's card image",
  noIndex = false,
}: MetadataOptions): Metadata => {
  const canonical = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      type: 'website',
      images: [
        {
          url: image,
          width: 1500,
          height: 500,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: siteConfig.xHandle,
      site: siteConfig.xHandle,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
};
