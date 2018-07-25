import {
    FETCH_DEVICE_NAMES,
    FETCH_DEVICE_NAMES_SUCCESS,
    SET_SEARCH_FILTER,
} from '../actions/actionTypes';

export interface IDeviceListState {
    filter: string;
    nameList: string[];
    loadingNames: boolean;
}

export default function deviceList(state: IDeviceListState = {
    filter: '',
    nameList: [],
    loadingNames: false,
}, action) {
    switch (action.type) {
    case FETCH_DEVICE_NAMES:
        return {...state, loadingNames: true};

    case FETCH_DEVICE_NAMES_SUCCESS:
        return {...state, loadingNames: false, nameList: action.names};
    
    case SET_SEARCH_FILTER:
        return {...state, filter: action.filter};  

    default:
        return state;
    }
}
