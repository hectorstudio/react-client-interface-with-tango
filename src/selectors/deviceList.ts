import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

function matchesFilter(name, filter) {
    const words = filter.split(/\s+/);
    const matched = words.filter(word => name.toUpperCase().indexOf(word.toUpperCase()) !== -1);
    return matched.length === words.length;
}

function getDeviceListState(state: IRootState) {
    return state.deviceList;
}

export const getDeviceNames = createSelector(
    getDeviceListState,
    state => state.nameList
);

export const getFilter = createSelector(
    getDeviceListState,
    state => state.filter
);

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter(name => matchesFilter(name, filter))
);

export const getHasDevices = createSelector(
    getDeviceNames,
    names => names.length > 0
);
