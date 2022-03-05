import * as types from '../actions/types';

const initialState = {
    contacts: [],
    contactsLoading: false, //will be true when fetching data and back to false when the fetch is done
    isContactsLoaded: false,
    isSending: false,
    isMessageSent: false,
};

//export the post reducer
const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                contactsLoading: false,
                isContactsLoaded: true,
                isSending: false,
            };
        case types.CONTACTS_LOADING:
            return {
                ...state,
                contactsLoading: true,
            };
        case types.ADD_CONTACT:
            return {
                ...state,
                contacts: [action.payload, ...state.contacts],
                isSending: false,
                isMessageSent: true,
            };
        case types.DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter((asset) => asset._id !== action.payload),
            };
        case types.START_SENDING:
            return {
                ...state,
                isSending: true,
            };
        case types.STOP_SENDING:
            return {
                ...state,
                isSending: false,
                isMessageSent: false,
            };
        default:
            return state;
    }
};

export default contactReducer;
