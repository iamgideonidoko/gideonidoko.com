import { Fragment, useState, useEffect } from 'react';
import styles from '../../styles/UploadAsset.module.css';
import { NextSeo } from 'next-seo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

//get router
import { useRouter } from 'next/router';

import swal from 'sweetalert';

import ProgressBar from '../../components/ProgressBar';

const UploadAsset = ({}) => {
    const router = useRouter();

    const auth = useSelector(({ auth }: RootState) => auth);

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [startDownload, setStartDownload] = useState(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

    const fileChangeHandler = async (e: React.FormEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement)?.files;

        if (files) {
            const selected = files[0];
            if (selected && allowedFileTypes.includes(selected.type)) {
                setFile(selected);
                setError('');
                try {
                    const willUpload = await swal({
                        title: 'Are you sure about this upload?',
                        text: `Are you sure you want to upload "${selected.name}" ?`,
                        icon: 'warning',
                        buttons: {
                            cancel: true,
                            confirm: {
                                text: 'Yes, Upload',
                                className: 'uploadConfirmBtn',
                            },
                        },
                    });
                    if (willUpload) {
                        setStartDownload(true);
                    } else {
                        setStartDownload(false);
                        setFile(null);
                    }
                } catch (err) {}
            } else {
                setFile(null);
                setError('Please select an image file (png, jpeg or gif)');
                await swal({
                    title: '',
                    text: `Please select an image file (png, jpeg or gif).`,
                    icon: 'error',
                    buttons: {
                        confirm: {
                            text: 'Ok',
                            className: 'uploadConfirmBtn',
                        },
                    },
                });
                setError('');
            }
        }
    };

    return (
        <Fragment>
            <NextSeo title="Upload Asset - Gideon Idoko" noindex={true} nofollow={true} />
            {loaded && (
                <main className={`padding-top-10rem`}>
                    <div className="container-max-1248px">
                        {!auth.isAuthenticated ? (
                            <div>
                                <div className="loginRedirectMsg">
                                    <h1>You are not logged in.</h1>
                                    <p>Redirecting to login page...</p>
                                    {typeof window !== 'undefined' &&
                                        window.setTimeout(() => {
                                            router.push('/login');
                                        }, 3000)}
                                </div>
                            </div>
                        ) : (
                            <Fragment>
                                {/*UPLOAD ASSET PAGE*/}
                                <div className={styles.uploadAssetWrap}>
                                    <h1>Upload Asset</h1>
                                    <p>Click on the upload icon to initiate a file upload.</p>

                                    <form className={styles.fileUploadForm}>
                                        <label htmlFor="fileUploadInput" className={styles.uploadInitiator}>
                                            <i className="neu-up-md"></i>
                                        </label>
                                        <br />
                                        <input
                                            type="file"
                                            id="fileUploadInput"
                                            className={styles.fileUploadInput}
                                            onChange={fileChangeHandler}
                                        />
                                        <div className={styles.output}>
                                            {error && <div className={styles.uploadErrorMsg}>{error}</div>}
                                            {file && (
                                                <div className={styles.selectFileName}>Selected file: {file.name}</div>
                                            )}
                                            {file && startDownload ? (
                                                <ProgressBar
                                                    file={file}
                                                    setFile={setFile}
                                                    setStartDownload={setStartDownload}
                                                />
                                            ) : null}

                                            {/*
                                    
                                */}
                                        </div>
                                    </form>
                                </div>
                            </Fragment>
                        )}
                    </div>
                </main>
            )}
        </Fragment>
    );
};

export default UploadAsset;
