import { createSelector } from 'reselect';
import { getFilter } from './filtering';

const getDevicesState = state => state.devices;

export const getDeviceNames = createSelector(
    getDevicesState,
    state => state.nameList
);

export const getCurrentDevice = createSelector(
    getDevicesState,
    state => state.current
);

export const getCurrentDeviceName = createSelector(
    getCurrentDevice,
    device => device ? device.name : null
);

export const getCurrentDeviceAttributes = createSelector(
    getCurrentDevice,
    device => device ? device.attributes || [] : []
);

export const getCurrentDeviceProperties = createSelector(
    getCurrentDevice,
    device => device ? device.properties || [] : []
);

export const getHasDevices = createSelector(
    getDeviceNames,
    names => names.length > 0
);

function matchesFilter(name, filter) {
    const words = filter.split(/\s+/);
    const matched = words.filter(word => name.toUpperCase().indexOf(word.toUpperCase()) !== -1);
    return matched.length === words.length;
}

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter(name => matchesFilter(name, filter))
);

export const getDeviceIsLoading = createSelector(
    getDevicesState,
    state => state.loadingDevice
);

export const getDeviceNamesAreLoading = createSelector(
    getDevicesState,
    state => state.loadingNames
);

export const getAvailableDataFormats = createSelector(
    getCurrentDeviceAttributes,
    attrs => Object.keys(attrs.reduce((accum, attr) => ({
        ...accum, [attr.dataformat]: true
    }), {}))
);

export const getActiveDataFormat = createSelector(
    getDevicesState,
    state => state.activeDataFormat
);

export const getActiveTab = createSelector(
    getDevicesState,
    state => state.activeTab
);

export const getFilteredCurrentDeviceAttributes = createSelector(
    getCurrentDeviceAttributes,
    getActiveDataFormat,
    (attrs, format) => attrs.filter(attr => attr.dataformat === format)
);

export const getCurrentDeviceState = createSelector(
    getCurrentDeviceAttributes,
    (attrs) => {
        const attr = attrs.find(attr => attr.name === 'State');
        return attr ? attr.value : null;
    }
);
