import { connect } from 'react-redux';
import moment from 'moment';
import Link from 'next/link';
import { getReadTime } from '../../helper';
import styles from '../../styles/Home.module.css';

const SectionFive = (props) => {

	const firstTwoPosts = props.post.posts ? props.post.posts.filter(post => post.is_published === true).slice(0, 2) : [];

	return (
		<div className={styles.sectionFive}>
			<div className="container-max-1248px">
				<div className={styles.sectionFiveWrapper}>
					<h3 className={styles.servicesHead}>Articles -</h3>
					<p>I also write <b>blog articles</b>. Here are the most recent ones:</p>

					<div className={styles.s5PostWrapper}>
					{
					firstTwoPosts.map(post => <article key={post._id}>
						<div>
							<Link href={`/blog/${post.slug}`} >
								<a className={styles.s5PostHref}>
									<div className={styles.s5PostFlex}>
										<div className={styles.s5PostImg}>
											<img src={post.cover_img} alt={`${post.title} cover image`} />
										</div>
										<div className={styles.s5PostInfo}>
											<h3>{post.title}</h3>
											<div><span><small>{moment(post.created_at).format('MMM DD, YYYY')}</small></span>&nbsp;&nbsp;|&nbsp;&nbsp;<span><small>{getReadTime(post.body)}</small></span>&nbsp;&nbsp;|&nbsp;&nbsp; <span><small>{post.author_name}</small></span></div>
											<p>{post.body.replace(/[*#`]/g, "").substr(0, 196)}...</p>
										</div>
									</div>
								</a>
							</Link>
						</div>
					</article>)
					}
					</div>
					
					<div>
						<p className={styles.aboutSeeMore}><span><Link href="/blog"><a>Check out more on my blog.</a></Link></span> <span></span></p>
					</div>
						
				</div>
			</div>
						
		</div>
	);

}

const mapStateToProps = (state) => ({
	post: state.post
})


export default connect(mapStateToProps, null)(SectionFive);