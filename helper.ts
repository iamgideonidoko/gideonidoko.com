import { v4 as uuidv4 } from 'uuid';

export const renameFileWithPrefix = (fileName) => {
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

export const convertByteInString = (val) => {
    let convertedVal;
    if (val < 1048576) {
        convertedVal = Number.parseFloat(val / 1024).toFixed(2) + 'kb';
        return convertedVal;
    } else if (val >= 1048576) {
        convertedVal = Number.parseFloat(val / 1048576).toFixed(2) + 'mb';
        return convertedVal;
    }
};

export const strToSlug = (str) => {
    //replace all non word characters with space
    const replaceNonWord = str.toLowerCase().replace(/\W+/gi, ' ');

    //replace underscores with spaces
    const replaceUnderScores = replaceNonWord.replace(/_/gi, ' ');

    // replace all space with single dash
    const replaceSpace = replaceUnderScores.trim().replace(/\s+/gi, '-');

    return replaceSpace;
};

export const separatedStrToArr = (str) => {
    const splitStr = str.split(';');
    const resArr = splitStr.filter((x) => {
        if (x) return x;
    });
    return resArr;
};

export const decode = (string) => {
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

export const count = (target, options) => {
    let original = '' + target; //target is a string type

    options = options || {};

    /**
     * The initial implementation to allow for HTML tags stripping was created
     * @craniumslows while the current one was created by @Rob--W.
     *
     * @see <http://goo.gl/Exmlr>
     * @see <http://goo.gl/gFQQh>
     */

    if (options.stripTags) original = original.replace(/<\/?[a-z][^>]*>/gi, '');

    if (options.ignore) {
        original = original.replace(i, '');
    }

    const trimmed = original.trim();

    /**
     * Most of the performance improvements are based on the works of @epmatsw.
     *
     * @see <http://goo.gl/SWOLB>
     */

    return {
        paragraphs: trimmed ? (trimmed.match(options.hardReturns ? /\n{2,}/g : /\n+/g) || []).length + 1 : 0,
        sentences: trimmed ? (trimmed.match(/[.?!…]+./g) || []).length + 1 : 0,
        words: trimmed ? (trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []).length : 0,
        characters: trimmed ? decode(trimmed.replace(/\s/g, '')).length : 0,
        all: decode(original).length,
    };
};

export const getReadTime = (string) => {
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

export const commaSeparatedStr = (tagArr) => {
    const mappedTagArr = tagArr.map((x) => x.replace(/\W/gi, '_'));
    const joinedArr = mappedTagArr.join();

    return joinedArr;
};

export const socialWindow = (url) => {
    const left = (screen.width - 570) / 2;
    const top = (screen.height - 570) / 2;
    const params = 'menubar=no,toolbar=no,status=no,width=570,height=570,top=' + top + ',left=' + left;
    // NB: Setting 'params' to an empty string will launch
    // content in a new tab or window rather than a pop-up.
    // i.e  =>>> params = "";
    window.open(url, 'NewWindow', params);
};

// export function shareToSocialMedia() {
//     //get options from this
//     const opt = this;

//     /*
// 	Expect properties of opt object
// 	- type (required) [string]
// 	- text (for twitter) [string]
// 	- hashtags (for twitter) [array]
// 	- summary (for linkedin) [string]
// 	- title (for linkedin) [string]
// 	- source (for linkedin) [string]
// 	*/
//     let url;

//     if (!opt) {
//         console.log('SOCIAL MEDIA SHARE ERROR: No object bound to the social media share function');
//         return;
//     }

//     if (!opt.type) {
//         console.log('SOCIAL MEDIA SHARE ERROR: No type found in object');
//         return;
//     }

//     //get the current page url
//     const pageUrl = encodeURIComponent(window.document.URL);

//     if (opt.type === 'facebook') {
//         url = 'https://www.facebook.com/sharer.php?u=' + pageUrl;
//         socialWindow(url);
//     } else if (opt.type === 'twitter') {
//         const preText = opt.text;
//         const text = encodeURIComponent(preText.length > 140 ? preText.slice(0, 130) + '...' : preText);
//         url = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}&hashtags=${opt.hashtags}&via=IamGideonIdoko`;
//         socialWindow(url);
//     } else if (opt.type === 'linkedin') {
//         const title = encodeURIComponent(title);
//         const summary = encodeURIComponent(opt.summary);
//         const source = encodeURIComponent(opt.source);
//         url = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${title}&summary=${summary}&source=${source}`;
//         socialWindow(url);
//     }
// }

export function isConstructor(f) {
    try {
        new f();
    } catch (err) {
        // verify err is the expected error and then
        return false;
    }
    return true;
}

// to get axios header config with access token
export const axiosHeaders = (accessToken?: string) => {
    //get tenant tenantToken from local storage

    // Headers
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // console.log('Axios Config => ', axiosConfig);

    // If tenantToken, add to headers
    if (accessToken) {
        axiosConfig.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return axiosConfig;
};
