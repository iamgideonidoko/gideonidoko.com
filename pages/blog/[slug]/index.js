import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import CommentModal from '../../../components/blog/CommentModal';
import Custom404 from '../../404';
import swal from 'sweetalert';
import { resetPostUpdated, updatePostComments } from '../../../store/actions/postActions';
import { getReadTime, shareToSocialMedia, strToSlug } from '../../../helper';
import copy from 'copy-to-clipboard';
import { config } from '../../../config/keys';
import styles from '../../../styles/SinglePost.module.css';
import 'highlight.js/styles/monokai.css';
import { NextSeo } from 'next-seo';
import axios from 'axios';

const SinglePost = (props) => {
	const router = useRouter();
	const { slug } = router.query;

	//local state
	const [showCommentModal, setShowCommentModal] = useState(false);
	const [isCommenting, setIsCommenting] = useState(true);
	const [currentCommentId, setCurrentCommentId] = useState('');

	//handling 404
	const [shouldLoad404, setShouldLoad404] = useState(false);


	//get array of all posts with given slug
	const fetchedSinglePost = props.post.posts.filter(post => post.slug === slug);

	//get the exact post which is the first and only post
	const exactPost = fetchedSinglePost[0];

	const exactPostIndex = props.post.posts.indexOf(exactPost);

	const nextPost = props.post.posts[exactPostIndex - 1] ? props.post.posts[exactPostIndex - 1] : null;
	const previousPost = props.post.posts[exactPostIndex + 1] ? props.post.posts[exactPostIndex + 1] : null;

	useEffect(() => {
		window.customCopy = copy;
	}, [])


	useEffect(() => {
		if (exactPost) {
			const allPostBodyAnchors = window.document.querySelectorAll(".truePostBody a");
			const allPostBodyPreCode = window.document.querySelectorAll(".postBodyPreCode");

			const allPostBodyH1 = window.document.querySelectorAll(".truePostBody h1");
			const allPostBodyH2 = window.document.querySelectorAll(".truePostBody h2");
			const allPostBodyH3 = window.document.querySelectorAll(".truePostBody h3");
			const allPostBodyH4 = window.document.querySelectorAll(".truePostBody h4");
			const allPostBodyH5 = window.document.querySelectorAll(".truePostBody h5");
			const allPostBodyH6 = window.document.querySelectorAll(".truePostBody h6");

			const allPostBodyTable = window.document.querySelectorAll(".truePostBody table");

			const truePostBody = window.document.querySelector(".truePostBody");

			if (!window.document.querySelector('.postBodyTable')) {	
				allPostBodyTable.forEach(table => {
					const tableDiv = window.document.createElement("div");
					!tableDiv.classList.contains("postBodyTable") && tableDiv.classList.add("postBodyTable");
					let clonedTable = table.cloneNode(true);
					tableDiv.appendChild(clonedTable);
					
					truePostBody.insertBefore(tableDiv, table);
					truePostBody.removeChild(table);
				})
			}

			allPostBodyH1.forEach(h1 => {
				h1.id = strToSlug(h1.textContent);
			});

			allPostBodyH2.forEach(h2 => {
				h2.id = strToSlug(h2.textContent);
			});

			allPostBodyH3.forEach(h3 => {
				h3.id = strToSlug(h3.textContent);
			});

			allPostBodyH4.forEach(h4 => {
				h4.id = strToSlug(h4.textContent);
			});

			allPostBodyH5.forEach(h5 => {
				h5.id = strToSlug(h5.textContent);
			});

			allPostBodyH6.forEach(h6 => {
				h6.id = strToSlug(h6.textContent);
			});

			allPostBodyAnchors.forEach(a => {
				//get hostname of website address and link address
				const siteHostname = window.location.href.split('/')[2];
				const linkHostname = a.href.split('/')[2];

				if (siteHostname !== linkHostname) {
					//add target attribut to external links
					!a.hasAttribute("target") && a.setAttribute("target", "_blank");
					!a.hasAttribute("rel") && a.setAttribute("rel", "noopener noreferrer");
				}

			});


			allPostBodyPreCode.forEach((pre, index) => {
				// for code snippet
				const copyBtn = window.document.createElement("button");
				const copyBtnTextNode = window.document.createTextNode("Copied");
				const i = window.document.createElement("i");
				const span = window.document.createElement("span");

				i.classList.add("neu-copy");
				// span.classList.a
				span.appendChild(copyBtnTextNode);
				copyBtn.classList.add("codeCopyBtn");
				copyBtn.classList.add(`codeCopyBtn${index}`);

				copyBtn.appendChild(i);
				copyBtn.appendChild(span);

				window[`customCopyText${index}`] = pre.childNodes[0].textContent;
				/*window[`customCopyAlert${index}`] = function() {
					window.document.querySelector(`.codeCopyBtn${index} span`).style.display='inline';
					setTimeout(function() { window.document.querySelector(`.codeCopyBtn${index} span`).style.display='none'; }, 3000);
				};*/

				copyBtn.setAttribute("onclick", `(function copySnippet(){ window.customCopy(window.customCopyText${index}); window.document.querySelector('.codeCopyBtn${index} span').style.display='inline'; setTimeout(function() { window.document.querySelector('.codeCopyBtn${index} span').style.display='none'; }, 3000) })()`);
				pre.childNodes.length === 1 && pre.appendChild(copyBtn);
			});
		}
	}, [exactPost])




	const mdParser = new MarkdownIt({
		highlight: function (str, lang) {
		    if (lang && hljs.getLanguage(lang)) {
		      try {
		        return '<pre style="font-family: Monaco, monospace;" class="postBodyPreCode"><code>' +
		               hljs.highlight(lang, str, true).value +
		               '</code></pre>';
		      } catch (__) {}
		    }

		    return '<pre style="font-family: Monaco, monospace;" class="postBodyPreCode"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
		}
	});

	/*
	function to return dangerous markup
	*/
	const createMarkup = (markup) => {
		return { __html: markup };
	}


	const handleAddCommentBtnClick = () => {
		setIsCommenting(true);
		setShowCommentModal(true);
	}

	function handleAddReplyBtnClick() {
		setCurrentCommentId(this.currentCommentId);	
		setIsCommenting(false);
		setShowCommentModal(true);	
	}

	function handleDeleteComment() {
		//create a deep copy of the currentPostComments
		const newCurrentPostComments = JSON.parse(JSON.stringify(this.currentPostComments));


		//create an updated post object
		const updatedPost = {
			//add the new comment to the comments array of the current post
			comments: newCurrentPostComments.filter(comment => comment._id !== this.currentComment._id),
			commentsUpdateAccessKey: config.commentsUpdateAccessKey
		}

		swal({
			title: "",
			text: `Delete reply from "${this.currentComment.comment_author}"?`,
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
				props.updatePostComments(this.currentPostId, updatedPost);
			}
		})

	}

	function handleDeleteReply() {
		//get a new copy of the current post comments array (deep copy)
		const newCurrentPostComments = JSON.parse(JSON.stringify(this.currentPostComments));

		const mappedCurrentPostComments = newCurrentPostComments.map(comment => {
			if(comment._id === this.currentComment._id) {
				comment.replies = comment.replies.filter(reply => reply._id !== this.currentReply._id);
				return comment;
			}
			return comment;
		});

		const updatedPost = {
			comments: mappedCurrentPostComments,
			commentsUpdateAccessKey: config.commentsUpdateAccessKey
		}


		swal({
			title: "",
			text: `Delete ${this.currentReply.reply_author}'s reply to "${this.currentComment.comment_author}"?`,
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
				props.updatePostComments(this.currentPostId, updatedPost);
			}
		})

	}


	!props.post.isLoaded ? null : exactPost ? null : setTimeout(() => setShouldLoad404(true), 3000);

	return (
		<Fragment>
			<NextSeo
				title={ !props.post.isLoaded ? (props.singlePost && `${props.singlePost.title} :: Blog - Gideon Idoko`) : exactPost ? `${exactPost.title} :: Blog - Gideon Idoko` : !shouldLoad404 ? '' : "Page Not Found : ( " }
				description={ !props.post.isLoaded ? (props.singlePost && props.singlePost.description) : exactPost ? exactPost.description : !shouldLoad404 ? '' : '' }
				canonical={!props.post.isLoaded ? (props.singlePost && `https://gideonidoko.com/blog/${props.singlePost.slug}`) : exactPost ? `https://gideonidoko.com/blog/${exactPost.slug}` : !shouldLoad404 ? '' : ''}
				openGraph={{
					url: !props.post.isLoaded ? (props.singlePost && `https://gideonidoko.com/blog/${props.singlePost.slug}`) : exactPost ? `https://gideonidoko.com/blog/${exactPost.slug}` : !shouldLoad404 ? '' : '',
					title: !props.post.isLoaded ? (props.singlePost && `${props.singlePost.title} :: Blog - Gideon Idoko`) : exactPost ? `${exactPost.title} :: Blog - Gideon Idoko` : !shouldLoad404 ? '' : "Page Not Found : ( ",
					description: !props.post.isLoaded ? (props.singlePost && props.singlePost.description) : exactPost ? exactPost.description : !shouldLoad404 ? '' : '',
					type: 'article',
					article: {
						publishedTime: !props.post.isLoaded ? (props.singlePost && props.singlePost.created_at) : exactPost ? exactPost.created_at : !shouldLoad404 ? '' : '',
						authors: [!props.post.isLoaded ? (props.singlePost && props.singlePost.author_name) : exactPost ? exactPost.author_name : !shouldLoad404 ? '' : '']
					},
					tags: !props.post.isLoaded ? (props.singlePost && props.singlePost.tags) : exactPost ? exactPost.tags : !shouldLoad404 ? [] : [],
					images: [
						{
							url: !props.post.isLoaded ? (props.singlePost && props.singlePost.cover_img) : exactPost ? exactPost.cover_img : !shouldLoad404 ? '' : '',
							alt: !props.post.isLoaded ? (props.singlePost && `${props.singlePost.title}'s cover image`) : exactPost ? `${props.singlePost.title}'s cover image` : !shouldLoad404 ? '' : ''
						}
					],
					site_name: "Blog - Gideon Idoko"
				}}
				twitter={{
				handle: "@IamGideonIdoko",
				site: "@IamGideonIdoko",
				cardType: "summary_large_image"
				}}
			/>
			
			<Head>
			<title>{ !props.post.isLoaded ? (props.singlePost && `${props.singlePost.title} :: Blog - Gideon Idoko`) : exactPost ? `${exactPost.title} :: Blog - Gideon Idoko` : !shouldLoad404 ? null : "Page Not Found : ( " }</title>
			<meta name="keywords" content={ !props.post.isLoaded ? (props.singlePost && props.singlePost.keywords.join(',')) : exactPost ? exactPost.keywords.join(',') : !shouldLoad404 ? '' : '' }></meta>
			</Head>
			<main className={`padding-top-10rem ${styles.singlePostMain}`}>
				<div className="container-max-1248px">
					{
						//check if posts has been fetched and display
						!props.post.isLoaded ? (<div>
						{


						}
							<div className="complex-loader-wrap">
						        <div className="complex-loader"></div>
						    </div>
						</div>) : exactPost ? (<Fragment>
						<div className={styles.singlePostPageWrapper}>

						<div className={styles.blogHeader}>
							<h5 className={styles.breadcrumb}>
							<small>&gt;&gt;&nbsp; <Link href="/blog"><a>Blog</a></Link>&nbsp; &gt;&gt; {exactPost.title}</small>
							</h5>
							<h1 className={styles.postTitle}>{exactPost.title}</h1>
							<h5 className={styles.blogMeta}>
								<span><small>{moment(exactPost.created_at).format('MMM DD, YYYY')}</small></span> &nbsp; |&nbsp; <span><small>{getReadTime(exactPost.body)}</small></span> &nbsp; |&nbsp; <span><small>{exactPost.author_name}</small></span>
							</h5>
							<div className={styles.postCoverWrap}>
								<img className={styles.postCover} src={exactPost.cover_img} alt="Blog Cover" />
							</div>
						</div>

						<div className={styles.blogBody}>
							<div className={`${styles.postBody} truePostBody`} dangerouslySetInnerHTML={createMarkup(mdParser.render(exactPost.body))} />

							<div className={styles.postTags}>
								{exactPost.tags.map((tag, idx) => <span key={idx}><Link href={`/blog/tags/${tag}`}><a>#{ tag }</a></Link></span>)}
							</div>

							<div className={styles.postShare}>
								<div className={styles.postShareBtns}>
									<span>Share: </span>
									<button 
										className={styles.shareToTwitterBtn} 
										onClick={shareToSocialMedia.bind({type: "twitter", text: exactPost.description, hashtags: exactPost.tags})}>
										<i className="fab fa-twitter"></i>
									</button>
								</div>
							</div>	

							<div className={styles.postPagination}>
								<div className={styles.ppLeft}>
									{ previousPost && <Link href={`/blog/${previousPost.slug}`}><a>← { previousPost.title }</a></Link> }
								</div>
								<div className={styles.ppRight}>
									{ nextPost && <Link href={`/blog/${nextPost.slug}`}><a>{ nextPost.title } →</a></Link> }
								</div>
							</div>	

						</div>

						<div className={styles.blogFooter}>
							<div className={styles.commentSection}>
							<div className={styles.commentSectionHeader}>
								<div><span>Comments ({ exactPost.comments.length })</span></div>
								<div>{!exactPost.is_comment_disabled ? <button className={styles.commentModalOpenBtn} onClick={handleAddCommentBtnClick}><i className="neu-pencil-ui"></i> Add a comment</button> : <p style={{opacity: "0.7"}}>Comment disabled.</p>}</div>
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
									isPostAuthor={props.isAuthenticated ? exactPost.author_username === props.adminuser.username : false}
									isPostUpdated={props.post.isPostUpdated}
									currentCommentId={currentCommentId}
									currentAdminName={props.isAuthenticated ? props.adminuser.name : null}
									/>
								<div className={styles.commentSectionBody}>
									{ exactPost.comments.map(comment => (
										<div key={comment._id} className={styles.singleComment}>
										<div className={styles.singleCommentMainContent}>
											<div className={styles.scLeft}>
												{ comment.isAdmin ? 
												<span className={styles.scLeftAdminGravatar}>
													<img src="/assets/img/GideonIdokoDevGravater.png" alt="" />
												</span> : 
												<span className={styles.scLeftUserGravatar}>
													<i className="neu-user-circle"></i>
												</span> 
											}
											</div>
											<div className={styles.scRight}>
												<div className={styles.commentAuthor}>
													<div><span>{ comment.comment_author }</span> {(comment.isAdmin && comment.isPostAuthor) && <i className="neu-tick-circle"></i>}</div>
													<div><span>{ moment(comment.date).format('MMM DD') }</span></div>
												</div>
												{
													/*
												<div className={styles.commentBody}>{ comment.comment_body }</div>
													*/
												}
												<div className={styles.commentBody} dangerouslySetInnerHTML={createMarkup(comment.comment_body)} />
												<div className={styles.commentFooter}>
													<div>
													{
														(!exactPost.is_comment_disabled && <button onClick={handleAddReplyBtnClick.bind({currentCommentId: comment._id})} className={styles.commentReplyBtn}><i className="neu-turn-right"></i> <span>Reply</span></button>)
													}

														{ 

														(props.isAuthenticated && exactPost.author_username === props.adminuser.username) ? <button className={styles.commentDeleteBtn} onClick={handleDeleteComment.bind({ currentPostComments: exactPost.comments, currentComment: comment, currentPostId: exactPost._id })}><i className="neu-trash"></i> <span>Delete</span></button> : null
														}

													</div>
												</div>
											</div>
											</div>

										{/* single reply section*/}
										{ comment.replies.map((reply, index) => (
										<div key={reply._id} className={`${styles.singleReply} ${index == 0 ? styles.firstSingleReply : null}`}>
											<div className={styles.srLeft}>
												{ reply.isAdmin ? 
												<span className={styles.srLeftAdminGravatar}>
													<img src="/assets/img/GideonIdokoDevGravater.png" alt="" />
												</span> : 
												<span className={styles.srLeftUserGravatar}>
													<i className="neu-user-circle"></i>
												</span> 
											}
											</div>
											<div className={styles.srRight}>
												<div className={styles.replyAuthor}>
													<div><span>{ reply.reply_author }</span> {(reply.isAdmin && reply.isPostAuthor) && <i className="neu-tick-circle"></i>}</div>
													<div><span>{ moment(reply.date).format('MMM DD') }</span></div>
												</div>
												<div className={styles.replyBody} dangerouslySetInnerHTML={createMarkup(reply.reply_body)} />

												<div className={styles.replyFooter}>
													<div>
														{ 

														(props.isAuthenticated && exactPost.author_username === props.adminuser.username) ? <button className={styles.replyDeleteBtn} onClick={handleDeleteReply.bind({ currentPostComments: exactPost.comments, currentReply: reply, currentPostId: exactPost._id, currentComment: comment })}><i className="neu-trash"></i> <span>Delete</span></button> : null
														}
													</div>
												</div>
											</div>
										</div>))}
										</div>
										))}
								</div>
								</div>
							</div>
						</div>

							</Fragment>) : (<Fragment>
							{
								shouldLoad404 && <Custom404 />
							}
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
	adminuser: state.auth.adminuser
})

export default connect(mapStateToProps, { resetPostUpdated, updatePostComments })(SinglePost);

export async function getStaticPaths(context) {
	return ({ paths: [], fallback: 'blocking' });
  }

//call at build time and not on client side
export async function getStaticProps(context) {
	// Call an external API endpoint to get single post.
	const getSinglePost = await axios.get(`${config.BEHOST}/api/blogposts/${context.params.slug}`);
	const singlePost = getSinglePost.data;

	// the SinglePost component will receive `singlePost` as a prop at build time
	return {
	  props: { singlePost }
	}
  }
  
