import {
    FETCH_DEVICE_NAMES,
    FETCH_DEVICE_NAMES_SUCCESS,
    FETCH_DEVICE,
    FETCH_DEVICE_SUCCESS,
} from '../actions/actionTypes';

export interface ILoadingStatusState {
    loadingNames: boolean;
    loadingDevice: boolean;
}

export default function loadingStatus(state: ILoadingStatusState = {
    loadingNames: false,
    loadingDevice: false,
}, action) {
    switch (action.type) {
        
    case FETCH_DEVICE_NAMES:
        return {...state, loadingNames: true};

    case FETCH_DEVICE_NAMES_SUCCESS:
        return {...state, loadingNames: false};

    case FETCH_DEVICE:
        return {...state, loadingDevice: true};
    
    case FETCH_DEVICE_SUCCESS:
        return {...state, loadingDevice: false};

    default:
        return state;
    }
}
