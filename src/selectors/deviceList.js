import { createSelector } from 'reselect';

const getDeviceList = state => state.deviceList;

const getDevices = createSelector(
    getDeviceList,
    deviceList => deviceList.devices
);
export const getFilter = createSelector(
	getDeviceList,
	deviceList => deviceList.filter
);
export const getDeviceNames = createSelector(
    getDevices,
    devices => devices ? Object.keys(devices) : []
);

export const getHasDevices = createSelector(
    getDeviceNames,
    names => names.length > 0
);

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter((name) => name.indexOf(filter) != -1)
);