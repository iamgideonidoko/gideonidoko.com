export interface CountOptions {
    stripTags?: boolean;
    hardReturns?: boolean;
    ignore?: boolean;
}

export interface SocialShareOptions {
    type: string;
    title: string;
    summary?: string;
    source?: string;
    text?: string;
    hashtags?: string;
}

export interface AxiosHeaders {
    Authorization?: string;
    'Content-Type': string;
}