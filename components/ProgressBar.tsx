import React, { useEffect } from 'react';
import useStorage from '../firebase/hooks/useStorage';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import { addAsset } from '../store/actions/assetActions';
import styles from '../styles/UploadAsset.module.css';

const ProgressBar = ({ file, setFile, setStartDownload, projectStorage, addAsset, adminuser }) => {
    const currentAdminUsername = adminuser.username;
    const currentAdminName = adminuser.name;

    const { progress, url, error } = useStorage(file, projectStorage, addAsset, currentAdminUsername, currentAdminName);

    // console.log("Upload progress", progress);
    // console.log("Upload Url", url);

    useEffect(() => {
        if (error) {
            swal({
                title: 'Opps',
                text: `"Something went wrong. Try again.`,
                icon: 'error',
                buttons: false,
            });
            setFile(null);
            setStartDownload(false);
        } else if (url) {
            swal({
                title: '',
                text: `"${file.name}" has been uploaded successfully.`,
                icon: 'success',
                buttons: false,
            });
            setFile(null);
            setStartDownload(false);
        }
    }, [url, setFile]);

    return (
        <div className={styles.fileUploadProgressBar}>
            <div style={{ width: progress + '%' }}></div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    projectStorage: state.fire.firebaseStorage,
    adminuser: state.auth.adminuser,
});

export default connect(mapStateToProps, { addAsset })(ProgressBar);
