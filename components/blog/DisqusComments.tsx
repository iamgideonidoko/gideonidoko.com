import { type FC, useMemo, type ComponentProps } from 'react';
import { DiscussionEmbed } from 'disqus-react';

type DiscussionEmbedProps = ComponentProps<typeof DiscussionEmbed>;

const DisqusComments: FC<{ title: string; slug: string }> = ({ title, slug }) => {
  const disqusShortname = 'gideon-idoko-blog';
  const disqusConfig: DiscussionEmbedProps['config'] = useMemo(
    () => ({
      url: `${typeof window !== 'undefined' ? window.location.origin : 'https://gideonidoko.com'}/blog/${slug}`,
      identifier: slug,
      title,
    }),
    [title, slug],
  );
  return (
    <div style={{ marginTop: '5em' }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
