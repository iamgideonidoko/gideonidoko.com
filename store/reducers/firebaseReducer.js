import * as types from '../actions/types';
import { config } from '../../config/keys';

const initialState = {
	firebaseApp: null,
	firebaseStorage: null
}


const firebaseReducer = (state = initialState, action) => {
	switch(action.type) {

		case types.LOAD_FIREBASE:
			if (typeof window !== "undefined") {
				const firebase = window.firebase;

				// Firebase configuration
			    const firebaseConfig = {
			      apiKey: config.firebaseApiKey,
			      authDomain: config.firebaseAuthDomain,
			      projectId: config.firebaseProjectId,
			      storageBucket: config.firebaseStorageBucket,
			      messagingSenderId: config.firebaseMessagingSenderId,
			      appId: config.firebaseAppId
			    };

			      // Initialize Firebase
			    window.firebase.initializeApp(firebaseConfig);

			}

			return {
				...state,
				firebaseApp: firebase ? firebase : null,
				firebaseStorage: firebase ? firebase.storage() : null
			}
		default:
			return state;

	}

}


export default firebaseReducer;