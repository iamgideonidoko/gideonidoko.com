/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
// import hljs from 'highlight.js';
// import 'highlight.js/styles/monokai.css';
import CommentModal from '../../../components/blog/CommentModal';
import Custom404 from '../../404';
import swal from 'sweetalert';
// import { resetPostUpdated, updatePostComments } from '../../../store/actions/postActions';
import { authGet, purifyHtml, getReadTime, noAuthPut } from '../../../helper';
import copy from 'copy-to-clipboard';
import styles from '../../../styles/SinglePost.module.css';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { PostComment, PostCommentReply, SingleFullPost } from '../../../interfaces/post.interface';
import Head from 'next/head';
import { decode } from 'html-entities';
import { config } from '../../../config/keys';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon,
    FacebookShareButton,
    FacebookIcon,
} from 'react-share';
import markdownItAttrs from 'markdown-it-attrs';
import Prism from 'prismjs';
import components from 'prismjs/components.json';

/**
 * The set of all languages which have been loaded using the below function.
 *
 * @type {Set<string>}
 */
const loadedLanguages = new Set();

/**
 * Loads the given languages and adds them to the current Prism instance.
 *
 * @param {string|string[]} [languages]
 * @returns {void}
 */
export async function loadLanguages(languages: string[]) {
    const [lang] = languages;

    if (!lang) return;

    const loaded = [...loadedLanguages, ...Object.keys(Prism.languages)];

    if (loaded.indexOf(lang) !== -1) return;

    if (components && components.languages) {
        if (!(lang in components.languages)) {
            console.warn('Language does not exist: ' + lang);
            return;
        }
    }

    try {
        require(`prismjs/components/prism-${lang}`);
        loadedLanguages.add(lang);
    } catch (err) {
        console.error('Language could not be loaded');
    }
}

const mdParser: MarkdownIt = new MarkdownIt({
    highlight: function (str, lang) {
        const decodedStr = str;
        if (lang) {
            loadLanguages([lang]);
            try {
                return `<pre class="postBodyPreCode language-${lang}"><code class="language-${lang}">${Prism.highlight(
                    `${decodedStr}`,
                    Prism.languages[lang],
                    lang,
                )}</code></pre>`;
            } catch (__) {
                return `<pre class="postBodyPreCode language-${lang}"><code class="language-${lang}">${Prism.highlight(
                    decodedStr,
                    Prism.languages['text'],
                    'text',
                )}</code></pre>`;
            }
        }

        return `<pre class="postBodyPreCode"><code>${Prism.highlight(
            decodedStr,
            Prism.languages['text'],
            'text',
        )}</code></pre>`;
    },
    html: true,
    // linkify: true,
    // breaks: true,
});

mdParser.use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class'], // empty array = all attributes are allowed
});

