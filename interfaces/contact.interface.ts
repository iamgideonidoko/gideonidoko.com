export interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    created_at: Date;
}

export interface PaginatedContacts {
    docs: Contact[];
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
