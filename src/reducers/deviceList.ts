import {
    FETCH_DEVICE_NAMES_SUCCESS,
    SET_SEARCH_FILTER,
    TOGGLE_EXPAND_DOMAIN,
    TOGGLE_EXPAND_FAMILY,
} from '../actions/actionTypes';

export interface IDeviceListState {
    filter: string;
    nameList: string[];

    expandedDomains: string[];
    expandedFamilies: string[];
}

export default function deviceList(state: IDeviceListState = {
    filter: '',
    nameList: [],

    expandedDomains: [],
    expandedFamilies: [],
}, action) {
    switch (action.type) {
    case FETCH_DEVICE_NAMES_SUCCESS:
        return {...state, nameList: action.names};
    
    case SET_SEARCH_FILTER:
        return {...state, filter: action.filter};  

    case TOGGLE_EXPAND_DOMAIN: {
        const domain = action.domain;
        const isExpanded = state.expandedDomains.indexOf(domain) !== -1;
        return isExpanded
            ? {...state, expandedDomains: state.expandedDomains.filter(domain2 => domain !== domain2)}
            : {...state, expandedDomains: state.expandedDomains.concat(domain)};
    }

    case TOGGLE_EXPAND_FAMILY: {
        const {domain, family} = action;
        const key = [domain, family].join('/');
        const isExpanded = state.expandedFamilies.indexOf(key) !== -1;
        return isExpanded
            ? {...state, expandedFamilies: state.expandedFamilies.filter(key2 => key !== key2)}
            : {...state, expandedFamilies: state.expandedFamilies.concat(key)};
    }

    default:
        return state;
    }
}
