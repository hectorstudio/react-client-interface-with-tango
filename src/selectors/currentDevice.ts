import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

const getCurrentDeviceInfo = (state: IRootState) => state.currentDeviceInfo;
export const getCurrentDeviceProperties = (state: IRootState) => state.currentDeviceProperties;

export const getCurrentDeviceName = createSelector(
    getCurrentDeviceInfo,
    info => info.name
);
