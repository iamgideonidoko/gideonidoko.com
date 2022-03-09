// import Head from 'next/head';
// import { Fragment, useEffect, useState } from 'react';
// import Link from 'next/link';
// import styles from '../../styles/AllComments.module.css';
// import { useRouter } from 'next/router';
// import { NextSeo } from 'next-seo';
// import { CommentPaginatedPosts, CommentPost, PaginatedPosts, PostComment } from '../../interfaces/post.interface';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { authGet } from '../../helper';

// const AllComments = ({}) => {
//     const router = useRouter();
//     const auth = useSelector(({ auth }: RootState) => auth);

//     const [posts, setPosts] = useState<CommentPaginatedPosts | null>(null);
//     const [shownId, setShownId] = useState<string[]>([]);
//     const [loaded, setLoaded] = useState<boolean>(false);

//     function togglePost(postId: string) {
//         shownId.includes(postId) ? setShownId(shownId.filter((id) => id != postId)) : setShownId([...shownId, postId]);
//     }

//     useEffect(() => {
//         setLoaded(true);
//         (async () => {
//             try {
//                 const res = await authGet(`/posts/comments`);
//                 console.log('Comment fetch response => ', res);
//                 setPosts(res?.data?.posts || null);
//             } catch (err) {
//                 console.error('Comments fetch error => ', err);
//             }
//         })();
//     }, []);

//     /*
// 	function to return dangerous markup
// 	*/
//     const createMarkup = (markup: string) => {
//         return { __html: markup };
//     };

//     return (
//         <Fragment>
//             <NextSeo noindex={true} nofollow={true} />
//             <Head>
//                 <title>Received Comments - Gideon Idoko</title>
//             </Head>
//             {loaded && (
//                 <main className={`padding-top-10rem`}>
//                     <div className="container-max-1248px">
//                         {!auth.isAuthenticated ? (
//                             <div>
//                                 <div className="loginRedirectMsg">
//                                     <h1>You are not logged in.</h1>
//                                     <p>Redirecting to login page...</p>
//                                     {typeof window !== 'undefined' &&
//                                         window.setTimeout(() => {
//                                             router.push('/login');
//                                         }, 3000)}
//                                 </div>
//                             </div>
//                         ) : (
//                             <Fragment>
//                                 {/*ALL COMMENTS PAGE*/}
//                                 <div className={styles.contactsWrap}>
//                                     <h1 className={styles.pageTitle}>Received Comments</h1>
//                                     <p>Below are all the comments you&apos;ve recieved from the your posts.</p>

//                                     {
//                                         <ul className={styles.postList}>
//                                             {posts?.docs.map(
//                                                 (post) => (
//                                                     <li key={post._id}>
//                                                         <div className={styles.postHead}>
//                                                             <span>
//                                                                 {post.title} [
//                                                                 <small>Comments:({post.comments.length})</small>]
//                                                             </span>

//                                                             <span>
//                                                                 <Link href={`/blog/${post.slug}`}>
//                                                                     <a className={styles.externalLink}>
//                                                                         <i className="neu-external-link"></i>
//                                                                     </a>
//                                                                 </Link>
//                                                                 <button
//                                                                     className={styles.togglePostBtn}
//                                                                     onClick={() => togglePost(post._id)}
//                                                                 >
//                                                                     <i
//                                                                         className={
//                                                                             shownId.includes(post._id)
//                                                                                 ? 'neu-minus-circle'
//                                                                                 : 'neu-add-circle'
//                                                                         }
//                                                                     ></i>
//                                                                 </button>
//                                                             </span>
//                                                         </div>
//                                                         {shownId.includes(post._id) && post.comments.length !== 0 ? (
//                                                             <div className={styles.postBody}>
//                                                                 {post.comments.map((comment) => (
//                                                                     <div className={styles.singleComment} key={comment._id}>
//                                                                         <div className={styles.commentHead}>
//                                                                             <span>
//                                                                                 <b>{comment.comment_author}</b> [
//                                                                                 <small>
//                                                                                     <i>
//                                                                                         replies({comment.replies.length}
//                                                                                         )
//                                                                                     </i>
//                                                                                 </small>
//                                                                                 ]:{' '}
//                                                                                 <span
//                                                                                     className={styles.singleCommentBody}
//                                                                                     dangerouslySetInnerHTML={createMarkup(
//                                                                                         comment.comment_body,
//                                                                                     )}
//                                                                                 />
//                                                                             </span>
//                                                                             <span>
//                                                                                 <button
//                                                                                     className={styles.togglePostBtn}
//                                                                                     onClick={() => togglePost(
//                                                                                         comment._id
//                                                                                     )}
//                                                                                 >
//                                                                                     <i
//                                                                                         className={
//                                                                                             shownId.includes(
//                                                                                                 comment._id
//                                                                                             )
//                                                                                                 ? 'neu-minus-circle'
//                                                                                                 : 'neu-add-circle'
//                                                                                         }
//                                                                                     ></i>
//                                                                                 </button>
//                                                                             </span>
//                                                                         </div>
//                                                                         {shownId.includes(comment._id) &&
//                                                                         comment.replies.length !== 0 ? (
//                                                                             <div className={styles.commentBody}>
//                                                                                 {comment.replies.map((reply) => (
//                                                                                     <div className={styles.singleReply}>
//                                                                                         <b>{reply.reply_author}</b>:{' '}
//                                                                                         <span
//                                                                                             dangerouslySetInnerHTML={createMarkup(
//                                                                                                 reply.reply_body,
//                                                                                             )}
//                                                                                         />
//                                                                                     </div>
//                                                                                 ))}
//                                                                             </div>
//                                                                         ) : shownId.includes(comment._id) &&
//                                                                           comment.replies.length === 0 ? (
//                                                                             <div
//                                                                                 className={`${styles.commentBody} ${styles.p05}`}
//                                                                             >
//                                                                                 No Comments
//                                                                             </div>
//                                                                         ) : null}
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         ) : shownId.includes(post._id) && post.comments.length === 0 ? (
//                                                             <div className={styles.postBody}>No Comments</div>
//                                                         ) : null}
//                                                     </li>
//                                                 ),
//                                             )}
//                                         </ul>
//                                     }
//                                     {/* {props.post.posts.length === 0 && <div>No Posts Found.</div>} */}
//                                 </div>
//                             </Fragment>
//                         )}
//                     </div>
//                 </main>
//             )}
//         </Fragment>
//     );
// };

// export default AllComments;
