import { useState, useEffect } from 'react';
import { renameFileWithPrefix, authPost } from '../../helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStorage = (file: File, projectStorage: any, currentAdminUsername: string, currentAdminName: string) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        //get a new filename
        const newFileName = renameFileWithPrefix(file.name);

        //references
        const storageRef = projectStorage.ref(newFileName);

        storageRef.put(file).on(
            'state_changed',
            (snap: { bytesTransferred: number; totalBytes: number }) => {
                const percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                setProgress(percentage);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err: any) => {
                setError(err);
            },
            async () => {
                try {
                    const url = await storageRef.getDownloadURL();
                    const newAsset = {
                        name: newFileName,
                        url,
                        size: file.size,
                        file_type: file.type,
                        author_username: currentAdminUsername,
                        author_name: currentAdminName,
                    };
                    await authPost(`/asset`, newAsset);
                    setUrl(url);
                } catch (err) {
                    console.error('Firbase upload error => ', err);
                }
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    return { progress, url, error };
};

export default useStorage;
