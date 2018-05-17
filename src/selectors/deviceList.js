import { createSelector } from 'reselect';

const getDeviceListState = state => state.deviceList;

const getDevices = createSelector(
    getDeviceListState,
    state => state.devices
);

export const getSelectedDeviceName = createSelector(
    getDeviceListState,
    state => state.highlightedDevice
);

export const getFilter = createSelector(
	getDeviceListState,
	state => state.filter
);

export const getDeviceNames = createSelector(
    getDevices,
    devices => devices ? devices.map(device => device.name) : []
);

export const getHasDevices = createSelector(
    getDeviceNames,
    names => names.length > 0
);

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter(name => name.toUpperCase().indexOf(filter.toUpperCase()) !== -1)
);
