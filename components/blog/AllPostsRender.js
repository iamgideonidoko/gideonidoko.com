import Link from 'next/link';
import moment from 'moment';
import { getReadTime } from '../../helper';
import styles from '../../styles/Blog.module.css';



const AllPostsRender = ({ posts }) => {

	if(posts.length === 0) {
		return (<b>No Posts.</b>);
	} else {
		return (<div className={styles.blogPostsList}>{
			posts.map(post => (
				<article className={styles.blogBox} key={post._id}>
					 <div className={styles.blogBoxLeft}>
					 	<div className={styles.postCoverWrap}>
					 	<Link href={`/blog/${post.slug}`}>
					 		<a>
							 	<img src={post.cover_img} className={styles.postCover} alt={`${post.title} cover image`} />
							 	<div className={styles.hoverEffect}></div>
					 		</a>				 		
					 	</Link>
					 	</div>
					 </div>
					 <div className={styles.blogBoxRight}>
					 	<h3>
					 	<Link href={`/blog/${post.slug}`}>
						 	<a>{post.title}</a>
					 	</Link>
					 	</h3>
					 	<div className={styles.bbrSmallMetaOne}>
					 		<span><small>{moment(post.created_at).format('MMM DD, YYYY')}</small></span>&nbsp;&nbsp;|&nbsp;&nbsp;<span><small>{getReadTime(post.body)}</small></span>&nbsp;&nbsp;|&nbsp;&nbsp;<span><small>{post.author_name}</small></span>
					 	</div>
					 	<p>{post.body.replace(/[*#`]/g, "").substr(0, 196)}...</p>

					 </div>

				</article>
			))
		}</div>)		
	}
}


export default AllPostsRender;