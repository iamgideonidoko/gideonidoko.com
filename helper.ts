/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import { CountOptions } from './interfaces/helper.interface';
import axios, { AxiosRequestConfig } from 'axios';
import { config } from './config/keys';
import SimpleCrypto from 'simple-crypto-js';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { store, RootReducer } from './store/store';
import { PreloadedState } from 'redux';
import { logoutUser, updateTokens } from './store/slice/auth.slice';
import { decode as htmlDecode } from 'html-entities';
import DOMPurify from 'isomorphic-dompurify';

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
    const axiosConfig: AxiosRequestConfig<object> = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-api-key': `${config.noAuthKey}${Date.now()}`,
        },
    };

    return axiosConfig;
};

// to get axios header config with access token
export const axiosAuthHeaders = () => {
    //get tenant tenantToken from local storage
    const auth = store.getState()?.auth;

    // Headers
    const axiosConfig: AxiosRequestConfig<object> = {
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

export const refreshUserTokens = (): Promise<void | string> => {
    return new Promise<void | string>(async (resolve) => {
        const accessToken = store.getState().auth.userInfo?.accessToken;
        const refreshToken = store.getState().auth.userInfo?.refreshToken;

        if (refreshToken && accessToken) {
            const decodedRefreshToken: { exp: number } = jwt_decode(refreshToken);
            const isRefreshTokenExpired = dayjs.unix(decodedRefreshToken.exp).diff(dayjs()) < 1;

            if (isRefreshTokenExpired) {
                // logout user (acess token can't be refreshed)
                store.dispatch(logoutUser());
            } else {
                // token can be refreshed
                // check for access token
                const decodedAccessToken: { exp: number } = jwt_decode(accessToken);
                const isAccessTokenExpired = dayjs.unix(decodedAccessToken.exp).diff(dayjs()) < 1;
                if (isAccessTokenExpired) {
                    // refresh token
                    try {
                        const res = await axios.post(
                            `${config.baseUrl}/auth/refresh`,
                            { refreshToken },
                            axiosHeaders(),
                        );
                        // update new tokens
                        store.dispatch(updateTokens(res.data?.data?.tokens));
                        // sleep for 2s
                        resolve(res.data?.data?.tokens?.accessToken);
                    } catch (err) {
                        // refreshing tokens failed
                        store.dispatch(logoutUser());
                        resolve();
                    }
                } else {
                    // slide
                    resolve();
                }
            }
        } else {
            resolve();
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestHandler = async (request: AxiosRequestConfig<any>) => {
    const newAccessToken = await refreshUserTokens();
    if (newAccessToken && request.headers) {
        request.headers.Authorization = `Bearer ${newAccessToken}`;
    }

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
export const authPost = (path: string, body: object): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.post(`${config.baseUrl}${path}`, body, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const authDelete = (path: string): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.delete(`${config.baseUrl}${path}`, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const authPut = (path: string, body: object): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.put(`${config.baseUrl}${path}`, body, axiosAuthHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const authGet = (path: string): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.get(`${config.baseUrl}${path}`, axiosHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const noAuthPut = (path: string, body: object): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.put(`${config.baseUrl}${path}`, body, axiosHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const noAuthPost = (path: string, body: object): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const res = await axiosAuth.post(`${config.baseUrl}${path}`, body, axiosHeaders());
            resolve(res.data);
        } catch (err) {
            reject(err);
        }
    });
};

export const loadFirebase = () => {
    if (typeof window !== 'undefined') {
        const firebase = window.firebase;
        if (firebase && !window.isFirebaseInitialized) {
            // Firebase configuration
            const firebaseConfig = {
                apiKey: config.firebaseApiKey,
                authDomain: config.firebaseAuthDomain,
                projectId: config.firebaseProjectId,
                storageBucket: config.firebaseStorageBucket,
                messagingSenderId: config.firebaseMessagingSenderId,
                appId: config.firebaseAppId,
            };

            firebase.initializeApp(firebaseConfig);
            window.isFirebaseInitialized = true;
        }
    }
};

export const socialIconStyle = (other?: object) => ({
    ...{ height: '4em', width: '4em', borderRadius: '100rem', transform: 'scale(0.6)' },
    ...other,
});

const extractEmbedRegex =
    /<div\s+class=[(\"|')]\s*embedhtml\s*[(\"|')](?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/div>/gi;

const stripScriptRegex =
    /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gi;

export const embedHtml = (html: string) => {
    let newHtml = html;
    const embedBoxes = html.match(extractEmbedRegex);
    // const codeBlocks = html.match(codeBlockRegex);

    console.log('embedBoxes => ', embedBoxes);
    // console.log('codeBlocks => ', codeBlocks);

    if (embedBoxes) {
        embedBoxes.forEach((box) => {
            // strip opening and closing tags
            const boxContent = box.replace(/(^<div.*?>|<\/div>)/gi, '');
            const realBoxContent = boxContent.replace(/<[^>]+>/g, '');
            const decodedBoxContent = htmlDecode(realBoxContent);
            newHtml = newHtml.replace(box, '<div>' + decodedBoxContent.replace(stripScriptRegex, '') + '</div>');
        });
    }
    return newHtml;
};

export const purifyHtml = (text: string): string => {
    return DOMPurify.sanitize(text, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: [
            'frameborder',
            'allow',
            'allowfullscreen',
            'csp',
            'fetchpriority',
            'loading',
            'name',
            'referrerpolicy',
            'sandbox',
            'srcdoc',
            'scrolling',
            'longdesc',
            'marginheight',
            'marginwidth',
        ],
    });
};
