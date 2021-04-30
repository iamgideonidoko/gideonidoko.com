import axios from 'axios';
import * as types from './types';
import { config } from '../../config/keys';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getContacts = () => dispatch => {
	dispatch(setContactsLoading());
	axios.get(`${config.BEHOST}/api/contacts`)
		.then(res => dispatch({
			type: types.GET_CONTACTS,
			payload: res.data
		}))
		.catch(err => console.log(err));
}

export const addContact = (newContact) => (dispatch, getState) => {

	//Request body
	const body = JSON.stringify(newContact);

	axios.post(`${config.BEHOST}/api/contacts`, body, tokenConfig(getState))
		.then(res => dispatch({
			type: types.ADD_CONTACT,
			payload: res.data
		}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));

}

export const deleteContact = (id) => (dispatch, getState) => {
	axios.delete(`${config.BEHOST}/api/contacts/${id}`, tokenConfig(getState))
		.then(res => dispatch({
			type: types.DELETE_CONTACT,
			payload: id
		}))
		.catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const startSending = () => {
	return {
		type: types.START_SENDING
	}
}

export const stopSending = () => {
	return {
		type: types.STOP_SENDING
	}
}

export const setContactsLoading = () => {
	return {
		type: types.CONTACTS_LOADING
	}
}