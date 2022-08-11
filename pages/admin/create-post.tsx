import { useState, Fragment, useEffect } from 'react';
import styles from '../../styles/CreatePost.module.css';
import MarkdownEditor from '../../components/MarkdownEditor';
import { separatedStrToArr, count, getReadTime, convertByteInString, strToSlug, authGet } from '../../helper';
import swal from 'sweetalert';
import copy from 'copy-to-clipboard';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AsyncSelect from 'react-select/async';
import { Asset } from '../../interfaces/helper.interface';
import { SingleValue } from 'react-select';
import { authPost } from '../../helper';

const CreatePost = ({}) => {
    const router = useRouter();
    const auth = useSelector(({ auth }: RootState) => auth);

    const [selectedAssetFile, setSelectedAssetFile] = useState<{ value: string; label: string } | null>(null);
    const [assetOptions, setAssetOptions] = useState<Asset[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const [postTitle, setPostTitle] = useState<string>('');
    const [postCover, setPostCover] = useState<string>('');
    const [postSlug, setPostSlug] = useState<string>('');
    const [postTags, setPostTags] = useState<string>('');
    const [postKeywords, setPostKeywords] = useState<string>('');
    const [postDescription, setPostDescription] = useState<string>('');
    const [shouldPublish, setShouldPublish] = useState<boolean>(false);
    const [shouldPin, setShouldPin] = useState<boolean>(false);
    const [shouldDisableComment, setShouldDisableComment] = useState<boolean>(false);

    //markdonw editor state
    const [markdownText, setMarkdownText] = useState<string>('');
    // const [markdownHtml, setMarkdownHtml] = useState<string>('');

    const countObj = count(markdownText);
    const readTimeValue = getReadTime(markdownText);

    useEffect(() => {
        setLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectInputChange = (option: SingleValue<{ label: string; value: string }>) => {
        setSelectedAssetFile(option ? option : null);
    };

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

    const handleMarkdownEditorChange = ({ text }: { text: string }) => {
        setMarkdownText(text);
    };

    const handleCreatePostFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                const willCreate = await swal({
                    title: 'Are you sure about this creation?',
                    text: `Do you really want to create this post "${postTitle}"?`,
                    icon: 'warning',
                    buttons: {
                        cancel: true,
                        confirm: {
                            text: 'Yes, Create',
                            className: 'uploadConfirmBtn',
                        },
                    },
                });
                if (willCreate) {
                    const newPost = {
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
                        await authPost(`/post`, newPost);
                        await swal({
                            title: '',
                            text: `Post successfully created.`,
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
                        setMarkdownText('');
                        // setMarkdownHtml('');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        if (err?.response?.data?.errorType === 'TITLE_ALREADY_EXISTS') {
                            swal({
                                title: 'Post already exists.',
                                text: `A post with the same title "${postTitle}" already exists."`,
                                icon: 'error',
                                buttons: [false, false],
                            });
                        } else {
                            console.error('Post create error => ', err);
                        }
                    }
                }
            } catch (err) {}
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
            <NextSeo title="Create Post - Gideon Idoko" noindex={true} nofollow={true} />
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
                                {/*CREATE POST PAGE*/}
                                <div className={styles.createPostWrap}>
                                    <h1 className={styles.pageTitle}>Create Post</h1>
                                    <hr style={{ opacity: '0.7' }} />
                                    <h4 className={styles.copyAssetHead}>Copy Asset</h4>
                                    <div className={styles.assetFormSelectWrap}>
                                        <AsyncSelect
                                            className="assetFormSelect"
                                            value={selectedAssetFile}
                                            cacheOptions
                                            defaultOptions={assetOptions.map(({ name, url, size }) => ({
                                                value: url,
                                                label: `${name} (${convertByteInString(size)})`,
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
                                        <button onClick={handleCopyBtnClick} className={styles.assetCopyBtn}>
                                            <i className="neu-copy"></i>
                                        </button>
                                    </div>
                                    <hr style={{ opacity: '0.7' }} />

                                    <form
                                        action=""
                                        className={styles.createPostForm}
                                        onSubmit={handleCreatePostFormSubmit}
                                    >
                                        <div className={styles.postMetaInfo}>
                                            <div className={`${styles.postTitleWrap} ${styles.createFormDivChild}`}>
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
                                            <div className={`${styles.postCoverWrap} ${styles.createFormDivChild}`}>
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
                                            <div className={`${styles.postSlugWrap} ${styles.createFormDivChild}`}>
                                                <label>
                                                    <h4>Post Slug</h4>
                                                    <span>The slug is the link to the post (auto-generated).</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={postSlug}
                                                    onChange={(e) => setPostSlug(e.target.value)}
                                                    placeholder="post slug..."
                                                />
                                            </div>
                                            <div className={`${styles.postTagsWrap} ${styles.createFormDivChild}`}>
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
                                            <div className={`${styles.postKeywordsWrap} ${styles.createFormDivChild}`}>
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
                                                className={`${styles.postDescriptionWrap} ${styles.createFormDivChild}`}
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
                                            textValue={markdownText}
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
                                        <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
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
                                            <label className={styles.checkboxText} htmlFor="shouldPublishCheckbox">
                                                {' '}
                                                {shouldPublish ? 'Yes' : 'No'}{' '}
                                            </label>
                                        </div>
                                        <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
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
                                        <div className={`${styles.shouldPublishPostWrap} ${styles.createFormDivChild}`}>
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
                                        <div className={`${styles.postCreatePostBtnWrap} ${styles.createFormDivChild}`}>
                                            <button type="submit">Create Post</button>
                                        </div>
                                    </form>

                                    {
                                        // <div dangerouslySetInnerHTML={createMarkup()} />
                                    }
                                </div>
                            </Fragment>
                        )}
                    </div>
                </main>
            )}
        </Fragment>
    );
};

export default CreatePost;
