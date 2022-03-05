import * as types from '../actions/types';

const initialState = {
    message: {},
    status: null,
    id: null,
};

const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ERRORS:
            return {
                message: action.payload.message,
                status: action.payload.status,
                id: action.payload.id,
            };

        case types.CLEAR_ERRORS:
            return {
                message: {},
                status: null,
                id: null,
            };

        default:
            return state;
    }
};

export default errorReducer;
