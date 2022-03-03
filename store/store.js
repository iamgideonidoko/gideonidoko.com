import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

//get root reducer
import rootReducer from './reducers';

const initialState = {};

//assemble middlewares
const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

const makeStore = () => store;

export default makeStore;