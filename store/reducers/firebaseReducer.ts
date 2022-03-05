import * as types from '../actions/types';
import { config } from '../../config/keys';

const initialState = {
    firebaseApp: null,
    firebaseStorage: null,
};

const firebaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_FIREBASE:
            if (typeof window !== 'undefined') {
                const firebase = window.firebase;

                // Firebase configuration
                const firebaseConfig = {
                    apiKey: config.firebaseApiKey,
                    authDomain: config.firebaseAuthDomain,
                    projectId: config.firebaseProjectId,
                    storageBucket: config.firebaseStorageBucket,
                    messagingSenderId: config.firebaseMessagingSenderId,
                    appId: config.firebaseAppId,
                };

                // Initialize Firebase
                window.firebase && window.firebase.initializeApp(firebaseConfig);
            }

            return {
                ...state,
                firebaseApp: typeof window !== 'undefined' ? (window.firebase ? window.firebase : null) : null,
                firebaseStorage: typeof window !== 'undefined' ? (window.firebase ? firebase.storage() : null) : null,
            };
        default:
            return state;
    }
};

export default firebaseReducer;
