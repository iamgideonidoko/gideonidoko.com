import axios from 'axios';
import * as types from './types';
import { config } from '../../config/keys';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getPosts = () => (dispatch) => {
    dispatch(setPostsLoading());
    axios
        .get(`${config.BEHOST}/api/blogposts`)
        .then((res) =>
            dispatch({
                type: types.GET_POSTS,
                payload: res.data,
            }),
        )
        .catch((err) => console.log(err));
};

export const addPost = (newPost) => (dispatch, getState) => {
    const requestBody = JSON.stringify(newPost);
    axios
        .post(`${config.BEHOST}/api/blogposts`, requestBody, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: types.ADD_POST,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const updatePost = (postId, updatedPost) => (dispatch, getState) => {
    const requestBody = JSON.stringify(updatedPost);
    axios
        .put(`${config.BEHOST}/api/blogposts/${postId}`, requestBody, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: types.UPDATE_POST,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const updatePostComments = (postId, updatedPost) => (dispatch, getState) => {
    const requestBody = JSON.stringify(updatedPost);
    axios
        .put(`${config.BEHOST}/api/blogposts/commentsupdate/${postId}`, requestBody, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: types.UPDATE_POST,
                payload: res.data,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const deletePost = (postId) => (dispatch, getState) => {
    axios
        .delete(`${config.BEHOST}/api/blogposts/${postId}`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: types.DELETE_POST,
                payload: postId,
            });
        })
        .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const resetPostCreated = () => {
    return {
        type: types.RESET_POST_CREATED,
    };
};

export const resetPostUpdated = () => {
    return {
        type: types.RESET_POST_UPDATED,
    };
};

export const resetPostDeleted = () => {
    return {
        type: types.RESET_POST_DELETED,
    };
};

export const setPostsLoading = () => {
    return {
        type: types.POSTS_LOADING,
    };
};
