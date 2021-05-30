import Head from 'next/head';
import React from 'react';
import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../store/actions/postActions';
import { deleteAsset } from '../../store/actions/assetActions';
import styles from '../../styles/DeleteAsset.module.css';
import Select from 'react-select';
import { convertByteInString } from '../../helper';
import swal from 'sweetalert';
import { NextSeo } from 'next-seo';

//get router
import { useRouter } from 'next/router';

const DeleteAsset = (props) => {
	const router = useRouter();

	const [selectedAssetFile, setSelectedAssetFile] = useState(null);
	const [showAsset, setShowAsset] = useState(false);

	const handleSelectInputChange = option => {
		setSelectedAssetFile(option ? option : null);
		setShowAsset(false);
	}

	const handleViewAsset = () => {
		if (selectedAssetFile) {
			setShowAsset(true);
		} else {
			setShowAsset(false);
			swal({
				title: "No asset selected.",
				text: `Please select an asset.`,
				icon: "error",
				buttons: {
					confirm: {
						text: "Ok",
						className: "uploadConfirmBtn"
					}
				}

			})
		}
	}

	const handleDeleteAsset = () => {
		if (selectedAssetFile) {
			swal({
				title: "Are you sure about the delete?",
				text: `Are you sure you want to delete the asset "${selectedAssetFile.label}" ?`,
				icon: "warning",
				buttons: {
					cancel: "No",
					confirm: {
						text: "Yes, Delete",
						className: "deleteConfirmBtn"
					},
				}
			}).then(willDelete => {
				if (willDelete) {

					const storageRef = props.projectStorage.ref(selectedAssetFile.value);

					storageRef.delete()
						.then(() => {
							props.deleteAsset(selectedAssetFile.assetId);
							swal({
						        title: "",
						        text: `"${selectedAssetFile.label}" has been deleted successfully.`,
						        icon: "success",
						        buttons: false
						      });
							setSelectedAssetFile(null);
						}).catch((error) => {
							swal({
						        title: "",
						        text: `An error occured.`,
						        icon: "error",
						        buttons: false
						      });
							console.log("ASSET DELETE ERROR: ", error);
						});

					setShowAsset(false);
				} else {
				}
			})

		} else {
			swal({
				title: "No asset selected.",
				text: `Please select an asset.`,
				icon: "error",
				buttons: {
					confirm: {
						text: "Ok",
						className: "uploadConfirmBtn"
					}
				}

			})
		}
	}

	return (
		<Fragment>
			<NextSeo noindex={true} nofollow={true} />
			<Head>
				<title>Delete Asset - Gideon Idoko</title>
			</Head>
			<main className={`padding-top-10rem`}>
				<div className="container-max-1248px">
				
				{
					!props.isAuthenticated ? (<Fragment>
					{
						!props.isAdminUserLoaded ? (<div>
							<div className="complex-loader-wrap">
						        <div className="complex-loader"></div>
						    </div>
							<p style={{textAlign: 'center'}}>Loading...</p>
						</div>) : (<Fragment>
							{!props.isAuthenticated && (<div className={`loginRedirectMsg`}>
							<h1>You are not logged in.</h1>
							<p>Redirecting to login page...</p>
							{ typeof window !== 'undefined' && window.setTimeout(() => {router.push('/login')}, 3000)}
						</div>)}
						</Fragment>)

					}
						
					</Fragment>) : (<Fragment>
				{ /*DELETE ASSET PAGE*/}
					<div className={styles.deleteAssetWrap}>
						<h1>Delete Asset</h1>
						<p>Select asset to view or delete below. You can only delete assets uploaded by you.</p>

						<div className={styles.deleteAssetForm}>

						<Select
							className="deleteAssetFormSelect"
							defaultValue={selectedAssetFile}
							value={selectedAssetFile}
							classNamePrefix="reactSelect"
							options={props.assets.filter(asset => asset.author_username === props.adminuser.username).map(({ name, url, size, _id }) =>  ({ value: name, label: `${name} (${convertByteInString(size)})`, url, assetId: _id }))}
							onChange={handleSelectInputChange}
							isClearable={true}
							isSearchable={true}
							placeholder="Select an asset..."
							styles={{
								menu: (provided, state) => ({
									
									backgroundColor: "var(--bg-color)",
									border: "1px solid var(--neutral-color-2)"
								}),
								option: (styles, { isSelected }) => {

									return { 
										...styles,
										backgroundColor: isSelected ? 'var(--pri-blue-normal) !important' : null 
									}
								}
							}}
						 />

						 <div className={styles.actionBtnsWrapper}>
							 <button className={styles.viewAssetBtn} onClick={handleViewAsset}>View Asset</button>
							 <button className={styles.deleteAssetBtn} onClick={handleDeleteAsset}>Delete Asset</button>
						 </div>

						 <div className={styles.assetDisplayWrap}>
						 	{ (selectedAssetFile && showAsset) ? <div className={styles.assetDisplay}><img src={selectedAssetFile.url} alt={selectedAssetFile.label} /></div> : null }
						 	
						 </div>

							
						</div>
					</div>
					</Fragment>)

				}
					
				</div>
			</main>
		</Fragment>
	)
}



const mapStateToProps = (state) => ({
	post: state.post,
	isAuthenticated: state.auth.isAuthenticated,
	isAdminUserLoaded: state.auth.isAdminUserLoaded,
	assets: state.asset.assets,
	projectStorage: state.fire.firebaseStorage,
	adminuser: state.auth.adminuser
})

export default connect(mapStateToProps, { getPosts, deleteAsset })(DeleteAsset);

