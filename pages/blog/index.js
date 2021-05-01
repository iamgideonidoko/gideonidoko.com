import Head from 'next/head';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../store/actions/postActions';
import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import { config } from '../../config/keys';

import AllPostsRender from '../../components/blog/AllPostsRender'
import { NextSeo } from 'next-seo';



const BlogHome = (props) => {

	const allPosts = props.post.posts ? props.post.posts.filter(post => post.is_published === true) : [];

	const numberOfPages = Math.ceil(allPosts.length / config.numberOfPostsPerPage);

	const currentPageNumber = 1;

	const limitStartingNumber = (currentPageNumber - 1) * config.numberOfPostsPerPage;

	const limitEndingNumber = limitStartingNumber + config.numberOfPostsPerPage;

	return (
		<Fragment>
			<NextSeo
				title="Blog - Gideon Idoko"
				description="I write about Software Development & web engineering topics and tools on my blog here."
				canonical="https://gideonidoko.com/blog"
				openGraph={{
					url: "https://gideonidoko.com/blog",
					title: "Blog - Gideon Idoko",
					description: "I write about Software Development & web engineering topics and tools on my blog here.",
					images: [
						{
							url: 'https://gideonidoko.com/GideonIdokoCardImage.png',
							width: 1004,
							height: 591,
							alt: 'Gideon Idoko\'s card image'
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
				<title>Blog - Gideon Idoko</title>
			</Head>
			<main className={`padding-top-10rem ${styles.blogMain}`}>
				<div className="container-max-1248px">
					{
						//check if posts has been fetched and display
						!props.post.isLoaded ? (<div>
							<div className="complex-loader-wrap">
						        <div className="complex-loader"></div>
						    </div>
							<p style={{textAlign: 'center'}}>Loading...</p>
						</div>) : (<Fragment>

						<div className={styles.searchLinkWrapper}>
							<Link href="/blog/search"><a><i className="neu-browse"></i> Search articles</a></Link>
						</div>


						{
							props.post.posts.filter(post => post.is_pinned).length !== 0 ? <div className={styles.pinnedPostWrapper}>
							<h3><i className="neu-pin"></i> Pinned Posts.</h3>
						<AllPostsRender posts={props.post.posts.filter(post => post.is_pinned)} />
							</div> : null
						}
						<AllPostsRender posts={allPosts.slice(limitStartingNumber, limitEndingNumber)} />

						{
							(allPosts.length > config.numberOfPostsPerPage) ? 
							<div className={styles.paginationWrapper}>
								<div className={`${styles.pagination} ${styles.pgnFlexEnd}`}><span><Link href={`/blog/page/${currentPageNumber + 1}`}><a>Next Page →</a></Link></span></div>
							</div> : null
						}
						</Fragment>
						)
					}

				</div>
			</main>
		</Fragment>
	)
}

const mapStateToProps = (state) => ({
	post: state.post
})

export default connect(mapStateToProps, { getPosts })(BlogHome);

