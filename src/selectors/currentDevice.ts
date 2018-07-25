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

const getCurrentDeviceState = (state: IRootState) => state.currentDevice;
const getAttributesState = (state: IRootState) => state.attributes;
const getCommandsState = (state: IRootState) => state.commands;
const getPropertiesState = (state: IRootState) => state.properties;

function objectValues(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

export const getCurrentDeviceAttributes2 = createSelector(
    getAttributesState,
    getCurrentDeviceState,
    (attributes, current) => objectValues(attributes[current])
);

export const getCurrentDeviceCommands2 = createSelector(
    getCommandsState,
    getCurrentDeviceState,
    (commands, current) => objectValues(commands[current])
);

export const getCurrentDeviceProperties2 = createSelector(
    getPropertiesState,
    getCurrentDeviceState,
    (properties, current) => objectValues(properties[current])
);
