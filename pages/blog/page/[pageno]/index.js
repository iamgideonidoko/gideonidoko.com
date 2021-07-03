import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { connect } from 'react-redux';
import moment from 'moment';
import swal from 'sweetalert';
import AllPostsRender from '../../../../components/blog/AllPostsRender'
import { config } from '../../../../config/keys';
import styles from '../../../../styles/Blog.module.css';
import { NextSeo } from 'next-seo';


const Page = (props) => {
	const router = useRouter();
	const { pageno } = router.query;

	const allPosts = props.post.posts ? props.post.posts.filter(post => post.is_published === true) : [];

	const numberOfPages = Math.ceil(allPosts.length / config.numberOfPostsPerPage);

	const currentPageNumber = Number(Number(pageno).toFixed(0));

	const limitStartingNumber = (currentPageNumber - 1) * config.numberOfPostsPerPage;

	const limitEndingNumber = limitStartingNumber + config.numberOfPostsPerPage;
	
	return (
		<Fragment>
			<NextSeo
				title={!props.post.isLoaded ? 'Loading...' : (!currentPageNumber || currentPageNumber > numberOfPages) ? "404 Error" : `Blog (Page ${currentPageNumber}) - Gideon Idoko`}
				description={`Checkout posts on page ${currentPageNumber}. I write about Software Development & web engineering topics and tools on my blog here.`}
				canonical={`https://gideonidoko.com/blog/page/${currentPageNumber}`}
				openGraph={{
					url: `https://gideonidoko.com/blog/page/${currentPageNumber}`,
					title: !props.post.isLoaded ? 'Loading...' : (!currentPageNumber || currentPageNumber > numberOfPages) ? "404 Error" : `Blog (Page ${currentPageNumber}) - Gideon Idoko`,
					description: !props.post.isLoaded ? 'Loading...' : (!currentPageNumber || currentPageNumber > numberOfPages) ? "404 Error" : `Blog (Page ${currentPageNumber}) - Gideon Idoko`,
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
				<title>{!props.post.isLoaded ? 'Loading...' : (!currentPageNumber || currentPageNumber > numberOfPages) ? "404 Error" : `Blog (Page ${currentPageNumber}) - Gideon Idoko`}</title>
			</Head>
			<main className={`padding-top-10rem ${styles.blogMain}`}>
				<div className="container-max-1248px">
					{
						//check if posts has been fetched and display
						!props.post.isLoaded ? (<div>
							<div className="complex-loader-wrap">
						        <div className="complex-loader"></div>
						    </div>
						</div>) : (!currentPageNumber || currentPageNumber > numberOfPages) ? (<Fragment>
							PAGE DOES NOT EXIST							
						</Fragment>) : (<Fragment>

						<div className={styles.searchLinkWrapper}>
							<Link href="/blog/search"><a><i className="neu-browse"></i> Search articles</a></Link>
						</div>


							<AllPostsRender posts={allPosts.slice(limitStartingNumber, limitEndingNumber)} />

							{
								(allPosts.length > config.numberOfPostsPerPage) ?
								<div className={styles.paginationWrapper}>
								
								{ (currentPageNumber == 2 && numberOfPages !== 2) ? 
									<div className={styles.pagination}><span><Link href={`/blog`}><a>← Previous Page</a></Link></span> <span><Link href={`/blog/page/${currentPageNumber + 1}`}><a>Next Page →</a></Link></span></div> 
									: (currentPageNumber == 2 && numberOfPages === 2) ? 

									<div className={styles.pagination}><span><Link href={`/blog`}><a>← Previous Page</a></Link></span></div>

									: (currentPageNumber == 1) ? <div className={`${styles.pagination} ${styles.pgnFlexEnd}`}><span><Link href={`/blog/page/${currentPageNumber + 1}`}><a>Next Page →</a></Link></span></div>

									: (currentPageNumber == numberOfPages) ? 
									<div className={styles.pagination}><span><Link href={`/blog/page/${currentPageNumber - 1}`}><a>← Previous Page</a></Link> </span></div>

									: <div className={styles.pagination}><span><Link href={`/blog/page/${currentPageNumber - 1}`}><a>← Previous Page</a></Link></span> <span><Link href={`/blog/page/${currentPageNumber + 1}`}><a>Next Page →</a></Link></span></div>
								}
								</div> : null
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

export default connect(mapStateToProps, null)(Page);
