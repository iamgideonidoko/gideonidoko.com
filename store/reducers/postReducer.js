import * as types from '../actions/types';
// import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
	posts: [],
	loading: false, //will be true when fetching data and back to false when the fetch is done
	isLoaded: false,
	isPostCreated: false,
	isPostUpdated: false,
	isPostDeleted: false
}

//export the post reducer
const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false,
				isLoaded: true
				}
		case types.POSTS_LOADING: 
			return {
				...state,
				loading: true
			}
		case types.ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
				isPostCreated: true
			}
		case types.RESET_POST_CREATED:
			return {
				...state,
				isPostCreated: false
			}
		case types.UPDATE_POST:
			return {
				...state,
				posts: state.posts.map(post => {
					if (post._id === action.payload._id) {
						return action.payload;
					} else {
						return post;
					}
				}),
				isPostUpdated: true
			}
		case types.RESET_POST_UPDATED:
			return {
				...state,
				isPostUpdated: false
			}
		case types.DELETE_POST:
			return {
				...state,
				posts: state.posts.filter(post => post._id !== action.payload),
				isPostDeleted: true
			}
		case types.RESET_POST_DELETED:
			return {
				...state,
				isPostDeleted: false
			}
		default:
			return state;
	}
}


export default postReducer;