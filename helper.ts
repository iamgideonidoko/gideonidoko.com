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
import * as THREE from 'three';

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
            'x-auth-api-key': config.noAuthKey,
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

export const isValidURL = (url: string): boolean => {
    const res = url.match(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
    );
    return res !== null;
};

export const wrapElements = (elems: HTMLElement[], wrapType: keyof HTMLElementTagNameMap, wrapClass: string) => {
    elems.forEach((word) => {
        const wrapEl = document.createElement(wrapType);
        (wrapEl.classList as unknown) = wrapClass;

        // Get a reference to the parent
        const parent = word.parentNode;

        // Insert the wrapper before the word in the DOM tree
        parent && parent.insertBefore(wrapEl, word);

        // Move the word inside the wrapper
        wrapEl.appendChild(word);
    });
};

// Map number x from range [a, b] to [c, d]
const map = (x: number, a: number, b: number, c: number, d: number) => ((x - a) * (d - c)) / (b - a) + c;

// Linear interpolation
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const calcWinsize = () => {
    return { width: window.innerWidth, height: window.innerHeight };
};

// Gets the mouse position
const getMousePos = (e: MouseEvent) => {
    return {
        x: e.clientX,
        y: e.clientY,
    };
};

const distance = (x1: number, y1: number, x2: number, y2: number) => {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.hypot(a, b);
};

export const clamp = (val: number, min = 0, max = 1) => Math.max(min, Math.min(max, val));

export const getRatio = (
    { x: w, y: h }: Record<'x' | 'y', number>,
    { width, height }: Record<'width' | 'height', number>,
    r = 0,
) => {
    const m = multiplyMatrixAndPoint(rotateMatrix(THREE.MathUtils.degToRad(r)), [w, h]);
    const originalRatio = {
        w: m[0] / width,
        h: m[1] / height,
    };

    const coverRatio = 1 / Math.max(originalRatio.w, originalRatio.h);

    return new THREE.Vector2(originalRatio.w * coverRatio, originalRatio.h * coverRatio);
};

const rotateMatrix = (a: number) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];

const multiplyMatrixAndPoint = (matrix: number[], point: number[]) => {
    const c0r0 = matrix[0];
    const c1r0 = matrix[1];
    const c0r1 = matrix[2];
    const c1r1 = matrix[3];
    const x = point[0];
    const y = point[1];
    return [Math.abs(x * c0r0 + y * c0r1), Math.abs(x * c1r0 + y * c1r1)];
};

export const wrap = (el: HTMLElement, wrapper: HTMLElement) => {
    if (el.parentNode) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }
};

export const unwrap = (content: HTMLElement[]) => {
    for (let i = 0; i < content.length; i++) {
        const el = content[i];
        const parent = el.parentNode as HTMLElement;

        if (parent && parent.parentNode) parent.outerHTML = el.innerHTML;
    }
};

export const ev = (eventName: string, data: unknown) => {
    const e = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(e);
};

export { map, lerp, calcWinsize, getMousePos, distance };

export const firstLetter = (str: string) => {
    const newStr = str.split('');
    return newStr[0];
};

export const calculateScale = (size: number, newSize: number) => newSize / size;

export const vwToPx = (valueInVw: number) => {
    // Get the viewport width
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    // Calculate the equivalent value in pixels
    const valueInPx = (valueInVw * viewportWidth) / 100;
    return valueInPx;
};
