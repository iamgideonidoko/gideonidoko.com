// import Head from 'next/head';
// import { useState, Fragment } from 'react';
// import { connect } from 'react-redux';
// import { getPosts, addPost, resetPostCreated } from '../../store/actions/postActions';
// import { clearErrors } from '../../store/actions/errorActions';
// import styles from '../../styles/CreatePost.module.css';
// import MarkdownEditor from '../../components/MarkdownEditor';
// import Select from 'react-select';
// import { separatedStrToArr, count, getReadTime, convertByteInString, strToSlug } from '../../helper';
// import swal from 'sweetalert';
// import copy from 'copy-to-clipboard';
// import { NextSeo } from 'next-seo';

// //get router
// import { useRouter } from 'next/router';

// const CreatePost = (props) => {
//     const router = useRouter();

//     const [selectedAssetFile, setSelectedAssetFile] = useState(null);

//     const [postTitle, setPostTitle] = useState('');
//     const [postCover, setPostCover] = useState('');
//     const [postSlug, setPostSlug] = useState('');
//     const [postTags, setPostTags] = useState('');
//     const [postKeywords, setPostKeywords] = useState('');
//     const [postDescription, setPostDescription] = useState('');
//     const [shouldPublish, setShouldPublish] = useState(false);
//     const [shouldPin, setShouldPin] = useState(false);
//     const [shouldDisableComment, setShouldDisableComment] = useState(false);

//     //markdonw editor state
//     const [markdownText, setMarkdownText] = useState('');
//     const [markdownHtml, setMarkdownHtml] = useState('');

//     const countObj = count(markdownText);
//     const readTimeValue = getReadTime(markdownText);

//     if (props.post.isPostCreated) {
//         swal({
//             title: '',
//             text: `Post successfully created.`,
//             icon: 'success',
//             buttons: false,
//         }).then((res) => {
//             setPostTitle('');
//             setPostCover('');
//             setPostSlug('');
//             setPostTags('');
//             setPostKeywords('');
//             setPostDescription('');
//             setShouldPublish(false);
//             setShouldPin(false);
//             setMarkdownText('');
//             setMarkdownHtml('');
//         });
//         props.resetPostCreated();
//     }

//     if (props.errorMsg.errorType && props.errorMsg.errorType === 'TITLE_ALREADY_EXISTS') {
//         swal({
//             title: 'Post already exists.',
//             text: `A post with the same title "${postTitle}" already exists."`,
//             icon: 'error',
//             buttons: false,
//         });
//         props.clearErrors();
//     }

//     const handleSelectInputChange = (option) => {
//         setSelectedAssetFile(option ? option : null);
//     };

//     const handleCopyBtnClick = () => {
//         if (selectedAssetFile) {
//             copy(selectedAssetFile.value);
//             swal({
//                 title: '',
//                 text: `"Copied "${selectedAssetFile.value}"`,
//                 icon: 'success',
//                 buttons: false,
//             });
//         } else {
//             swal({
//                 title: '',
//                 text: `No asset file is selected.`,
//                 icon: 'error',
//                 buttons: false,
//             });
//         }
//     };

//     const handleMarkdownEditorChange = ({ html, text }) => {
//         setMarkdownText(text);
//     };

//     function createMarkup() {
//         return { __html: markdownHtml };
//     }

//     const handleCreatePostFormSubmit = (e) => {
//         e.preventDefault();
//         props.clearErrors();
//         if (!postTitle || !postCover || !postSlug || !markdownText) {
//             swal({
//                 title: '',
//                 text: `The "Title", "Cover Image", and "Post Body" fields must be provided.`,
//                 icon: 'error',
//                 buttons: false,
//             });
//         } else {
//             swal({
//                 title: 'Are you sure about this creation?',
//                 text: `Do you really want to create this post "${postTitle}"?`,
//                 icon: 'warning',
//                 buttons: {
//                     cancel: 'Cancel',
//                     confirm: {
//                         text: 'Yes, Create',
//                         className: 'uploadConfirmBtn',
//                     },
//                 },
//             }).then((willCreate) => {
//                 if (willCreate) {
//                     const newPost = {
//                         title: postTitle,
//                         slug: postSlug,
//                         cover_img: postCover,
//                         author_username: props.adminuser.username,
//                         author_name: props.adminuser.name,
//                         body: markdownText,
//                         tags: separatedStrToArr(postTags),
//                         is_published: shouldPublish,
//                         is_pinned: shouldPin,
//                         is_comment_disabled: shouldDisableComment,
//                         keywords: separatedStrToArr(postKeywords),
//                         description: postDescription,
//                     };
//                     props.addPost(newPost);
//                 }
//             });
//         }
//     };

