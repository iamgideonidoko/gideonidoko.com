import Head from 'next/head';
import { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { getPosts, updatePost, deletePost, resetPostUpdated, resetPostDeleted } from '../../store/actions/postActions';
import styles from '../../styles/ManagePost.module.css';
import swal from 'sweetalert';
import Select from 'react-select';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import MarkdownEditor from '../../components/MarkdownEditor'
import { clearErrors } from '../../store/actions/errorActions';
import { strToSlug, count, getReadTime, separatedStrToArr, convertByteInString } from '../../helper';
import { NextSeo } from 'next-seo';

//get router
import { useRouter } from 'next/router';

const ManagePost = (props) => {
	const router = useRouter();

	const [selectedPost, setSelectedPost] = useState(null);
	const [shouldEditPost, setShouldEditPost] = useState(false);
	const [selectedAssetFile, setSelectedAssetFile] = useState(null);

	const [postTitle, setPostTitle] = useState('');
	const [postCover, setPostCover] = useState('');
	const [postSlug, setPostSlug] = useState('');
	const [postTags, setPostTags] = useState('');
	const [postKeywords, setPostKeywords] = useState('');
	const [postDescription, setPostDescription] = useState('');
	const [shouldPublish, setShouldPublish] = useState(false);
	const [shouldPin, setShouldPin] = useState(false);
	const [shouldDisableComment, setShouldDisableComment] = useState(false);

	//markdonw editor state
	const [markdownText, setMarkdownText] = useState('');
	const [markdownHtml, setMarkdownHtml] = useState('');

	const countObj = count(markdownText);
	const readTimeValue = getReadTime(markdownText);


	if (props.post.isPostUpdated) {
		swal({
	        title: "",
	        text: `Post successfully updated.`,
	        icon: "success",
	        buttons: false
	      }).then(res => {
	      	setPostTitle('');
	      	setPostCover('');
	      	setPostSlug('');
	      	setPostTags('');
	      	setPostKeywords('');
	      	setPostDescription('');
	      	setShouldPublish(false);
	      	setShouldPin(false);
	      	setShouldDisableComment(false);
	      	setMarkdownText('');
	      	setMarkdownHtml('');
	      	setSelectedPost(null);
	      	setShouldEditPost(false);
	      	setSelectedAssetFile(false);
	      });
		props.resetPostUpdated();
	}





	if (props.post.isPostDeleted) {
		swal({
	        title: "",
	        text: `Post successfully deleted.`,
	        icon: "success",
	        buttons: false
	      }).then(res => {
	      	setSelectedPost(null);
	      });
		props.resetPostDeleted();
	}




	const handleMarkdownEditorChange = ({html, text}) => {    
		setMarkdownText(text);
	}






	const handleEditPostFormSubmit = (e) => {
		e.preventDefault();
		props.clearErrors();
		if (!postTitle || !postCover || !postSlug || !markdownText) {
			swal({
		        title: "",
		        text: `The "Title", "Cover Image", and "Post Body" fields must be provided.`,
		        icon: "error",
		        buttons: false
		      });
		} else {
			swal({
				title: "Are you sure about this edit?",
				text: `Do you really want to edit this post "${postTitle}"?`,
				icon: "warning",
				buttons: {
					cancel: "Cancel",
					confirm: {
						text: "Yes, Edit",
						className: "uploadConfirmBtn"
					},
				}
			}).then(willEdit => {
				if (willEdit) {
					const updatedPost = {
						title: postTitle, 
						slug: postSlug, 
						cover_img: postCover, 
						author_username: props.adminuser.username, 
						author_name: props.adminuser.name, 
						body: markdownText, 
						tags: separatedStrToArr(postTags), 
						is_published: shouldPublish, 
						is_pinned: shouldPin, 
						is_comment_disabled: shouldDisableComment, 
						keywords: separatedStrToArr(postKeywords), 
						description: postDescription}
					props.updatePost(selectedPost.value, updatedPost);
				}
			})
		}
	}






	const handleSelectInputChange = option => {
		setSelectedPost(option ? option : null);
	}





	const handleAssetSelectInputChange = option => {
		setSelectedAssetFile(option ? option : null);
	}





	const handleEditPost = () => {
		if (selectedPost) {
			const filteredSelectedPost = props.post.posts.filter(x => x._id === selectedPost.value);
			const fullSelectedPost = filteredSelectedPost[0];
			swal({
				title: "Are you sure about the edit?",
				text: `Are you sure you want to edit the post "${selectedPost.title}" ?`,
				icon: "warning",
				buttons: {
					cancel: "No",
					confirm: {
						text: "Yes, Edit",
						className: "uploadConfirmBtn"
					},
				}
			}).then(willEdit => {
				if (willEdit) {
					//change the values in the edit post form
					setPostTitle(fullSelectedPost.title ? fullSelectedPost.title : '');
					setPostCover(fullSelectedPost.cover_img ? fullSelectedPost.cover_img : '');
					setPostSlug(fullSelectedPost.slug ? fullSelectedPost.slug : '');
					setPostTags(fullSelectedPost.tags ? fullSelectedPost.tags.join(";") : '');
					setPostKeywords(fullSelectedPost.keywords ? fullSelectedPost.keywords.join(";") : '');
					setPostDescription(fullSelectedPost.description ? fullSelectedPost.description : '');
					setShouldPublish(fullSelectedPost.is_published ? fullSelectedPost.is_published : false);
					setShouldPin(fullSelectedPost.is_pinned ? fullSelectedPost.is_pinned : false);
					setShouldDisableComment(fullSelectedPost.is_comment_disabled ? fullSelectedPost.is_comment_disabled : false);
					setMarkdownText(fullSelectedPost.body ? fullSelectedPost.body : '');

					setShouldEditPost(true);
				} else {
				}
			})
		} else {
			swal({
				title: "No post selected.",
				text: `Please select a post.`,
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






	const handleDeletePost = () => {
		if (selectedPost) {
			swal({
				title: "Are you sure about the delete?",
				text: `Are you sure you want to delete the post "${selectedPost.label}" ?`,
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
					props.deletePost(selectedPost.value);
				}
			})

		} else {
			swal({
				title: "No post selected.",
				text: `Please select a post.`,
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





	const handleCancelEditPost = () => {
		swal({
				title: "",
				text: `Do you really want to cancel editing this post "${selectedPost.title}" ?`,
				icon: "warning",
				buttons: {
					cancel: "No",
					confirm: {
						text: "Yes, Cancel",
						className: "uploadConfirmBtn"
					},
				}
			}).then(willCancel => {
				if (willCancel) {
					//change the values in the edit post form
					setPostTitle('');
					setPostCover('');
					setPostSlug('');
					setPostTags('');
					setPostKeywords('');
					setPostDescription('');
					setShouldPublish(false);
					setShouldPin(false);
					setShouldDisableComment(false);
					setMarkdownText('');
					setSelectedPost(null);
					setSelectedAssetFile(null);
					setShouldEditPost(false);
				}
			})

	}







	///when the copy button is clicked
	const handleCopyBtnClick = () => {
		if (selectedAssetFile) {
			copy(selectedAssetFile.value)
			swal({
		        title: "",
		        text: `"Copied "${selectedAssetFile.value}"`,
		        icon: "success",
		        buttons: false
		      });
		} else {
			swal({
		        title: "",
		        text: `No asset file is selected.`,
		        icon: "error",
		        buttons: false
		      });
		}
	}





	return (
		<Fragment>
			<NextSeo noindex={true} nofollow={true} />
			<Head>
				<title>Manage Post - Gideon Idoko</title>
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
				{ /*MANAGE POST PAGE*/}
					<div className={styles.managePostWrap}>

						<h1>Manage Post</h1>
						<p>Select a post to manage. You can only manage posts created by you.</p>


						<div className={styles.managePostForm}>

						<Select
							className="managePostFormSelect"
							defaultValue={selectedPost}
							value={selectedPost}
							classNamePrefix="reactSelect"
							options={props.post.posts.filter(post => post.author_username === props.adminuser.username).map(({ title, _id, created_at }) =>  ({ value: _id, label: `${title} (${moment(created_at).format('MMM DD, YYYY')})`, title }))}
							onChange={handleSelectInputChange}
							isClearable={true}
							isSearchable={true}
							placeholder="Select a post..."
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

						 <div className={styles.actionBtnsWrapper} style={{display: shouldEditPost ? "none" : "block"}}>
							 <button className={styles.editPostBtn} onClick={handleEditPost}>Edit Post</button>
							 <button className={styles.deletePostBtn} onClick={handleDeletePost}>Delete Post</button>
						 </div>
							
						</div>
						{
						(selectedPost && shouldEditPost) && <div className={styles.editPostWrapper}>
						<h2 className={styles.editPostWrapperHeadTxt}>Edit Post: "{selectedPost.title}"</h2>
						<hr style={{ opacity: "0.7" }} />
						<h4 className={styles.copyAssetHead}>Copy Asset</h4>
						<div className={styles.assetFormSelectWrap}>
						<Select
								className="assetFormSelect"
								defaultValue={selectedAssetFile}
								value={selectedAssetFile}
								classNamePrefix="reactSelect"
								options={props.assets.map(({ name, url, size }) =>  ({ value: url, label: `${name} (${convertByteInString(size)})`}))}
								onChange={handleAssetSelectInputChange}
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
							 <button onClick={handleCopyBtnClick} className={styles.assetCopyBtn}><i className="neu-copy"></i></button>
						</div>
						<hr style={{ opacity: "0.7" }} />


						{
							/* Edit post form*/
						}


						<form action="" className={styles.editPostForm} onSubmit={handleEditPostFormSubmit}>
							<div className={styles.postMetaInfo}>
								
							<div className={`${styles.postTitleWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Title</h4>
									<span>Title should be as brief as possible.</span>
								</label>
								<input type="text" value={postTitle} onChange={e => {
									setPostTitle(e.target.value); 
									setPostSlug(strToSlug(e.target.value));
								}} placeholder="Post title..." required />
							</div>
							<div className={`${styles.postCoverWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Cover Image</h4>
									<span>Link to the post cover.</span>
								</label>
								<input type="text" value={postCover} onChange={e => setPostCover(e.target.value)} placeholder="Link to cover image..." required />
							</div>
							<div className={`${styles.postSlugWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Post Slug</h4>
									<span>The slug is the link to the post (auto-generated).</span>
								</label>
								<input type="text" value={postSlug} onChange={e => setPostSlug(e.target.value)} placeholder="post slug..." />
							</div>
							<div className={`${styles.postTagsWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Tag</h4>
									<span>Enter tags in semi-colon separated format.</span>
								</label>
								<input type="text" value={postTags} onChange={e => setPostTags(e.target.value)} placeholder="Tags in semi-colon separated format..." />
							</div>
							<div className={`${styles.postKeywordsWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Keywords</h4>
									<span>Enter keywords in semi-colon separated format.</span>
								</label>
								<input type="text" value={postKeywords} onChange={e => setPostKeywords(e.target.value)} placeholder="Keywords in semi-colon separated format..." />
							</div>
							<div className={`${styles.postDescriptionWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Description</h4>
									<span>This is the content description for the post.</span>
								</label>
								<input type="text" value={postDescription} onChange={e => setPostDescription(e.target.value)} placeholder="Post content description..." />
							</div>
							</div>

							<MarkdownEditor textValue={markdownText} handleMarkdownEditorChange={handleMarkdownEditorChange} />

							<div className={styles.blogPostStats}>
								<h4>Post Stats</h4>
								<ul>
									<li>Number of paragraphs: <b>{countObj.paragraphs}</b>.</li>
									<li>Number of sentences: <b>{countObj.sentences}</b>.</li>
									<li>Number of words: <b>{countObj.words}</b>.</li>
									<li>Number of characters: <b>{countObj.characters}</b>.</li>
									<li>Total Number of characters: <b>{countObj.all}</b>.</li>
									<li>Read Time: <b>{readTimeValue}</b>.</li>
								</ul>
							</div>

							<div className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Publish Post</h4>
									<span>Should this post be automatically published?</span>
								</label>
								<input type="checkbox" checked={shouldPublish} className={styles.shouldPublishCheckbox} id="shouldPublishCheckbox" onChange={e => setShouldPublish(e.target.checked)} /> <label className={styles.checkboxText} htmlFor="shouldPublishCheckbox"> {shouldPublish ? "Yes" : "No"} </label> 
							</div>
							<div className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Pin Post</h4>
									<span>Should this post be pinned to blog home page?</span>
								</label>
								<input type="checkbox" checked={shouldPin} className={styles.shouldPinCheckbox} id="shouldPinCheckbox" onChange={e => setShouldPin(e.target.checked)} /> <label className={styles.checkboxText} htmlFor="shouldPinCheckbox"> {shouldPin ? "Yes" : "No"} </label> 
							</div>
							<div className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}>
								<label>
									<h4>Disable Comment</h4>
									<span>Should this post's comment be disabled?</span>
								</label>
								<input type="checkbox" checked={shouldDisableComment} className={styles.shouldDisableCommentCheckbox} id="shouldDisableCommentCheckbox" onChange={e => setShouldDisableComment(e.target.checked)} /> <label className={styles.checkboxText} htmlFor="shouldDisableCommentCheckbox"> {shouldDisableComment ? "Yes" : "No"} </label> 
							</div>
							<div className={`${styles.postEditPostBtnWrap} ${styles.editFormDivChild}`}>
								<button type="submit">Edit Post</button>
								<button type="button" onClick={handleCancelEditPost}>Cancel Edit</button>
							</div>
						</form>

							</div>

						}


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
	adminuser: state.auth.adminuser,
	assets: state.asset.assets

})

export default connect(mapStateToProps, { getPosts, clearErrors, updatePost, resetPostUpdated, deletePost, resetPostDeleted })(ManagePost);

