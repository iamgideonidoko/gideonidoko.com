import { useEffect, Fragment, useState } from 'react';
import styles from '../../styles/ManagePost.module.css';
import swal from 'sweetalert';
import { SingleValue } from 'react-select';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import MarkdownEditor from '../../components/MarkdownEditor';
import {
    strToSlug,
    count,
    getReadTime,
    separatedStrToArr,
    convertByteInString,
    authGet,
    authDelete,
    authPut,
} from '../../helper';
import { NextSeo } from 'next-seo';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AsyncSelect from 'react-select/async';
import { decode } from 'html-entities';

//get router
import { useRouter } from 'next/router';
import { Post } from '../../interfaces/post.interface';
import { Asset } from '../../interfaces/helper.interface';

const ManagePost = ({}) => {
    const router = useRouter();
    const auth = useSelector(({ auth }: RootState) => auth);
    const [loaded, setLoaded] = useState<boolean>(false);

    const [selectedPost, setSelectedPost] = useState<{
        value: string;
        label: string;
        title: string;
        slug: string;
    } | null>(null);
    const [postOptions, setPostOptions] = useState<Post[]>([]);
    const [assetOptions, setAssetOptions] = useState<Asset[]>([]);
    const [shouldEditPost, setShouldEditPost] = useState(false);
    const [selectedAssetFile, setSelectedAssetFile] = useState<{ value: string; label: string } | null>(null);

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
    // const [markdownHtml, setMarkdownHtml] = useState('');

    useEffect(() => {
        setLoaded(true);
    }, []);

    const countObj = count(markdownText);
    const readTimeValue = getReadTime(markdownText);

    const handleMarkdownEditorChange = ({ text }: { text: string }) => {
        setMarkdownText(text);
    };

    const handleEditPostFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!postTitle || !postCover || !postSlug || !markdownText) {
            swal({
                title: '',
                text: `The "Title", "Cover Image", and "Post Body" fields must be provided.`,
                icon: 'error',
                buttons: [false, false],
            });
        } else {
            try {
                const willEdit = await swal({
                    title: 'Are you sure about this edit?',
                    text: `Do you really want to edit this post "${postTitle}"?`,
                    icon: 'warning',
                    buttons: {
                        cancel: true,
                        confirm: {
                            text: 'Yes, Edit',
                            className: 'uploadConfirmBtn',
                        },
                    },
                });
                if (willEdit) {
                    const updatedPost = {
                        title: postTitle,
                        slug: postSlug,
                        cover_img: postCover,
                        author_username: auth.userInfo?.user?.username,
                        author_name: auth.userInfo?.user?.name,
                        body: markdownText,
                        tags: separatedStrToArr(postTags),
                        is_published: shouldPublish,
                        is_pinned: shouldPin,
                        is_comment_disabled: shouldDisableComment,
                        keywords: separatedStrToArr(postKeywords),
                        description: postDescription,
                    };

                    try {
                        await authPut(
                            `/post/${selectedPost?.value}${
                                postTitle.trim() !== selectedPost?.title?.trim() ? '?new_title=true' : ''
                            }`,
                            updatedPost,
                        );
                        await swal({
                            title: '',
                            text: `Post successfully updated.`,
                            icon: 'success',
                            buttons: [false, false],
                        });
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
                        // setMarkdownHtml('');
                        setSelectedPost(null);
                        setPostOptions([]);
                        setShouldEditPost(false);
                        setSelectedAssetFile(null);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        if (err?.response?.data?.errorType === 'TITLE_ALREADY_EXISTS') {
                            swal({
                                title: 'Post already exists.',
                                text: `A post with the same title "${postTitle}" already exists."`,
                                icon: 'error',
                                buttons: [false, false],
                            });
                        }
                    }
                }
            } catch (err) {}
        }
    };

    const handleSelectInputChange = (
        option: SingleValue<{ label: string; value: string; title: string; slug: string }>,
    ) => {
        setSelectedPost(option ? option : null);
    };

    const handleAssetSelectInputChange = (option: SingleValue<{ label: string; value: string }>) => {
        setSelectedAssetFile(option ? option : null);
    };

    const handleEditPost = async () => {
        if (selectedPost) {
            try {
                const willEdit = await swal({
                    title: 'Are you sure about the edit?',
                    text: `Are you sure you want to edit the post "${selectedPost?.title}" ?`,
                    icon: 'warning',
                    buttons: {
                        cancel: true,
                        confirm: {
                            text: 'Yes, Edit',
                            className: 'uploadConfirmBtn',
                        },
                    },
                });
                if (willEdit) {
                    //change the values in the edit post form

                    try {
                        const res = await authGet(`/post/${selectedPost.slug}?type=all`);
                        const fullSelectedPost = res?.data?.post;
                        if (fullSelectedPost) {
                            setPostTitle(fullSelectedPost.title ? fullSelectedPost.title : '');
                            setPostCover(fullSelectedPost.cover_img ? fullSelectedPost.cover_img : '');
                            setPostSlug(fullSelectedPost.slug ? fullSelectedPost.slug : '');
                            setPostTags(fullSelectedPost.tags ? fullSelectedPost.tags.join(';') : '');
                            setPostKeywords(fullSelectedPost.keywords ? fullSelectedPost.keywords.join(';') : '');
                            setPostDescription(fullSelectedPost.description ? fullSelectedPost.description : '');
                            setShouldPublish(fullSelectedPost.is_published ? fullSelectedPost.is_published : false);
                            setShouldPin(fullSelectedPost.is_pinned ? fullSelectedPost.is_pinned : false);
                            setShouldDisableComment(
                                fullSelectedPost.is_comment_disabled ? fullSelectedPost.is_comment_disabled : false,
                            );
                            setMarkdownText(fullSelectedPost.body ? fullSelectedPost.body : '');
                            setShouldEditPost(true);
                        }
                    } catch (err) {
                        console.error('Single Post Fetch Error => ', err);
                    }
                }
            } catch (err) {}
        } else {
            swal({
                title: 'No post selected.',
                text: `Please select a post.`,
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

    const handleDeletePost = async () => {
        if (selectedPost) {
            try {
                const willDelete = await swal({
                    title: 'Are you sure about the delete?',
                    text: `Are you sure you want to delete the post "${selectedPost.title}" ?`,
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
                    try {
                        await authDelete(`/post/${selectedPost.value}`);
                        await swal({
                            title: '',
                            text: `Post successfully deleted.`,
                            icon: 'success',
                            buttons: [false, false],
                        });
                        setSelectedPost(null);
                        setPostOptions([]);
                    } catch (err) {
                        console.error('Post delete error => ', err);
                    }
                }
            } catch (err) {}
        } else {
            swal({
                title: 'No post selected.',
                text: `Please select a post.`,
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

    const handleCancelEditPost = async () => {
        try {
            const willCancel = await swal({
                title: '',
                text: `Do you really want to cancel editing this post "${selectedPost?.title}" ?`,
                icon: 'warning',
                buttons: {
                    cancel: true,
                    confirm: {
                        text: 'Yes, Cancel',
                        className: 'uploadConfirmBtn',
                    },
                },
            });
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
                setPostOptions([]);
                setShouldEditPost(false);
            }
        } catch (err) {}
    };

    ///when the copy button is clicked
    const handleCopyBtnClick = () => {
        if (selectedAssetFile) {
            copy(selectedAssetFile.value);
            swal({
                title: '',
                text: `"Copied "${selectedAssetFile.value}"`,
                icon: 'success',
                buttons: [false, false],
            });
        } else {
            swal({
                title: '',
                text: `No asset file is selected.`,
                icon: 'error',
                buttons: [false, false],
            });
        }
    };

    let postFetchTimer: ReturnType<typeof setTimeout>;

    const getPosts = (inputValue: string): Promise<Post[]> => {
        return new Promise<Post[]>(async (resolve) => {
            if (inputValue.length < 2) return;
            clearTimeout(postFetchTimer);
            postFetchTimer = setTimeout(async () => {
                try {
                    const res = await authGet(`/posts/search?q=${inputValue}`);
                    setPostOptions(res?.data?.posts || []);
                    const options =
                        res?.data?.posts?.map(({ _id, title, created_at, slug }: Post) => ({
                            value: _id,
                            label: `${title} (${moment(created_at).format('MMM DD, YYYY')})`,
                            title,
                            slug,
                        })) || [];
                    resolve(options);
                } catch (err) {
                    console.error('Post Search Error => ', err);
                    resolve([]);
                }
            }, 1500);
        });
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
                        res?.data?.assets?.map(({ name, url, size }: Asset) => ({
                            value: url,
                            label: `${name} (${convertByteInString(size)})`,
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
            <NextSeo title="Manage Post - Gideon Idoko" noindex={true} nofollow={true} />
            {loaded && (
                <main className={`padding-top-10rem`}>
                    <div className="container-max-1248px">
                        {!auth.isAuthenticated ? (
                            <div>
                                <div className={`loginRedirectMsg`}>
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
                                {/*MANAGE POST PAGE*/}
                                <div className={styles.managePostWrap}>
                                    <h1>Manage Post</h1>
                                    <p>Select a post to manage. You can only manage posts created by you.</p>

                                    <div className={styles.managePostForm}>
                                        <AsyncSelect
                                            className="managePostFormSelect"
                                            cacheOptions
                                            isClearable={true}
                                            value={selectedPost}
                                            defaultOptions={postOptions.map(({ title, _id, created_at, slug }) => ({
                                                value: _id,
                                                label: `${title} (${moment(created_at).format('MMM DD, YYYY')})`,
                                                title,
                                                slug,
                                            }))}
                                            classNamePrefix="reactSelect"
                                            onChange={handleSelectInputChange}
                                            loadOptions={getPosts}
                                            placeholder="Type to search for post..."
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
                                        <div
                                            className={styles.actionBtnsWrapper}
                                            style={{ display: shouldEditPost ? 'none' : 'block' }}
                                        >
                                            <button className={styles.editPostBtn} onClick={handleEditPost}>
                                                Edit Post
                                            </button>
                                            <button className={styles.deletePostBtn} onClick={handleDeletePost}>
                                                Delete Post
                                            </button>
                                        </div>
                                    </div>
                                    {selectedPost && shouldEditPost && (
                                        <div className={styles.editPostWrapper}>
                                            <h2 className={styles.editPostWrapperHeadTxt}>
                                                Edit Post: &quot;{selectedPost?.label}&quot;
                                            </h2>
                                            <hr style={{ opacity: '0.7' }} />
                                            <h4 className={styles.copyAssetHead}>Copy Asset</h4>
                                            <div className={styles.assetFormSelectWrap}>
                                                <AsyncSelect
                                                    className="assetFormSelect"
                                                    isClearable={true}
                                                    value={selectedAssetFile}
                                                    cacheOptions
                                                    defaultOptions={assetOptions.map(({ name, url, size }) => ({
                                                        value: url,
                                                        label: `${name} (${convertByteInString(size)})`,
                                                    }))}
                                                    classNamePrefix="reactSelect"
                                                    onChange={handleAssetSelectInputChange}
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
                                                <button onClick={handleCopyBtnClick} className={styles.assetCopyBtn}>
                                                    <i className="neu-copy"></i>
                                                </button>
                                            </div>
                                            <hr style={{ opacity: '0.7' }} />

                                            {/* Edit post form*/}

                                            <form
                                                action=""
                                                className={styles.editPostForm}
                                                onSubmit={handleEditPostFormSubmit}
                                            >
                                                <div className={styles.postMetaInfo}>
                                                    <div
                                                        className={`${styles.postTitleWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Title</h4>
                                                            <span>Title should be as brief as possible.</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postTitle}
                                                            onChange={(e) => {
                                                                setPostTitle(e.target.value);
                                                                setPostSlug(strToSlug(e.target.value));
                                                            }}
                                                            placeholder="Post title..."
                                                            required
                                                        />
                                                    </div>
                                                    <div
                                                        className={`${styles.postCoverWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Cover Image</h4>
                                                            <span>Link to the post cover.</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postCover}
                                                            onChange={(e) => setPostCover(e.target.value)}
                                                            placeholder="Link to cover image..."
                                                            required
                                                        />
                                                    </div>
                                                    <div
                                                        className={`${styles.postSlugWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Post Slug</h4>
                                                            <span>
                                                                The slug is the link to the post (auto-generated).
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postSlug}
                                                            onChange={(e) => setPostSlug(e.target.value)}
                                                            placeholder="post slug..."
                                                        />
                                                    </div>
                                                    <div
                                                        className={`${styles.postTagsWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Tag</h4>
                                                            <span>Enter tags in semi-colon separated format.</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postTags}
                                                            onChange={(e) => setPostTags(e.target.value)}
                                                            placeholder="Tags in semi-colon separated format..."
                                                        />
                                                    </div>
                                                    <div
                                                        className={`${styles.postKeywordsWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Keywords</h4>
                                                            <span>Enter keywords in semi-colon separated format.</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postKeywords}
                                                            onChange={(e) => setPostKeywords(e.target.value)}
                                                            placeholder="Keywords in semi-colon separated format..."
                                                        />
                                                    </div>
                                                    <div
                                                        className={`${styles.postDescriptionWrap} ${styles.editFormDivChild}`}
                                                    >
                                                        <label>
                                                            <h4>Description</h4>
                                                            <span>This is the content description for the post.</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={postDescription}
                                                            onChange={(e) => setPostDescription(e.target.value)}
                                                            placeholder="Post content description..."
                                                        />
                                                    </div>
                                                </div>

                                                <MarkdownEditor
                                                    textValue={decode(markdownText)}
                                                    handleMarkdownEditorChange={handleMarkdownEditorChange}
                                                />

                                                <div className={styles.blogPostStats}>
                                                    <h4>Post Stats</h4>
                                                    <ul>
                                                        <li>
                                                            Number of paragraphs: <b>{countObj.paragraphs}</b>.
                                                        </li>
                                                        <li>
                                                            Number of sentences: <b>{countObj.sentences}</b>.
                                                        </li>
                                                        <li>
                                                            Number of words: <b>{countObj.words}</b>.
                                                        </li>
                                                        <li>
                                                            Number of characters: <b>{countObj.characters}</b>.
                                                        </li>
                                                        <li>
                                                            Total Number of characters: <b>{countObj.all}</b>.
                                                        </li>
                                                        <li>
                                                            Read Time: <b>{readTimeValue}</b>.
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div
                                                    className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}
                                                >
                                                    <label>
                                                        <h4>Publish Post</h4>
                                                        <span>Should this post be automatically published?</span>
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        checked={shouldPublish}
                                                        className={styles.shouldPublishCheckbox}
                                                        id="shouldPublishCheckbox"
                                                        onChange={(e) => setShouldPublish(e.target.checked)}
                                                    />{' '}
                                                    <label
                                                        className={styles.checkboxText}
                                                        htmlFor="shouldPublishCheckbox"
                                                    >
                                                        {' '}
                                                        {shouldPublish ? 'Yes' : 'No'}{' '}
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}
                                                >
                                                    <label>
                                                        <h4>Pin Post</h4>
                                                        <span>Should this post be pinned to blog home page?</span>
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        checked={shouldPin}
                                                        className={styles.shouldPinCheckbox}
                                                        id="shouldPinCheckbox"
                                                        onChange={(e) => setShouldPin(e.target.checked)}
                                                    />{' '}
                                                    <label className={styles.checkboxText} htmlFor="shouldPinCheckbox">
                                                        {' '}
                                                        {shouldPin ? 'Yes' : 'No'}{' '}
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles.shouldPublishPostWrap} ${styles.editFormDivChild}`}
                                                >
                                                    <label>
                                                        <h4>Disable Comment</h4>
                                                        <span>Should this post&apos;s comment be disabled?</span>
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        checked={shouldDisableComment}
                                                        className={styles.shouldDisableCommentCheckbox}
                                                        id="shouldDisableCommentCheckbox"
                                                        onChange={(e) => setShouldDisableComment(e.target.checked)}
                                                    />{' '}
                                                    <label
                                                        className={styles.checkboxText}
                                                        htmlFor="shouldDisableCommentCheckbox"
                                                    >
                                                        {' '}
                                                        {shouldDisableComment ? 'Yes' : 'No'}{' '}
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles.postEditPostBtnWrap} ${styles.editFormDivChild}`}
                                                >
                                                    <button type="submit">Edit Post</button>
                                                    <button type="button" onClick={handleCancelEditPost}>
                                                        Cancel Edit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        )}
                    </div>
                </main>
            )}
        </Fragment>
    );
};

export default ManagePost;
