// import { AxiosRequestConfig } from 'axios';
export interface CountOptions {
    stripTags?: boolean;
    hardReturns?: boolean;
    ignore?: boolean;
}

export interface SocialShareOptions {
    type: string;
    title?: string;
    summary?: string;
    source?: string;
    text?: string;
    hashtags?: string[];
}

export interface AxiosHeaders {
    Authorization?: string;
    'Content-Type': string;
}

export interface Asset {
    _id?: string;
    name: string;
    url: string;
    size: number;
    file_type: string;
    author_username: string;
    author_name: string;
}