//     return (
//         <Fragment>
//             <NextSeo noindex={true} nofollow={true} />
//             <Head>
//                 <title>Create Post - Gideon Idoko</title>
//             </Head>
//             <main className={`padding-top-10rem`}>
//                 <div className="container-max-1248px">
//                     {!props.isAuthenticated ? (
//                         <Fragment>
//                             {!props.isAdminUserLoaded ? (
//                                 <div>
//                                     <div className="complex-loader-wrap">
//                                         <div className="complex-loader"></div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <Fragment>
//                                     {!props.isAuthenticated && (
//                                         <div className={`loginRedirectMsg`}>
//                                             <h1>You are not logged in.</h1>
//                                             <p>Redirecting to login page...</p>
//                                             {typeof window !== 'undefined' &&
//                                                 window.setTimeout(() => {
//                                                     router.push('/login');
//                                                 }, 3000)}
//                                         </div>
//                                     )}
//                                 </Fragment>
//                             )}
//                         </Fragment>
//                     ) : (
//                         <Fragment>
//                             {/*CREATE POST PAGE*/}
//                             <div className={styles.createPostWrap}>
//                                 <h1 className={styles.pageTitle}>Create Post</h1>
//                                 <hr style={{ opacity: '0.7' }} />
//                                 <h4 className={styles.copyAssetHead}>Copy Asset</h4>
//                                 <div className={styles.assetFormSelectWrap}>
//                                     <Select
//                                         className="assetFormSelect"
//                                         defaultValue={selectedAssetFile}
//                                         value={selectedAssetFile}
//                                         classNamePrefix="reactSelect"
//                                         options={props.assets.map(({ name, url, size }) => ({
//                                             value: url,
//                                             label: `${name} (${convertByteInString(size)})`,
//                                         }))}
//                                         onChange={handleSelectInputChange}
//                                         isClearable={true}
//                                         isSearchable={true}
//                                         placeholder="Select an asset..."
//                                         styles={{
//                                             menu: (provided, state) => ({
//                                                 backgroundColor: 'var(--bg-color)',
//                                                 border: '1px solid var(--neutral-color-2)',
//                                             }),
//                                             option: (styles, { isSelected }) => {
//                                                 return {
//                                                     ...styles,
//                                                     backgroundColor: isSelected
//                                                         ? 'var(--pri-blue-normal) !important'
//                                                         : null,
//                                                 };
//                                             },
//                                         }}
//                                     />
//                                     <button onClick={handleCopyBtnClick} className={styles.assetCopyBtn}>
//                                         <i className="neu-copy"></i>
//                                     </button>
//                                 </div>
//                                 <hr style={{ opacity: '0.7' }} />

//                                 <form action="" className={styles.createPostForm} onSubmit={handleCreatePostFormSubmit}>
//                                     <div className={styles.postMetaInfo}>
//                                         <div className={`${styles.postTitleWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Title</h4>
//                                                 <span>Title should be as brief as possible.</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postTitle}
//                                                 onChange={(e) => {
//                                                     setPostTitle(e.target.value);
//                                                     setPostSlug(strToSlug(e.target.value));
//                                                 }}
//                                                 placeholder="Post title..."
//                                                 required
//                                             />
//                                         </div>
//                                         <div className={`${styles.postCoverWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Cover Image</h4>
//                                                 <span>Link to the post cover.</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postCover}
//                                                 onChange={(e) => setPostCover(e.target.value)}
//                                                 placeholder="Link to cover image..."
//                                                 required
//                                             />
//                                         </div>
//                                         <div className={`${styles.postSlugWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Post Slug</h4>
//                                                 <span>The slug is the link to the post (auto-generated).</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postSlug}
//                                                 onChange={(e) => setPostSlug(e.target.value)}
//                                                 placeholder="post slug..."
//                                             />
//                                         </div>
//                                         <div className={`${styles.postTagsWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Tag</h4>
//                                                 <span>Enter tags in semi-colon separated format.</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postTags}
//                                                 onChange={(e) => setPostTags(e.target.value)}
//                                                 placeholder="Tags in semi-colon separated format..."
//                                             />
//                                         </div>
//                                         <div className={`${styles.postKeywordsWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Keywords</h4>
//                                                 <span>Enter keywords in semi-colon separated format.</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postKeywords}
//                                                 onChange={(e) => setPostKeywords(e.target.value)}
//                                                 placeholder="Keywords in semi-colon separated format..."
//                                             />
//                                         </div>
//                                         <div className={`${styles.postDescriptionWrap} ${styles.createFormDivChild}`}>
//                                             <label>
//                                                 <h4>Description</h4>
//                                                 <span>This is the content description for the post.</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={postDescription}
//                                                 onChange={(e) => setPostDescription(e.target.value)}
//                                                 placeholder="Post content description..."
//                                             />
//                                         </div>
//                                     </div>

