import React, { useEffect } from 'react';
import useStorage from '../firebase/hooks/useStorage';
import swal from 'sweetalert';
import styles from '../styles/UploadAsset.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IProgressBar } from '../interfaces/asset.interface';

const ProgressBar = ({ file, setFile, setStartDownload }: IProgressBar) => {
    const auth = useSelector(({ auth }: RootState) => auth);

    const currentAdminUsername = auth.userInfo?.user?.username;
    const currentAdminName = auth.userInfo?.user?.name;
    const projectStorage = window.firebase?.storage();

    const { progress, url, error } = useStorage(
        file,
        projectStorage,
        currentAdminUsername as string,
        currentAdminName as string,
    );

    useEffect(() => {
        if (error) {
            swal({
                title: 'Opps',
                text: `"Something went wrong. Try again.`,
                icon: 'error',
                buttons: [false, false],
            });
            setFile(null);
            setStartDownload(false);
        } else if (url) {
            swal({
                title: '',
                text: `"${file.name}" has been uploaded successfully.`,
                icon: 'success',
                buttons: [false, false],
            });
            setFile(null);
            setStartDownload(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, setFile]);

    return (
        <div className={styles.fileUploadProgressBar}>
            <div style={{ width: progress + '%' }}></div>
        </div>
    );
};

export default ProgressBar;
