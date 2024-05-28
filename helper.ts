import { CountOptions } from './interfaces/helper.interface';
import * as THREE from 'three';

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

  return roundedMinutes < 1 ? seconds + ' sec read' : roundedMinutes + ' min read';
};

export const commaSeparatedStr = (tagArr: string[]) => {
  const mappedTagArr = tagArr.map((x) => x.replace(/\W/gi, '_'));
  const joinedArr = mappedTagArr.join();

  return joinedArr;
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
