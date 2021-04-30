import * as types from '../actions/types';

const initialState = {
	assets: [],
	assetsLoading: false, //will be true when fetching data and back to false when the fetch is done
	isAssetsLoaded: false
}

//export the post reducer
const assetReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.GET_ASSETS:
			return {
				...state,
				assets: action.payload,
				assetsLoading: false,
				isAssetsLoaded: true
				}
		case types.ASSETS_LOADING:
			return {
				...state,
				assetsLoading: true
			}
		case types.ADD_ASSET:
			return {
				...state,
				assets: [action.payload, ...state.assets]
			}
		case types.DELETE_ASSET:
			return {
				...state,
				assets: state.assets.filter(asset => asset._id !== action.payload)
			}	
		default:
			return state;
	}
}


export default assetReducer;