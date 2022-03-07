import { v4 as uuidv4 } from 'uuid';
import { CountOptions, SocialShareOptions, AxiosHeaders, Asset } from './interfaces/helper.interface';
import axios, { AxiosRequestConfig } from 'axios';
import { config } from './config/keys';
import SimpleCrypto from 'simple-crypto-js';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { store, RootReducer } from './store/store';
import { PreloadedState } from 'redux';

const simpleCrypto = new SimpleCrypto(config.reduxStoreSecretKey);

export const renameFileWithPrefix = (fileName: string) => {
    //site domain name
    const siteDomain = 'gideonidoko.com';

    //get the extension of the file
    const ext = fileName.split('.').pop();

    //remove all none word characters from generated uuid
    const wordUuid = uuidv4().replace(/\W/gi, '');

    //get the first 10 characters from the result
    const shortRandChars = wordUuid.slice(0, 10);

    //create extension with the dot
    const dotExt = '.' + ext;

    //create a ext regex
    const extRegex = new RegExp(`${dotExt}`, 'ig');

    //remove the extension from the initial filename
    const fileNameMinusExt = fileName.replace(extRegex, '');

    //create a new filename
    const newFileName = fileNameMinusExt + '_' + siteDomain + '_' + shortRandChars + dotExt;

    return newFileName;
};

export const convertByteInString = (val: number) => {
    let convertedVal;
    if (val < 1048576) {
        convertedVal = Number.parseFloat((val / 1024).toString()).toFixed(2) + 'kb';
        return convertedVal;
    } else if (val >= 1048576) {
        convertedVal = Number.parseFloat((val / 1048576).toString()).toFixed(2) + 'mb';
        return convertedVal;
    }
};

export const strToSlug = (str: string) => {
    //replace all non word characters with space
    const replaceNonWord = str.toLowerCase().replace(/\W+/gi, ' ');

    //replace underscores with spaces
    const replaceUnderScores = replaceNonWord.replace(/_/gi, ' ');

    // replace all space with single dash
    const replaceSpace = replaceUnderScores.trim().replace(/\s+/gi, '-');

    return replaceSpace;
};

export const separatedStrToArr = (str: string) => {
    const splitStr = str.split(';');
    const resArr = splitStr.filter((x) => {
        if (x) return x;
    });
    return resArr;
};

export const decode = (string: string) => {
    const output = [];
    let counter = 0;
    const length = string.length;

    while (counter < length) {
        const value = string.charCodeAt(counter++);

        if (value >= 0xd800 && value <= 0xdbff && counter < length) {
            // It's a high surrogate, and there is a next character.

            const extra = string.charCodeAt(counter++);

            if ((extra & 0xfc00) == 0xdc00) {
                // Low surrogate.
                output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            } else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // next code unit is the high surrogate of a surrogate pair.

                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }

    return output;
};

export const count = (target: string, options?: CountOptions) => {
    let original = '' + target;

    options = options || {};

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '');

    if (options.ignore) {
        original = original.replace(/ /i, '');
    }

    const trimmed = original.trim();

    return {
        paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
        sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
        words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
        characters: trimmed ? decode(trimmed.replace(/\s/g, '')).length : 0,
        all: decode(original).length,
    };
};

export const getReadTime = (string: string) => {
    const WPM = 200;

    const estimatedReadTime = count(string).words / WPM;

    const remainder = estimatedReadTime % 1;

    // const minutes = estimatedReadTime - remainder;

    const roundedMinutes = Math.round(estimatedReadTime);

    const seconds = Math.round(remainder * 60);

    return roundedMinutes < 1
        ? seconds <= 1
            ? seconds + ' sec read'
            : seconds + ' secs read'
        : roundedMinutes <= 1
        ? roundedMinutes + ' min read'
        : roundedMinutes + ' mins read';
};

export const commaSeparatedStr = (tagArr: string[]) => {
    const mappedTagArr = tagArr.map((x) => x.replace(/\W/gi, '_'));
    const joinedArr = mappedTagArr.join();

    return joinedArr;
};

