import * as types from '../actions/types';
// import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
	githubUser: {},
	isGithubUserLoading: true, //will be false when the github user has loaded
}

//export the post reducer
const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.GET_GITHUB_USER:
			return {
				...state,
				githubUser: action.payload,
				isGithubUserLoading: false
				}
		default:
			return state;
	}
}


export default userReducer;