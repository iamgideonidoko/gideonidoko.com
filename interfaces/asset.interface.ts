import { Dispatch, SetStateAction } from 'react';

export interface IProgressBar {
    file: File;
    setFile: Dispatch<SetStateAction<File | null>>;
    setStartDownload: Dispatch<SetStateAction<boolean>>;
}
