import { combineReducers } from 'redux';
import postReducer from './postReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer';
import firebaseReducer from './firebaseReducer';
import assetReducer from './assetReducer';
import contactReducer from './contactReducer';

export default combineReducers({
    post: postReducer,
    auth: authReducer,
    error: errorReducer,
    user: userReducer,
    fire: firebaseReducer,
    asset: assetReducer,
    contact: contactReducer,
});
