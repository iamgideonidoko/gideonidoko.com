import React, { useState, Fragment, useRef, useEffect } from 'react';
import styles from '../../styles/SinglePost.module.css';
import Rodal from 'rodal';
import SimpleReactValidator from 'simple-react-validator';
import { encode } from 'html-entities';
import { config } from '../../config/keys';
import 'rodal/lib/rodal.css';

const CommentModal = ({
    showCommentModal,
    setShowCommentModal,
    currentPostTitle,
    currentPostAuthor,
    isCommenting,
    currentPostComments,
    currentPostId,
    updatePostComments,
    resetPostUpdated,
    isAdmin,
    isPostAuthor,
    isPostUpdated,
    currentCommentId,
    currentAdminName,
}) => {
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
    const [, forceUpdate] = useState();

    //instantiate the validator as a singleton
    const simpleValidator = useRef(
        new SimpleReactValidator({
            element: (message, className) => <div className={'formErrorMsg'}>{message}</div>,
        }),
    );

    const handleCommentFormSubmit = (e) => {
        e.preventDefault();

        forceUpdate(1);

        if (simpleValidator.current.allValid()) {
            //all input is valid
            console.log('All values are valid');

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

                //update the post comments
                updatePostComments(currentPostId, updatedPost);
            } else {
                console.log('Attempting to reply...');
                //get a new copy of the current post comments array (deep copy)
                const newCurrentPostComments = JSON.parse(JSON.stringify(currentPostComments));

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
                updatePostComments(currentPostId, updatedPost);
            }
        } else {
            console.log('Not all values are valid');
            //input not valid, so show error
            simpleValidator.current.showMessages(); //show all errors if exist
            forceUpdate(1); //force update component to display error
        }
    };

    const handleCommentInputChange = (e) => {
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

    const resolveAfterResetUpdate = () => {
        return new Promise((resolve, reject) => {
            resetPostUpdated();
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    };

    if (isPostUpdated) {
        resolveAfterResetUpdate().then((res) => res && cancelCommentModal());
    }

    return (
        <Fragment>
            <Rodal
                visible={showCommentModal}
                showCloseButton={false}
                className="commentModal"
                width={500}
                customStyle={{ height: 'auto' }}
                onClose={cancelCommentModal}
                closeOnEsc={true}
            >
                <form className={styles.commentForm} onSubmit={handleCommentFormSubmit}>
                    <label>
                        {isCommenting ? (
                            <span>
                                You're commenting on this post:{' '}
                                <b>
                                    {currentPostTitle.length > 25
                                        ? `${currentPostTitle.substr(0, 25) + '...'}`
                                        : currentPostTitle}
                                </b>
                            </span>
                        ) : (
                            <span>
                                You're replying to:{' '}
                                <b>
                                    {currentPostComments.find((comment) => comment._id === currentCommentId)
                                        ? currentPostComments.find((comment) => comment._id === currentCommentId)
                                              .comment_author
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
                                                .comment_author
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
