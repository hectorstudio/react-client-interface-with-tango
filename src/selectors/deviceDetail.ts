import { createSelector } from 'reselect';
import { getCurrentDeviceAttributes } from './currentDevice';
import { IRootState } from '../reducers/rootReducer';

function getDeviceViewState(state: IRootState) {
    return state.deviceDetail;
}

export const getActiveDataFormat = createSelector(
    getDeviceViewState,
    state => state.activeDataFormat
);

export const getFilteredCurrentDeviceAttributes = createSelector(
    getCurrentDeviceAttributes,
    getActiveDataFormat,
    (attrs, format) => attrs.filter(attr => attr.dataformat === format)
);

export const getDisabledDisplevels = createSelector(
    getDeviceViewState,
    state => state.disabledDisplevels
);