export const socialWindow = (url: string) => {
    const left = (screen.width - 570) / 2;
    const top = (screen.height - 570) / 2;
    const params = 'menubar=no,toolbar=no,status=no,width=570,height=570,top=' + top + ',left=' + left;
    // NB: Setting 'params' to an empty string will launch
    // content in a new tab or window rather than a pop-up.
    // i.e  =>>> params = "";
    window.open(url, 'NewWindow', params);
};

export function shareToSocialMedia(opt: SocialShareOptions) {
    /*
	Expect properties of opt object
	- type (required) [string]
	- text (for twitter) [string]
	- hashtags (for twitter) [array]
	- summary (for linkedin) [string]
	- title (for linkedin) [string]
	- source (for linkedin) [string]
	*/
    let url;

    if (!opt) {
        console.log('SOCIAL MEDIA SHARE ERROR: No object bound to the social media share function');
        return;
    }

    if (!opt.type) {
        console.log('SOCIAL MEDIA SHARE ERROR: No type found in object');
        return;
    }

    //get the current page url
    const pageUrl = encodeURIComponent(window.document.URL);

    if (opt.type === 'facebook') {
        url = 'https://www.facebook.com/sharer.php?u=' + pageUrl;
        socialWindow(url);
    } else if (opt.type === 'twitter' && opt.text) {
        const preText = opt.text;
        const text = encodeURIComponent(preText.length > 140 ? preText.slice(0, 130) + '...' : preText);
        url = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=${opt.hashtags}&via=IamGideonIdoko`;
        socialWindow(url);
    } else if (opt.type === 'linkedin' && opt.summary && opt.source && opt.title) {
        const title = encodeURIComponent(opt.title);
        const summary = encodeURIComponent(opt.summary);
        const source = encodeURIComponent(opt.source);
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${title}&summary=${summary}&source=${source}`;
        socialWindow(url);
    }
}

export function isConstructor(f: new () => boolean) {
    try {
        new f();
    } catch (err) {
        // verify err is the expected error and then
        return false;
    }
    return true;
}

// to get axios header config with access token
export const axiosHeaders = () => {
    //get tenant tenantToken from local storage

    // Headers
    const axiosConfig: AxiosRequestConfig<{ headers: AxiosHeaders }> = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axiosConfig;
};

// to get axios header config with access token
export const axiosAuthHeaders = () => {
    //get tenant tenantToken from local storage
    const auth = store.getState()?.auth;

    // Headers
    const axiosConfig: AxiosRequestConfig<string> = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth.userInfo?.accessToken ? `Bearer ${auth.userInfo?.accessToken}` : '',
        },
    };

    return axiosConfig;
};

export const loadState = () => {
    try {
        const encryptedState = localStorage.getItem(config.reduxStorePersistenceKey);
        if (!encryptedState) return undefined;
        const state = simpleCrypto.decrypt(encryptedState);
        // return JSON.parse(serializedState as string);
        return state as PreloadedState<RootReducer>;
    } catch (e) {
        return undefined;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveState = (state: any) => {
    try {
        // const serializedState = JSON.stringify(state);
        const encryptedState = simpleCrypto.encrypt(state);
        localStorage.setItem(config.reduxStorePersistenceKey, encryptedState);
    } catch (e) {
        // Ignore
    }
};

const customAxios = axios.create();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestHandler = async (request: AxiosRequestConfig<any>) => {
    console.log('Intercepted request');
    return request;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any) => {
    return Promise.reject(error);
};

customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error),
);

export const axiosAuth = customAxios;

// auth helper functions
export const authPost = (path: string, body: unknown): Promise<unknown> => {
    return new Promise<unknown>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.post(`${config.baseUrl}${path}`, body, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const authDelete = (path: string): Promise<unknown> => {
    return new Promise<unknown>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.delete(`${config.baseUrl}${path}`, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const authPut = (path: string, body: unknown): Promise<unknown> => {
    return new Promise<unknown>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.put(`${config.baseUrl}${path}`, body, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};
