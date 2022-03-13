/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
class Scrambler {
    constructor() {}

    scramble(text: string, setText: React.Dispatch<React.SetStateAction<null>>) {}
}
declare interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    firebase: any;
    isFirebaseInitialized: boolean;
    Scrambler: typeof Scrambler;
}
