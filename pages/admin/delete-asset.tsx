/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import styles from '../../styles/DeleteAsset.module.css';
import { SingleValue } from 'react-select';
import { authDelete, authGet, convertByteInString } from '../../helper';
import swal from 'sweetalert';
import { NextSeo } from 'next-seo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useRouter } from 'next/router';
import AsyncSelect from 'react-select/async';
import { Asset } from '../../interfaces/helper.interface';

const DeleteAsset = ({}) => {
    const router = useRouter();
    const auth = useSelector(({ auth }: RootState) => auth);

    const [selectedAssetFile, setSelectedAssetFile] = useState<{
        value: string;
        label: string;
        url: string;
        assetId: string;
    } | null>(null);
    const [showAsset, setShowAsset] = useState(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [assetOptions, setAssetOptions] = useState<Asset[]>([]);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const handleSelectInputChange = (
        option: SingleValue<{ label: string; value: string; url: string; assetId: string }>,
    ) => {
        setSelectedAssetFile(option ? option : null);
        setShowAsset(false);
    };

    const handleViewAsset = () => {
        if (selectedAssetFile) {
            setShowAsset(true);
        } else {
            setShowAsset(false);
            swal({
                title: 'No asset selected.',
                text: `Please select an asset.`,
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        className: 'uploadConfirmBtn',
                    },
                },
            });
        }
    };

    const handleDeleteAsset = async () => {
        if (selectedAssetFile) {
            try {
                const willDelete = await swal({
                    title: 'Are you sure about the delete?',
                    text: `Are you sure you want to delete the asset "${selectedAssetFile.label}" ?`,
                    icon: 'warning',
                    buttons: {
                        cancel: true,
                        confirm: {
                            text: 'Yes, Delete',
                            className: 'deleteConfirmBtn',
                        },
                    },
                });

                if (willDelete) {
                    const projectStorage = window.firebase?.storage();
                    const storageRef = projectStorage.ref(selectedAssetFile.value);

                    try {
                        await storageRef.delete();
                        await authDelete(`/asset/${selectedAssetFile.assetId}`);
                        swal({
                            title: '',
                            text: `"${selectedAssetFile.label}" has been deleted successfully.`,
                            icon: 'success',
                            buttons: [false, false],
                        });
                        setSelectedAssetFile(null);
                    } catch (err) {
                        swal({
                            title: '',
                            text: `An error occured.`,
                            icon: 'error',
                            buttons: [false, false],
                        });
                        console.error('Firebase delete error => ', err);
                    }

                    setShowAsset(false);
                }
            } catch (err) {
                console.error('Firebase error => ', err);
            }
        } else {
            swal({
                title: 'No asset selected.',
                text: `Please select an asset.`,
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        className: 'uploadConfirmBtn',
                    },
                },
            });
        }
    };

    let assetFetchTimer: ReturnType<typeof setTimeout>;

    const getAssets = (inputValue: string): Promise<Asset[]> => {
        return new Promise<Asset[]>(async (resolve) => {
            if (inputValue.length < 2) return;
            clearTimeout(assetFetchTimer);
            assetFetchTimer = setTimeout(async () => {
                try {
                    const res = await authGet(`/assets/search?q=${inputValue}`);
                    setAssetOptions(res?.data?.assets || []);
                    const options =
                        res?.data?.assets?.map(({ name, url, size, _id }: Asset) => ({
                            value: name,
                            label: `${name} (${convertByteInString(size)})`,
                            url,
                            assetId: _id && _id,
                        })) || [];
                    resolve(options);
                } catch (err) {
                    console.error('Asset Search Error => ', err);
                    resolve([]);
                }
            }, 1500);
        });
    };

    return (
        <Fragment>
            <NextSeo title="Delete Asset - Gideon Idoko" noindex={true} nofollow={true} />
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
                                {/*DELETE ASSET PAGE*/}
                                <div className={styles.deleteAssetWrap}>
                                    <h1>Delete Asset</h1>
                                    <p>
                                        Select asset to view or delete below. You can only delete assets uploaded by
                                        you.
                                    </p>

                                    <div className={styles.deleteAssetForm}>
                                        <AsyncSelect
                                            className="assetFormSelect"
                                            value={selectedAssetFile}
                                            cacheOptions
                                            defaultOptions={assetOptions.map(({ name, url, size, _id }) => ({
                                                value: url,
                                                label: `${name} (${convertByteInString(size)})`,
                                                url,
                                                assetId: _id as string,
                                            }))}
                                            classNamePrefix="reactSelect"
                                            onChange={handleSelectInputChange}
                                            loadOptions={getAssets}
                                            placeholder="Type to search for asset..."
                                            styles={{
                                                menu: () => ({
                                                    backgroundColor: 'var(--bg-color)',
                                                    border: '1px solid var(--neutral-color-2)',
                                                }),
                                                option: (styles, { isSelected }) => {
                                                    return {
                                                        ...styles,
                                                        backgroundColor: isSelected
                                                            ? 'var(--pri-blue-normal) !important'
                                                            : undefined,
                                                    };
                                                },
                                            }}
                                        />

                                        <div className={styles.actionBtnsWrapper}>
                                            <button className={styles.viewAssetBtn} onClick={handleViewAsset}>
                                                View Asset
                                            </button>
                                            <button className={styles.deleteAssetBtn} onClick={handleDeleteAsset}>
                                                Delete Asset
                                            </button>
                                        </div>

                                        <div className={styles.assetDisplayWrap}>
                                            {selectedAssetFile && showAsset ? (
                                                <div className={styles.assetDisplay}>
                                                    <img src={selectedAssetFile.url} alt={selectedAssetFile.label} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </div>
                </main>
            )}
        </Fragment>
    );
};

export default DeleteAsset;
