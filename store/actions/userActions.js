import axios from 'axios';
import * as types from './types';

export const getGithubUser = (username) => dispatch => {
	axios.get(`https://api.github.com/users/${username}`)
		.then(res => dispatch({
			type: types.GET_GITHUB_USER,
			payload: res.data
		}))
		.catch(err => console.log(err));
}