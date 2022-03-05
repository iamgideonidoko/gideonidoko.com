import Head from 'next/head';
import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../store/actions/postActions';
import styles from '../../styles/UploadAsset.module.css';
import { NextSeo } from 'next-seo';

//get router
import { useRouter } from 'next/router';

import swal from 'sweetalert';

import ProgressBar from '../../components/ProgressBar';

const UploadAsset = (props) => {
    const router = useRouter();

    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [startDownload, setStartDownload] = useState(false);

    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

    const fileChangeHandler = (e) => {
        const selected = e.target.files[0];

        if (selected && allowedFileTypes.includes(selected.type)) {
            setFile(selected);
            setError(null);
            swal({
                title: 'Are you sure about this upload?',
                text: `Are you sure you want to upload "${selected.name}" ?`,
                icon: 'warning',
                buttons: {
                    cancel: 'Cancel',
                    confirm: {
                        text: 'Yes, Upload',
                        className: 'uploadConfirmBtn',
                    },
                },
            }).then((willUpload) => {
                if (willUpload) {
                    setStartDownload(true);
                } else {
                    setStartDownload(false);
                    setFile(null);
                }
            });
        } else {
            setFile(null);
            setError('Please select an image file (png, jpeg or gif)');
            swal({
                title: '',
                text: `Please select an image file (png, jpeg or gif).`,
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        className: 'uploadConfirmBtn',
                    },
                },
            }).then((opt) => {
                setError(null);
            });
        }
    };

    return (
        <Fragment>
            <NextSeo noindex={true} nofollow={true} />
            <Head>
                <title>Upload Asset - Gideon Idoko</title>
            </Head>
            <main className={`padding-top-10rem`}>
                <div className="container-max-1248px">
                    {!props.isAuthenticated ? (
                        <Fragment>
                            {!props.isAdminUserLoaded ? (
                                <div>
                                    <div className="complex-loader-wrap">
                                        <div className="complex-loader"></div>
                                    </div>
                                </div>
                            ) : (
                                <Fragment>
                                    {!props.isAuthenticated && (
                                        <div className={`loginRedirectMsg`}>
                                            <h1>You are not logged in.</h1>
                                            <p>Redirecting to login page...</p>
                                            {typeof window !== 'undefined' &&
                                                window.setTimeout(() => {
                                                    router.push('/login');
                                                }, 3000)}
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
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
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    post: state.post,
    isAuthenticated: state.auth.isAuthenticated,
    isAdminUserLoaded: state.auth.isAdminUserLoaded,
    projectStorage: state.fire.firebaseStorage,
});

export default connect(mapStateToProps, { getPosts })(UploadAsset);
