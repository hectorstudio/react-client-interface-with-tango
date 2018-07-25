import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

const getCurrentDeviceInfoState = (state: IRootState) => state.currentDeviceInfo;
const getCurrentDeviceAttributesState = (state: IRootState) => state.currentDeviceAttributes;
const getCurrentDevicePropertiesState = (state: IRootState) => state.currentDeviceProperties;

export const getCurrentDeviceName = createSelector(
    getCurrentDeviceInfoState,
    info => info.name
);

export const getCurrentDeviceAttributes = createSelector(
    getCurrentDeviceAttributesState,
    state => Object.keys(state).map(name => ({...state[name], name}))
);

export const getCurrentDeviceProperties = createSelector(
    getCurrentDevicePropertiesState,
    state => state
);
