import axios from 'axios';
import * as types from './types';
import { config } from '../../config/keys';
import { returnErrors } from './errorActions';


export const loadAdminUser = () => (dispatch, getState) => { //getState fetches the current statue  in the reducer store

	dispatch({ type: types.ADMIN_USER_LOADING });

	axios.get(`${config.BEHOST}/api/auth/user`, tokenConfig(getState))
		.then(res => dispatch({
			type: types.ADMIN_USER_LOADED,
			payload: res.data
		}))
		.catch(err => {
			err.response && dispatch(returnErrors(err.response.data, err.response.status));
			dispatch({
				type: types.AUTH_ERROR
			});
		})

}


export const login = ({ username, password }) => dispatch => {
	//header (config)
	const headerConfig = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	//Request body
	const body = JSON.stringify({ username, password });

	dispatch({
		type: types.ATTEMPT_LOGIN
	})

	axios.post(`${config.BEHOST}/api/auth`, body, headerConfig)
		.then(res => dispatch({
			type: types.LOGIN_SUCCESS,
			payload: res.data
		}))
		.catch(err => {
			err.response && dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
			dispatch({
				type: types.LOGIN_FAIL
			})
			dispatch({
				type: types.ATTEMPT_LOGIN_FAILED
			})
			window.setTimeout(() => {
				dispatch({
					type: types.RESET_LOGIN_FAILED
				})
			}, 3000)
		})

}



//logout action
export const logout = () => {
	return {
		type: types.LOGOUT_SUCCESS
	}
}



//setup config/headers and token
export const tokenConfig = getState => {
	//get token from local storage
	const token = getState().auth.token;

	// Headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	// If token, add to headers
	if (token) {
		config.headers['x-auth-token'] = token;
	}

	return config;

}