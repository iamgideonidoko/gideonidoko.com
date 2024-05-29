export type IPost = Partial<Record<'title' | 'cover' | 'description' | 'slug' | 'date', string>> & {
  readTime: string;
  tags?: string[];
};

export type IPrevNextPost = Pick<IPost, 'title' | 'slug'>;

export type ISitemapPost = Pick<IPost, 'slug' | 'date'>;