//                                     <MarkdownEditor
//                                         textValue={markdownText}
//                                         handleMarkdownEditorChange={handleMarkdownEditorChange}
//                                     />
//                                     <div className={styles.blogPostStats}>
//                                         <h4>Post Stats</h4>
//                                         <ul>
//                                             <li>
//                                                 Number of paragraphs: <b>{countObj.paragraphs}</b>.
//                                             </li>
//                                             <li>
//                                                 Number of sentences: <b>{countObj.sentences}</b>.
//                                             </li>
//                                             <li>
//                                                 Number of words: <b>{countObj.words}</b>.
//                                             </li>
//                                             <li>
//                                                 Number of characters: <b>{countObj.characters}</b>.
//                                             </li>
//                                             <li>
//                                                 Total Number of characters: <b>{countObj.all}</b>.
//                                             </li>
//                                             <li>
//                                                 Read Time: <b>{readTimeValue}</b>.
//                                             </li>
//                                         </ul>
//                                     </div>
//                                     <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
//                                         <label>
//                                             <h4>Publish Post</h4>
//                                             <span>Should this post be automatically published?</span>
//                                         </label>
//                                         <input
//                                             type="checkbox"
//                                             checked={shouldPublish}
//                                             className={styles.shouldPublishCheckbox}
//                                             id="shouldPublishCheckbox"
//                                             onChange={(e) => setShouldPublish(e.target.checked)}
//                                         />{' '}
//                                         <label className={styles.checkboxText} htmlFor="shouldPublishCheckbox">
//                                             {' '}
//                                             {shouldPublish ? 'Yes' : 'No'}{' '}
//                                         </label>
//                                     </div>
//                                     <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
//                                         <label>
//                                             <h4>Pin Post</h4>
//                                             <span>Should this post be pinned to blog home page?</span>
//                                         </label>
//                                         <input
//                                             type="checkbox"
//                                             checked={shouldPin}
//                                             className={styles.shouldPinCheckbox}
//                                             id="shouldPinCheckbox"
//                                             onChange={(e) => setShouldPin(e.target.checked)}
//                                         />{' '}
//                                         <label className={styles.checkboxText} htmlFor="shouldPinCheckbox">
//                                             {' '}
//                                             {shouldPin ? 'Yes' : 'No'}{' '}
//                                         </label>
//                                     </div>
//                                     <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
//                                         <label>
//                                             <h4>Disable Comment</h4>
//                                             <span>Should this post's comment be disabled?</span>
//                                         </label>
//                                         <input
//                                             type="checkbox"
//                                             checked={shouldDisableComment}
//                                             className={styles.shouldDisableCommentCheckbox}
//                                             id="shouldDisableCommentCheckbox"
//                                             onChange={(e) => setShouldDisableComment(e.target.checked)}
//                                         />{' '}
//                                         <label className={styles.checkboxText} htmlFor="shouldDisableCommentCheckbox">
//                                             {' '}
//                                             {shouldDisableComment ? 'Yes' : 'No'}{' '}
//                                         </label>
//                                     </div>
//                                     <div className={`${styles.postCreatePostBtnWrap} ${styles.createFormDivChild}`}>
//                                         <button type="submit">Create Post</button>
//                                     </div>
//                                 </form>

//                                 {
//                                     // <div dangerouslySetInnerHTML={createMarkup()} />
//                                 }
//                             </div>
//                         </Fragment>
//                     )}
//                 </div>
//             </main>
//         </Fragment>
//     );
// };

// const mapStateToProps = (state) => ({
//     post: state.post,
//     isAuthenticated: state.auth.isAuthenticated,
//     adminuser: state.auth.adminuser,
//     isLoading: state.auth.isLoading,
//     isAdminUserLoaded: state.auth.isAdminUserLoaded,
//     assets: state.asset.assets,
//     errorMsg: state.error.message,
// });

// export default connect(mapStateToProps, {
//     getPosts,
//     addPost,
//     resetPostCreated,
//     clearErrors,
// })(CreatePost);
