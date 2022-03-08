export interface Post {
    _id: string;
    title: string;
    slug: string;
    cover_img: string;
    author_username: string;
    author_name?: string;
    read_time: string;
    body: string;
    tags?: string[];
    is_published: boolean;
    is_pinned: boolean;
    is_comment_disabled: boolean;
    keywords?: string[];
    description: string;
    created_at: Date;
}

export interface PaginatedPosts {
    docs: Post[];
    totalDocs: number;
    perPage: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: undefined;
    nextPage: undefined;
}

export interface SinglePost {
    post: Post;
    nextPost: {
        _id: string;
        title: string;
        slug: string;
    };
    prevPost: {
        _id: string;
        title: string;
        slug: string;
    };
}
