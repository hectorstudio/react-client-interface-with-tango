import {
    FETCH_DEVICE_NAMES_SUCCESS,
    SET_SEARCH_FILTER,
} from '../actions/actionTypes';

export interface IDeviceListState {
    filter: string;
    nameList: string[];
}

export default function deviceList(state: IDeviceListState = {
    filter: '',
    nameList: [],
}, action) {
    switch (action.type) {
    case FETCH_DEVICE_NAMES_SUCCESS:
        return {...state, nameList: action.names};
    
    case SET_SEARCH_FILTER:
        return {...state, filter: action.filter};  

    default:
        return state;
    }
}
