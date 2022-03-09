/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import CommentModal from '../../../components/blog/CommentModal';
import Custom404 from '../../404';
import swal from 'sweetalert';
import { resetPostUpdated, updatePostComments } from '../../../store/actions/postActions';
import { authGet, getReadTime, shareToSocialMedia, strToSlug } from '../../../helper';
import copy from 'copy-to-clipboard';
import styles from '../../../styles/SinglePost.module.css';
import 'highlight.js/styles/monokai.css';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { SinglePost } from '../../../interfaces/post.interface';
import Head from 'next/head';
import { decode } from 'html-entities';

const SinglePost = ({ postInfo }: { postInfo: SinglePost }) => {
    console.log('Post Info => ', postInfo);

    const exactPost = postInfo.post;
    const nextPost = postInfo.nextPost;
    const previousPost = postInfo.prevPost;

    // //local state
    // const [showCommentModal, setShowCommentModal] = useState(false);
    // const [isCommenting, setIsCommenting] = useState(true);
    // const [currentCommentId, setCurrentCommentId] = useState('');

    // //handling 404
    // const [shouldLoad404, setShouldLoad404] = useState(false);

    // //get array of all posts with given slug
    // const fetchedSinglePost = props.post.posts.filter((post) => post.slug === slug);

    // //get the exact post which is the first and only post
    // const exactPost = fetchedSinglePost[0];

    // const exactPostIndex = props.post.posts.indexOf(exactPost);

    // const nextPost = props.post.posts[exactPostIndex - 1] ? props.post.posts[exactPostIndex - 1] : null;
    // const previousPost = props.post.posts[exactPostIndex + 1] ? props.post.posts[exactPostIndex + 1] : null;

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).customCopy = copy;
    }, []);

    useEffect(() => {
        if (exactPost) {
            const allPostBodyAnchors = window.document.querySelectorAll('.truePostBody a');
            const allPostBodyPreCode = window.document.querySelectorAll('.postBodyPreCode');

            const allPostBodyH1 = window.document.querySelectorAll('.truePostBody h1');
            const allPostBodyH2 = window.document.querySelectorAll('.truePostBody h2');
            const allPostBodyH3 = window.document.querySelectorAll('.truePostBody h3');
            const allPostBodyH4 = window.document.querySelectorAll('.truePostBody h4');
            const allPostBodyH5 = window.document.querySelectorAll('.truePostBody h5');
            const allPostBodyH6 = window.document.querySelectorAll('.truePostBody h6');

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

            allPostBodyH1.forEach((h1) => {
                h1.id = strToSlug(h1.textContent as string);
            });

            allPostBodyH2.forEach((h2) => {
                h2.id = strToSlug(h2.textContent as string);
            });

            allPostBodyH3.forEach((h3) => {
                h3.id = strToSlug(h3.textContent as string);
            });

            allPostBodyH4.forEach((h4) => {
                h4.id = strToSlug(h4.textContent as string);
            });

            allPostBodyH5.forEach((h5) => {
                h5.id = strToSlug(h5.textContent as string);
            });

            allPostBodyH6.forEach((h6) => {
                h6.id = strToSlug(h6.textContent as string);
            });

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

    const mdParser: MarkdownIt = new MarkdownIt({
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return (
                        '<pre style="font-family: Monaco, monospace;" class="postBodyPreCode"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>'
                    );
                } catch (__) {}
            }

            return (
                '<pre style="font-family: Monaco, monospace;" class="postBodyPreCode"><code>' +
                mdParser.utils.escapeHtml(str) +
                '</code></pre>'
            );
        },
        // html: true,
        // linkify: true,
        // breaks: true,
    });

    /*
	function to return dangerous markup
	*/
    const createMarkup = (markup: string) => {
        console.log('MARKUP => ', markup);
        return { __html: decode(markup) };
    };

    // const handleAddCommentBtnClick = () => {
    //     setIsCommenting(true);
    //     setShowCommentModal(true);
    // };

    // function handleAddReplyBtnClick() {
    //     setCurrentCommentId(this.currentCommentId);
    //     setIsCommenting(false);
    //     setShowCommentModal(true);
    // }

    // function handleDeleteComment() {
    //     //create a deep copy of the currentPostComments
    //     const newCurrentPostComments = JSON.parse(JSON.stringify(this.currentPostComments));

    //     //create an updated post object
    //     const updatedPost = {
    //         //add the new comment to the comments array of the current post
    //         comments: newCurrentPostComments.filter((comment) => comment._id !== this.currentComment._id),
    //         commentsUpdateAccessKey: config.commentsUpdateAccessKey,
    //     };

    //     swal({
    //         title: '',
    //         text: `Delete reply from "${this.currentComment.comment_author}"?`,
    //         icon: 'warning',
    //         buttons: {
    //             cancel: 'No',
    //             confirm: {
    //                 text: 'Yes, Delete',
    //                 className: 'deleteConfirmBtn',
    //             },
    //         },
    //     }).then((willDelete) => {
    //         if (willDelete) {
    //             props.updatePostComments(this.currentPostId, updatedPost);
    //         }
    //     });
    // }

    // function handleDeleteReply() {
    //     //get a new copy of the current post comments array (deep copy)
    //     const newCurrentPostComments = JSON.parse(JSON.stringify(this.currentPostComments));

    //     const mappedCurrentPostComments = newCurrentPostComments.map((comment) => {
    //         if (comment._id === this.currentComment._id) {
    //             comment.replies = comment.replies.filter((reply) => reply._id !== this.currentReply._id);
    //             return comment;
    //         }
    //         return comment;
    //     });

    //     const updatedPost = {
    //         comments: mappedCurrentPostComments,
    //         commentsUpdateAccessKey: config.commentsUpdateAccessKey,
    //     };

    //     swal({
    //         title: '',
    //         text: `Delete ${this.currentReply.reply_author}'s reply to "${this.currentComment.comment_author}"?`,
    //         icon: 'warning',
    //         buttons: {
    //             cancel: 'No',
    //             confirm: {
    //                 text: 'Yes, Delete',
    //                 className: 'deleteConfirmBtn',
    //             },
    //         },
    //     }).then((willDelete) => {
    //         if (willDelete) {
    //             props.updatePostComments(this.currentPostId, updatedPost);
    //         }
    //     });
    // }

    // !props.post.isLoaded ? null : exactPost ? null : setTimeout(() => setShouldLoad404(true), 3000);

    return (
        <Fragment>
            {!postInfo.post ? (
                <Custom404 />
            ) : (
                <Fragment>
                    <NextSeo
                        title={`${exactPost.title} :: Blog - Gideon Idoko`}
                        description={exactPost.description}
                        canonical={`https://gideonidoko.com/blog/${exactPost.slug}`}
                        openGraph={{
                            url: `https://gideonidoko.com/blog/${exactPost.slug}`,
                            title: `${exactPost.title} :: Blog - Gideon Idoko`,
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
                            site_name: 'Blog - Gideon Idoko',
                        }}
                        twitter={{
                            handle: '@IamGideonIdoko',
                            site: '@IamGideonIdoko',
                            cardType: 'summary_large_image',
                        }}
                    />

                    <Head>
                        <title>{`${exactPost.title} :: Blog - Gideon Idoko`}</title>
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
                                            dangerouslySetInnerHTML={createMarkup(mdParser.render(exactPost.body))}
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

                                        <div className={styles.postShare}>
                                            <div className={styles.postShareBtns}>
                                                <span>Share: </span>
                                                <button
                                                    className={styles.shareToTwitterBtn}
                                                    onClick={() =>
                                                        shareToSocialMedia({
                                                            type: 'twitter',
                                                            text: exactPost.description,
                                                            hashtags: exactPost.tags as string[],
                                                        })
                                                    }
                                                >
                                                    <i className="fab fa-twitter"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.postPagination}>
                                            <div className={styles.ppLeft}>
                                                {previousPost && (
                                                    <Link href={`/blog/${previousPost.slug}`}>
                                                        <a>← {previousPost.title}</a>
                                                    </Link>
                                                )}
                                            </div>
                                            <div className={styles.ppRight}>
                                                {nextPost && (
                                                    <Link href={`/blog/${nextPost.slug}`}>
                                                        <a>{nextPost.title} →</a>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className={styles.blogFooter}>
                                    <div className={styles.commentSection}>
                                        <div className={styles.commentSectionHeader}>
                                            <div>
                                                <span>Comments ({exactPost.comments.length})</span>
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
                                            currentPostAuthor={exactPost.author_name}
                                            isCommenting={isCommenting}
                                            currentPostComments={exactPost.comments}
                                            currentPostId={exactPost._id}
                                            updatePostComments={props.updatePostComments}
                                            resetPostUpdated={props.resetPostUpdated}
                                            isAdmin={props.isAuthenticated}
                                            isPostAuthor={
                                                props.isAuthenticated
                                                    ? exactPost.author_username === props.adminuser.username
                                                    : false
                                            }
                                            isPostUpdated={props.post.isPostUpdated}
                                            currentCommentId={currentCommentId}
                                            currentAdminName={props.isAuthenticated ? props.adminuser.name : null}
                                        />
                                        <div className={styles.commentSectionBody}>
                                            {exactPost.comments.map((comment) => (
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
                                                                    {comment.isAdmin && comment.isPostAuthor && (
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
                                                                            onClick={handleAddReplyBtnClick.bind({
                                                                                currentCommentId: comment._id,
                                                                            })}
                                                                            className={styles.commentReplyBtn}
                                                                        >
                                                                            <i className="neu-turn-right"></i>{' '}
                                                                            <span>Reply</span>
                                                                        </button>
                                                                    )}

                                                                    {props.isAuthenticated &&
                                                                    exactPost.author_username ===
                                                                        props.adminuser.username ? (
                                                                        <button
                                                                            className={styles.commentDeleteBtn}
                                                                            onClick={handleDeleteComment.bind({
                                                                                currentPostComments:
                                                                                    exactPost.comments,
                                                                                currentComment: comment,
                                                                                currentPostId: exactPost._id,
                                                                            })}
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
                                                                    <span className={styles.srLeftAdminGravatar}>
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
                                                                        {reply.isAdmin && reply.isPostAuthor && (
                                                                            <i className="neu-tick-circle"></i>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <span>
                                                                            {moment(reply.date).format('MMM DD')}
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
                                                                        {props.isAuthenticated &&
                                                                        exactPost.author_username ===
                                                                            props.adminuser.username ? (
                                                                            <button
                                                                                className={styles.replyDeleteBtn}
                                                                                onClick={handleDeleteReply.bind({
                                                                                    currentPostComments:
                                                                                        exactPost.comments,
                                                                                    currentReply: reply,
                                                                                    currentPostId: exactPost._id,
                                                                                    currentComment: comment,
                                                                                })}
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
                                </div> */}
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
        return { props: { postInfo: res?.data?.post } };
    } catch (err) {
        console.log('Fetch Error => ', err);
        return { props: { postInfo: { post: null, nextPost: [], prevPost: [] } } };
    }
};