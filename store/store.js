import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

//get root reducer
import rootReducer from './reducers';

const initialState = {};

//assemble middlewares
const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

const makeStore = ({isServer}) => {
    const isClient = typeof window !== "undefined";
    if (!isClient) {
        //If on server side, create a store
        return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
    } else {
        //If on client side, create a store which will persist
        const {persistStore, persistReducer} = require("redux-persist");
        const storage = require("redux-persist/lib/storage").default;

        const persistConfig = {
            key: "gideonidokowebsite",
            whitelist: [
                'post',
                'auth',
                'error',
                'user',
                'asset',
                'contact'
            ], // these reducers will be persisted
            storage, // default storage. if needed, use a safer storage
        };

        const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer

        const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware))); // Creating the store again

        store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

        return store;
    }
}

export default makeStore;