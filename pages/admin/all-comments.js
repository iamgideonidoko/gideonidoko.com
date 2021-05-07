import Head from 'next/head';
import { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import { deleteContact } from '../../store/actions/contactActions';
import Link from 'next/link';
import styles from '../../styles/AllComments.module.css';


//get router
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const AllComments = (props) => {

	const router = useRouter();


	const [shownId, setShownId] = useState([]);

	function togglePost() {
		shownId.includes(this) ? setShownId(shownId.filter(id => id != this)) : setShownId([...shownId, this]);
	}

	function handleContactDelete() {
		swal({
				title: "Delete Contact?",
				text: `Delete contact from "${this.name}" ?`,
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
					props.deleteContact(this.id);
				}
			})
	}

	
		/*
	function to return dangerous markup
	*/
	const createMarkup = (markup) => {
		return { __html: markup };
	}

	
	return (
		<Fragment>
			<NextSeo noindex={true} nofollow={true} />
			<Head>
				<title>Received Comments - Gideon Idoko</title>
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
				{ /*ALL COMMENTS PAGE*/}
					<div className={styles.contactsWrap}>

					<h1 className={styles.pageTitle}>Received Comments</h1>
					<p>Below are all the comments you've recieved from the your posts.</p>

					<ul className={styles.postList}>
					{ props.post.posts.map(post => <li key={post._id}>
							<div className={styles.postHead}>
								<span>{post.title} [<small>Comments:({post.comments.length})</small>]</span>

								<span>
                                    <Link href={`/blog/${post.slug}`}><a className={styles.externalLink}><i className="neu-external-link"></i></a></Link>
									<button className={styles.togglePostBtn} onClick={togglePost.bind(post._id)}><i className={shownId.includes(post._id) ? "neu-minus-circle" : "neu-add-circle"}></i></button>
									
								</span>
							</div>
								{
                                (shownId.includes(post._id) && post.comments.length !== 0) ? <div className={styles.postBody}>
                                    {post.comments.map(comment => <div className={styles.singleComment}>
                                        <div className={styles.commentHead}>
                                            <span><b>{comment.comment_author}</b> [<small><i>replies({comment.replies.length})</i></small>]:  <span className={styles.singleCommentBody} dangerouslySetInnerHTML={createMarkup(comment.comment_body)} /></span>
                                            <span>
                                                <button className={styles.togglePostBtn} onClick={togglePost.bind(comment._id)}><i className={shownId.includes(comment._id) ? "neu-minus-circle" : "neu-add-circle"}></i></button>
                                            </span>
                                        </div>
                                        {(shownId.includes(comment._id) && comment.replies.length !== 0) ? <div className={styles.commentBody}>
                                            {
                                                comment.replies.map(reply => <div className={styles.singleReply}><b>{reply.reply_author}</b>: <span dangerouslySetInnerHTML={createMarkup(reply.reply_body)} /></div>)
                                            }
                                        </div> : (shownId.includes(comment._id) && comment.replies.length === 0) ? <div className={`${styles.commentBody} ${styles.p05}`}>No Comments</div> : null}

                                    </div>)}
									
								</div> : (shownId.includes(post._id) && post.comments.length === 0) ? <div className={styles.postBody}>No Comments</div> : null
                                }

						</li>)
					}
					</ul>
					{ props.post.posts.length === 0 && <div>No Posts Found.</div>}
								
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
	adminuser: state.auth.adminuser,
	isLoading: state.auth.isLoading,
	isAdminUserLoaded: state.auth.isAdminUserLoaded,
	contacts: state.contact.contacts
})

export default connect(mapStateToProps, { deleteContact })(AllComments);