const SinglePost = ({ postInfo }: { postInfo: SingleFullPost }) => {
    const exactPost = postInfo.post;
    const nextPost = postInfo.nextPost;
    const previousPost = postInfo.previousPost;

    const auth = useSelector(({ auth }: RootState) => auth);

    const [comments, setComments] = useState<Array<PostComment>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setComments(postInfo?.post?.comments);
        setLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postInfo]);

    // //local state
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isCommenting, setIsCommenting] = useState(true);
    const [currentCommentId, setCurrentCommentId] = useState('');

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).customCopy = copy;
        Prism.highlightAll();
    }, []);

    useEffect(() => {
        if (exactPost) {
            const allPostBodyAnchors = window.document.querySelectorAll('.truePostBody a');
            const allPostBodyPreCode = window.document.querySelectorAll('.postBodyPreCode');

            const allPostBodyTable = window.document.querySelectorAll('.truePostBody table');

            const truePostBody = window.document.querySelector('.truePostBody');

            if (!window.document.querySelector('.postBodyTable')) {
                allPostBodyTable.forEach((table) => {
                    const tableDiv = window.document.createElement('div');
                    !tableDiv.classList.contains('postBodyTable') && tableDiv.classList.add('postBodyTable');
                    const clonedTable = table.cloneNode(true);
                    tableDiv.appendChild(clonedTable);

                    truePostBody?.insertBefore(tableDiv, table);
                    truePostBody?.removeChild(table);
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allPostBodyAnchors.forEach((a) => {
                //get hostname of website address and link address
                const siteHostname = window.location.href.split('/')[2];
                const linkHostname = (a as Element & { href: string }).href.split('/')[2];

                if (siteHostname !== linkHostname) {
                    //add target attribut to external links
                    !a.hasAttribute('target') && a.setAttribute('target', '_blank');
                    !a.hasAttribute('rel') && a.setAttribute('rel', 'noopener noreferrer');
                }
            });

            allPostBodyPreCode.forEach((pre, index) => {
                // for code snippet
                const copyBtn = window.document.createElement('button');
                const copyBtnTextNode = window.document.createTextNode('Copied');
                const i = window.document.createElement('i');
                const span = window.document.createElement('span');

                i.classList.add('neu-copy');
                // span.classList.a
                span.appendChild(copyBtnTextNode);
                copyBtn.classList.add('codeCopyBtn');
                copyBtn.classList.add(`codeCopyBtn${index}`);

                copyBtn.appendChild(i);
                copyBtn.appendChild(span);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any)[`customCopyText${index}`] = pre.childNodes[0].textContent;
                /*window[`customCopyAlert${index}`] = function() {
					window.document.querySelector(`.codeCopyBtn${index} span`).style.display='inline';
					setTimeout(function() { window.document.querySelector(`.codeCopyBtn${index} span`).style.display='none'; }, 3000);
				};*/

                copyBtn.setAttribute(
                    'onclick',
                    `(function copySnippet(){ window.customCopy(window.customCopyText${index}); window.document.querySelector('.codeCopyBtn${index} span').style.display='inline'; setTimeout(function() { window.document.querySelector('.codeCopyBtn${index} span').style.display='none'; }, 3000) })()`,
                );
                pre.childNodes.length === 1 && pre.appendChild(copyBtn);
            });
        }
    }, [exactPost]);

    /*
	function to return dangerous markup
	*/
    const createMarkup = (markup: string) => {
        return { __html: markup };
    };

    const handleAddCommentBtnClick = () => {
        setIsCommenting(true);
        setShowCommentModal(true);
    };

    function handleAddReplyBtnClick(currentCommentId: string) {
        setCurrentCommentId(currentCommentId);
        setIsCommenting(false);
        setShowCommentModal(true);
    }

    async function handleDeleteComment(
        currentPostComments: PostComment[],
        currentComment: PostComment,
        currentPostId: string,
    ) {
        //create a deep copy of the currentPostComments
        const newCurrentPostComments: PostComment[] = JSON.parse(JSON.stringify(currentPostComments));

        //create an updated post object
        const updatedPost = {
            //add the new comment to the comments array of the current post
            comments: newCurrentPostComments.filter((comment) => comment._id !== currentComment._id),
            commentsUpdateAccessKey: config.commentsUpdateAccessKey,
        };

        try {
            const willDelete = await swal({
                title: '',
                text: `Delete reply from "${currentComment.comment_author}"?`,
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
                // update post comments
                try {
                    const res = await noAuthPut(`/post/${currentPostId}/comments`, updatedPost);
                    setComments(res?.data?.post?.comments);
                } catch (err) {
                    console.error('Comment post error => ', err);
                }
            }
        } catch (err) {}
    }

    async function handleDeleteReply(
        currentPostComments: PostComment[],
        currentComment: PostComment,
        currentPostId: string,
        currentReply: PostCommentReply,
    ) {
        //get a new copy of the current post comments array (deep copy)
        const newCurrentPostComments: PostComment[] = JSON.parse(JSON.stringify(currentPostComments));

        const mappedCurrentPostComments: PostComment[] = newCurrentPostComments.map((comment) => {
            if (comment._id === currentComment._id) {
                comment.replies = comment.replies.filter((reply) => reply._id !== currentReply._id);
                return comment;
            }
            return comment;
        });

        const updatedPost = {
            comments: mappedCurrentPostComments,
            commentsUpdateAccessKey: config.commentsUpdateAccessKey,
        };

        try {
            const willDelete = await swal({
                title: '',
                text: `Delete ${currentReply.reply_author}'s reply to "${currentComment.comment_author}"?`,
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
                // update post comments
                try {
                    const res = await noAuthPut(`/post/${currentPostId}/comments`, updatedPost);
                    setComments(res?.data?.post?.comments);
                } catch (err) {
                    console.error('Comment post error => ', err);
                }
            }
        } catch (err) {}
    }

    return (
        <Fragment>
            {!postInfo.post ? (
                <Custom404 />
            ) : (
                <Fragment>
                    <NextSeo
                        title={`${exactPost.title} - Gideon Idoko`}
                        description={exactPost.description}
                        canonical={`https://gideonidoko.com/blog/${exactPost.slug}`}
                        openGraph={{
                            url: `https://gideonidoko.com/blog/${exactPost.slug}`,
                            title: `${exactPost.title} - Gideon Idoko`,
                            description: exactPost.description,
                            type: 'article',
                            article: {
                                // publishedTime: exactPost.created_at as string,
                                authors: [exactPost.author_name as string],
                                tags: exactPost.tags,
                            },
                            images: [
                                {
                                    url: exactPost.cover_img,
                                    alt: `${exactPost.title}'s cover image`,
                                },
                            ],
                            site_name: 'Gideon Idoko',
                        }}
                        twitter={{
                            handle: '@IamGideonIdoko',
                            site: '@IamGideonIdoko',
                            cardType: 'summary_large_image',
                        }}
                    />

                    <Head>
                        <meta name="keywords" content={exactPost?.keywords?.join(',')}></meta>
                    </Head>
                    <main className={`padding-top-10rem ${styles.singlePostMain}`}>
                        <div className="container-max-1248px">
                            <Fragment>
                                <div className={styles.singlePostPageWrapper}>
                                    <div className={styles.blogHeader}>
                                        <h5 className={styles.breadcrumb}>
                                            <small>
                                                &gt;&gt;&nbsp;{' '}
                                                <Link href="/blog">
                                                    <a>Blog</a>
                                                </Link>
                                                &nbsp; &gt;&gt; {exactPost.title}
                                            </small>
                                        </h5>
                                        <h1 className={styles.postTitle}>{exactPost.title}</h1>
                                        <h5 className={styles.blogMeta}>
                                            <span>
                                                <small>{moment(exactPost.created_at).format('MMM DD, YYYY')}</small>
                                            </span>{' '}
                                            &nbsp; |&nbsp;{' '}
                                            <span>
                                                <small>{getReadTime(exactPost.body)}</small>
                                            </span>{' '}
                                            &nbsp; |&nbsp;{' '}
                                            <span>
                                                <small>{exactPost.author_name}</small>
                                            </span>
                                        </h5>
                                        <div className={styles.postCoverWrap}>
                                            <img
                                                className={styles.postCover}
                                                src={exactPost.cover_img}
                                                alt="Blog Cover"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.blogBody}>
                                        <div
                                            className={`${styles.postBody} truePostBody`}
                                            dangerouslySetInnerHTML={createMarkup(
                                                purifyHtml(mdParser.render(decode(exactPost.body))),
                                            )}
                                        />

                                        <div className={styles.postTags}>
                                            {exactPost.tags?.map((tag, idx) => (
                                                <span key={idx}>
                                                    <Link href={`/blog/tags/${tag}`}>
                                                        <a>#{tag}</a>
                                                    </Link>
                                                </span>
                                            ))}
                                        </div>

                                        {typeof window !== 'undefined' && (
                                            <div className={styles.postShare}>
                                                <div className={styles.postShareBtns}>
                                                    <span>Share: </span>
                                                    <TwitterShareButton
                                                        title={exactPost?.title}
                                                        hashtags={exactPost.tags as string[]}
                                                        url={window.document.URL}
                                                        via={'IamGideonIdoko'}
                                                    >
                                                        <TwitterIcon size={32} round={true} />
                                                    </TwitterShareButton>
                                                    <LinkedinShareButton
                                                        title={exactPost?.title}
                                                        url={window.document.URL}
                                                        summary={exactPost?.description}
                                                        source={'Gideon Idoko'}
                                                    >
                                                        <LinkedinIcon size={32} round={true} />
                                                    </LinkedinShareButton>
                                                    <FacebookShareButton
                                                        url={window.document.URL}
                                                        quote={exactPost?.description}
                                                        hashtag={exactPost?.tags ? exactPost?.tags[0] : ''}
                                                    >
                                                        <FacebookIcon size={32} round={true} />
                                                    </FacebookShareButton>
                                                    <WhatsappShareButton
                                                        title={exactPost?.title}
                                                        url={window.document.URL}
                                                        separator={': '}
                                                    >
                                                        <WhatsappIcon size={32} round={true} />
                                                    </WhatsappShareButton>
                                                </div>
                                            </div>
                                        )}

                                        <div className={styles.postPagination}>
                                            <div className={styles.ppLeft}>
                                                {previousPost?.length > 0 && (
                                                    <Link href={`/blog/${previousPost[0].slug}`}>
                                                        <a>← {previousPost[0].title}</a>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className={styles.ppRight}>
                                                {nextPost?.length > 0 && (
                                                    <Link href={`/blog/${nextPost[0].slug}`}>
                                                        <a>{nextPost[0].title} →</a>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* BLOG FOOTER */}
                                    {loaded && (
                                        <div className={styles.blogFooter}>
                                            <div className={styles.commentSection}>
                                                <div className={styles.commentSectionHeader}>
                                                    <div>
                                                        <span>Comments ({comments.length})</span>
                                                    </div>
                                                    <div>
                                                        {!exactPost.is_comment_disabled ? (
                                                            <button
                                                                className={styles.commentModalOpenBtn}
                                                                onClick={handleAddCommentBtnClick}
                                                            >
                                                                <i className="neu-pencil-ui"></i> Add a comment
                                                            </button>
                                                        ) : (
                                                            <p style={{ opacity: '0.7' }}>Comment disabled.</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <CommentModal
                                                    showCommentModal={showCommentModal}
                                                    setShowCommentModal={setShowCommentModal}
                                                    currentPostTitle={exactPost.title}
                                                    isCommenting={isCommenting}
                                                    currentPostComments={comments}
                                                    currentPostId={exactPost._id}
                                                    isAdmin={auth.isAuthenticated}
                                                    isPostAuthor={
                                                        auth.isAuthenticated
                                                            ? exactPost.author_username ===
                                                              auth.userInfo?.user?.username
                                                            : false
                                                    }
                                                    currentCommentId={currentCommentId}
                                                    currentAdminName={
                                                        auth.isAuthenticated ? auth.userInfo?.user?.name : null
                                                    }
                                                    setComments={setComments}
                                                    exactPost={exactPost}
                                                />
                                                <div className={styles.commentSectionBody}>
                                                    {comments.map((comment) => (
                                                        <div key={comment._id} className={styles.singleComment}>
                                                            <div className={styles.singleCommentMainContent}>
                                                                <div className={styles.scLeft}>
                                                                    {comment.isAdmin ? (
                                                                        <span className={styles.scLeftAdminGravatar}>
                                                                            <img
                                                                                src="/assets/img/GideonIdokoDevGravater.png"
                                                                                alt=""
                                                                            />
                                                                        </span>
                                                                    ) : (
                                                                        <span className={styles.scLeftUserGravatar}>
                                                                            <i className="neu-user-circle"></i>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className={styles.scRight}>
                                                                    <div className={styles.commentAuthor}>
                                                                        <div>
                                                                            <span>{comment.comment_author}</span>{' '}
                                                                            {comment.isAdmin &&
                                                                                comment.isPostAuthor && (
                                                                                    <i className="neu-tick-circle"></i>
                                                                                )}
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                {moment(comment.date).format('MMM DD')}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className={styles.commentBody}
                                                                        dangerouslySetInnerHTML={createMarkup(
                                                                            comment.comment_body,
                                                                        )}
                                                                    />
                                                                    <div className={styles.commentFooter}>
                                                                        <div>
                                                                            {!exactPost.is_comment_disabled && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleAddReplyBtnClick(
                                                                                            comment._id,
                                                                                        )
                                                                                    }
                                                                                    className={styles.commentReplyBtn}
                                                                                >
                                                                                    <i className="neu-turn-right"></i>{' '}
                                                                                    <span>Reply</span>
                                                                                </button>
                                                                            )}

                                                                            {auth.isAuthenticated ? (
                                                                                <button
                                                                                    className={styles.commentDeleteBtn}
                                                                                    onClick={() =>
                                                                                        handleDeleteComment(
                                                                                            comments,
                                                                                            comment,
                                                                                            exactPost._id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <i className="neu-trash"></i>{' '}
                                                                                    <span>Delete</span>
                                                                                </button>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {comment.replies.map((reply, index) => (
                                                                <div
                                                                    key={reply._id}
                                                                    className={`${styles.singleReply} ${
                                                                        index == 0 ? styles.firstSingleReply : null
                                                                    }`}
                                                                >
                                                                    <div className={styles.srLeft}>
                                                                        {reply.isAdmin ? (
                                                                            <span
                                                                                className={styles.srLeftAdminGravatar}
                                                                            >
                                                                                <img
                                                                                    src="/assets/img/GideonIdokoDevGravater.png"
                                                                                    alt=""
                                                                                />
                                                                            </span>
                                                                        ) : (
                                                                            <span className={styles.srLeftUserGravatar}>
                                                                                <i className="neu-user-circle"></i>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className={styles.srRight}>
                                                                        <div className={styles.replyAuthor}>
                                                                            <div>
                                                                                <span>{reply.reply_author}</span>{' '}
                                                                                {reply.isAdmin &&
                                                                                    reply.isPostAuthor && (
                                                                                        <i className="neu-tick-circle"></i>
                                                                                    )}
                                                                            </div>
                                                                            <div>
                                                                                <span>
                                                                                    {moment(reply.date).format(
                                                                                        'MMM DD',
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={styles.replyBody}
                                                                            dangerouslySetInnerHTML={createMarkup(
                                                                                reply.reply_body,
                                                                            )}
                                                                        />

                                                                        <div className={styles.replyFooter}>
                                                                            <div>
                                                                                {auth.isAuthenticated ? (
                                                                                    <button
                                                                                        className={
                                                                                            styles.replyDeleteBtn
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleDeleteReply(
                                                                                                comments,
                                                                                                comment,
                                                                                                exactPost._id,
                                                                                                reply,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <i className="neu-trash"></i>{' '}
                                                                                        <span>Delete</span>
                                                                                    </button>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        </div>
                    </main>
                </Fragment>
            )}
        </Fragment>
    );
};

export default SinglePost;

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = context.params?.slug;

    // Fetch data from external API
    try {
        const res = await authGet(`/post/${slug}`);
        if (!res?.data?.post?.post) return { notFound: true };
        return { props: { postInfo: res?.data?.post } };
    } catch (err) {
        // return { props: { postInfo: { post: null, nextPost: [], prevPost: [] } } };
        return { notFound: true };
    }
};
