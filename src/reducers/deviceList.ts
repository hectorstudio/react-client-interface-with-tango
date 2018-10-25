import {
    FETCH_DEVICE_NAMES_SUCCESS,
    SET_SEARCH_FILTER,
    TOGGLE_EXPAND_DOMAIN,
    TOGGLE_EXPAND_FAMILY,
    SELECT_DEVICE,
} from '../actions/actionTypes';

export interface IDeviceListState {
    filter: string;
    nameList: string[];

    expandedDomains: string[];
    expandedFamilies: string[];
}

function toggleElement(array, element) {
    if (array.indexOf(element) === -1) {
        return array.concat(element);
    } else {
        return array.filter(element2 => element2 !== element);
    }
}

function enableElement(array, element) {
    return array.indexOf(element) === -1 ? array.concat(element) : array;
}

export default function deviceList(state: IDeviceListState = {
    filter: '',
    nameList: [],

    expandedDomains: [],
    expandedFamilies: [],
}, action) {
    switch (action.type) {
    case FETCH_DEVICE_NAMES_SUCCESS:
        const sortedDeviceNames = action.names.sort((a, b) => {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        return {...state, nameList: sortedDeviceNames};
    
    case SET_SEARCH_FILTER:
        return {...state, filter: action.filter};  

    case TOGGLE_EXPAND_DOMAIN: {
        return {...state, expandedDomains: toggleElement(state.expandedDomains, action.domain)};
    }

    case TOGGLE_EXPAND_FAMILY: {
        const {domain, family} = action;
        const domainFamily = `${domain}/${family}`;
        return {...state, expandedFamilies: toggleElement(state.expandedFamilies, domainFamily)};
    }

    case SELECT_DEVICE: {
        const [domain, family,] = action.name.split('/');
        const domainFamily = `${domain}/${family}`;
        return {
            ...state, 
            expandedDomains: enableElement(state.expandedDomains, domain),
            expandedFamilies: enableElement(state.expandedFamilies, domainFamily),
        };
    }

    default:
        return state;
    }
}
