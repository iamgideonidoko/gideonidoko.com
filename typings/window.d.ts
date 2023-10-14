/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Lenis from '@studio-freight/lenis';
class Scrambler {
    constructor() {}

    scramble(text: string, setText: React.Dispatch<React.SetStateAction<null>>) {}
}
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        firebase: any;
        isFirebaseInitialized: boolean;
        Scrambler: typeof Scrambler;
        lenis?: Lenis;
    }
    declare module '*.glsl' {
        const file: string;
        export default file;
    }
}
