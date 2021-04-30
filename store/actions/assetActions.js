import axios from 'axios';
import * as types from './types';
import { config } from '../../config/keys';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getAssets = () => dispatch => {
	dispatch(setAssetsLoading());
	axios.get(`${config.BEHOST}/api/assets`)
		.then(res => dispatch({
			type: types.GET_ASSETS,
			payload: res.data
		}))
		.catch(err => console.log(err));
}

export const addAsset = (newAsset) => (dispatch, getState) => {

	//Request body
	const body = JSON.stringify(newAsset);

	axios.post(`${config.BEHOST}/api/assets`, body, tokenConfig(getState))
		.then(res => dispatch({
			type: types.ADD_ASSET,
			payload: res.data
		}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

}

export const deleteAsset = (id) => (dispatch, getState) => {
	axios.delete(`${config.BEHOST}/api/assets/${id}`, tokenConfig(getState))
		.then(res => dispatch({
			type: types.DELETE_ASSET,
			payload: id
		}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}


export const setAssetsLoading = () => {
	return {
		type: types.ASSETS_LOADING
	}
}