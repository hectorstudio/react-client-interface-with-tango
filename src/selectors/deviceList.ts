import { createSelector } from 'reselect';
import { getDeviceNames } from './devices';

function matchesFilter(name, filter) {
    const words = filter.split(/\s+/);
    const matched = words.filter(word => name.toUpperCase().indexOf(word.toUpperCase()) !== -1);
    return matched.length === words.length;
}

const getFilteringState = state => state.deviceList;

export const getFilter = createSelector(
    getFilteringState,
    state => state.filter
);

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter(name => matchesFilter(name, filter))
);
