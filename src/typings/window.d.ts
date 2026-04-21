/* eslint-disable @typescript-eslint/no-unused-vars */
import Lenis from 'lenis';
class Scrambler {
  constructor() {}

  scramble(text: string, setText: React.Dispatch<React.SetStateAction<null>>) {}
}
declare global {
  interface Window {
    Scrambler: typeof Scrambler;
    appLenis?: Lenis;
  }
  declare module '*.glsl' {
    const file: string;
    export default file;
  }
}
