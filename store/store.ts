import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

//get root reducer
import rootReducer from './reducers';

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

const makeStore = () => store;

export default makeStore;
