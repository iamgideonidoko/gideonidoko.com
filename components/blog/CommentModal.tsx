import React, { useState, Fragment, useRef, SetStateAction, Dispatch } from 'react';
import styles from '../../styles/SinglePost.module.css';
import Rodal from 'rodal';
import SimpleReactValidator from 'simple-react-validator';
import { encode } from 'html-entities';
import { config } from '../../config/keys';
import 'rodal/lib/rodal.css';
import { FullPost, PostComment } from '../../interfaces/post.interface';
import { noAuthPost, noAuthPut } from '../../helper';

interface CommentModalProps {
    showCommentModal: boolean;
    setShowCommentModal: Dispatch<SetStateAction<boolean>>;
    currentPostTitle: string;
    isCommenting: boolean;
    currentPostComments: Array<PostComment>;
    currentPostId: string;
    isAdmin: boolean;
    isPostAuthor: boolean;
    currentCommentId: string;
    currentAdminName: string | undefined | null;
    setComments: Dispatch<SetStateAction<PostComment[]>>;
    exactPost: FullPost;
}

const CommentModal = ({
    showCommentModal,
    setShowCommentModal,
    currentPostTitle,
    isCommenting,
    currentPostComments,
    currentPostId,
    isAdmin,
    isPostAuthor,
    currentCommentId,
    currentAdminName,
    setComments,
    exactPost,
}: CommentModalProps) => {
    const getCommentAuthorFromLocalStorage = () => {
        if (typeof window !== 'undefined') {
            const lsCommentAuthor = localStorage.getItem(config.localStorageCommentAuthorId);
            return lsCommentAuthor ? lsCommentAuthor : '';
        }
        return '';
    };

    //local state
    const [commentAuthor, setCommentAuthor] = useState(
        currentAdminName ? currentAdminName : getCommentAuthorFromLocalStorage(),
    );
    const [commentBody, setCommentBody] = useState('');
    const [, forceUpdate] = useState<number>();

    //instantiate the validator as a singleton
    const simpleValidator = useRef(
        new SimpleReactValidator({
            element: (message: string) => <div className={'formErrorMsg'}>{message}</div>,
        }),
    );

    const handleCommentFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        forceUpdate(1);

        if (simpleValidator.current.allValid()) {
            //all input is valid

            if (typeof window !== 'undefined') {
                localStorage.setItem(config.localStorageCommentAuthorId, commentAuthor);
            }

            if (isCommenting) {
                //create an updated post object
                const updatedPost = {
                    //add the new comment to the comments array of the current post
                    comments: [
                        ...currentPostComments,
                        {
                            comment_author: commentAuthor.trim(),
                            comment_body: encode(commentBody),
                            isAdmin,
                            isPostAuthor,
                        },
                    ],
                    commentsUpdateAccessKey: config.commentsUpdateAccessKey,
                };

                try {
                    const res = await noAuthPut(`/post/${currentPostId}/comments`, updatedPost);
                    setComments(res?.data?.post?.comments);
                    cancelCommentModal();
                    try {
                        const mail = {
                            subject: `A comment was made on your post.`,
                            text: `${commentAuthor} commented on your post, ${
                                exactPost?.title
                            }. The comment: ${commentBody}. Check it out here: ${
                                typeof window !== 'undefined' && window.document.URL
                            }`,
                            html: `<p><b>${commentAuthor}</b> commented on your post, <b>${
                                exactPost?.title
                            }</b></p>. <br /> <p>The comment: ${commentBody}</p> <br /> <p>Check it out here: ${
                                typeof window !== 'undefined' && window.document.URL
                            }</p>`,
                        };
                        await noAuthPost(`/mail`, mail);
                    } catch (err) {}
                } catch (err) {
                    console.error('Comment post error => ', err);
                }

                //update the post comments
                // updatePostComments(currentPostId, updatedPost);
            } else {
                //get a new copy of the current post comments array (deep copy)
                const newCurrentPostComments: PostComment[] = JSON.parse(JSON.stringify(currentPostComments));

                const currentComment = newCurrentPostComments.find((comment) => comment._id === currentCommentId);

                const mappedCurrentPostComments = newCurrentPostComments.map((comment) => {
                    if (comment._id === currentCommentId) {
                        comment.replies = [
                            ...comment.replies,
                            {
                                reply_author: commentAuthor.trim(),
                                reply_body: encode(commentBody),
                                isAdmin,
                                isPostAuthor,
                            },
                        ];
                        return comment;
                    }
                    return comment;
                });

                const updatedPost = {
                    comments: mappedCurrentPostComments,
                    commentsUpdateAccessKey: config.commentsUpdateAccessKey,
                };

                //update the post comments
                try {
                    const res = await noAuthPut(`/post/${currentPostId}/comments`, updatedPost);
                    setComments(res?.data?.post?.comments);
                    cancelCommentModal();
                    try {
                        const mail = {
                            subject: `A reply was made to a comment on your post.`,
                            text: `${commentAuthor.trim()} replied to a comment by ${
                                currentComment?.comment_author
                            } on your post, ${exactPost?.title}. <br /> The comment: ${
                                currentComment?.comment_body
                            } <br /> The reply: ${commentBody} <br /> Check it out here: ${
                                typeof window !== 'undefined' && window.document.URL
                            }`,
                            html: `<p><b>${commentAuthor.trim()}</b> replied to a comment by <b>${
                                currentComment?.comment_author
                            }</b> on your post, <b>${exactPost?.title}</b></p>. <br /> <p>The comment: ${
                                currentComment?.comment_body
                            }</p> <br /> <p>The reply: ${commentBody}</p> <br /> <p>Check it out here: ${
                                typeof window !== 'undefined' && window.document.URL
                            }</p>`,
                        };
                        await noAuthPost(`/mail`, mail);
                    } catch (err) {}
                } catch (err) {
                    console.error('Comment post error => ', err);
                }
            }
        } else {
            //input not valid, so show error
            simpleValidator.current.showMessages(); //show all errors if exist
            forceUpdate(1); //force update component to display error
        }
    };

    const handleCommentInputChange: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'nameField':
                setCommentAuthor(e.target.value);
                break;
            case 'textField':
                setCommentBody(e.target.value);
                break;
        }
    };

    const cancelCommentModal = () => {
        setShowCommentModal(false);
        setCommentAuthor(currentAdminName ? currentAdminName : getCommentAuthorFromLocalStorage());
        setCommentBody('');
        simpleValidator.current.hideMessages();
    };

    // if (isPostUpdated) {
    //     resolveAfterResetUpdate().then((res) => res && cancelCommentModal());
    // }

    return (
        <Fragment>
            <Rodal
                visible={showCommentModal}
                showCloseButton={false}
                className="commentModal"
                width={500}
                customStyles={{ height: 'auto' }}
                onClose={cancelCommentModal}
                closeOnEsc={true}
            >
                <form className={styles.commentForm} onSubmit={handleCommentFormSubmit}>
                    <label>
                        {isCommenting ? (
                            <span>
                                You&apos;re commenting on this post:{' '}
                                <b>
                                    {currentPostTitle.length > 25
                                        ? `${currentPostTitle.substr(0, 25) + '...'}`
                                        : currentPostTitle}
                                </b>
                            </span>
                        ) : (
                            <span>
                                You&apos;re replying to:{' '}
                                <b>
                                    {currentPostComments.find((comment) => comment._id === currentCommentId)
                                        ? currentPostComments.find((comment) => comment._id === currentCommentId)
                                              ?.comment_author
                                        : null}
                                </b>
                            </span>
                        )}
                    </label>

                    <input
                        type="text"
                        value={commentAuthor}
                        disabled={isAdmin}
                        onChange={handleCommentInputChange}
                        className={styles.commentFormAuthor}
                        name="nameField"
                        placeholder="Enter your name"
                        required={true}
                    />
                    {
                        /* simple validation */
                        simpleValidator.current.message(
                            'nameField',
                            commentAuthor,
                            'required|alpha_num_space|between:2,25',
                        )
                    }

                    <textarea
                        className={styles.commentFormBody}
                        value={commentBody}
                        name="textField"
                        onChange={handleCommentInputChange}
                        required={true}
                        placeholder={
                            isCommenting
                                ? 'Comment to this...'
                                : `Reply to ${
                                      currentPostComments.find((comment) => comment._id === currentCommentId)
                                          ? currentPostComments.find((comment) => comment._id === currentCommentId)
                                                ?.comment_author
                                          : null
                                  }...`
                        }
                    ></textarea>
                    {
                        /* simple validation */
                        simpleValidator.current.message('textField', commentBody, 'required|between:2,500')
                    }

                    <div className={styles.commentFormActionBtn}>
                        <button type="button" className={styles.cancelCommentFormBtn} onClick={cancelCommentModal}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitCommentFormBtn}>
                            Submit
                        </button>
                    </div>
                </form>
            </Rodal>
        </Fragment>
    );
};

export default CommentModal;
