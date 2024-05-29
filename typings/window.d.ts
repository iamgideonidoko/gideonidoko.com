/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Lenis from '@studio-freight/lenis';
class Scrambler {
  constructor() {}

  scramble(text: string, setText: React.Dispatch<React.SetStateAction<null>>) {}
}
declare global {
  interface Window {
    Scrambler: typeof Scrambler;
    lenis?: Lenis;
  }
  declare module '*.glsl' {
    const file: string;
    export default file;
  }
}
