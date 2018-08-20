import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';
import { objectValues, unique } from '../utils';
import { getCommandOutputState } from './commandOutput';

const getAttributesState = (state: IRootState) => state.attributes;
const getCommandsState = (state: IRootState) => state.commands;
const getPropertiesState = (state: IRootState) => state.properties;

export function getCurrentDeviceName(state: IRootState) {
    return state.currentDevice;
}

function getDevices(state: IRootState) {
    return state.devices;
}

const getCurrentDevice = createSelector(
    getDevices,
    getCurrentDeviceName,
    (devices, name) => devices[name]
);

export const getCurrentDeviceServer = createSelector(
    getCurrentDevice,
    device => device.server ? device.server[0] : null // [0] due to error (?) in API
);

export const getCurrentDeviceAttributes = createSelector(
    getAttributesState,
    getCurrentDeviceName,
    (attributes, current) => objectValues(attributes[current])
);

export const getCurrentDeviceCommands = createSelector(
    getCommandsState,
    getCurrentDeviceName,
    (commands, current) => objectValues(commands[current])
);

export const getCurrentDeviceProperties = createSelector(
    getPropertiesState,
    getCurrentDeviceName,
    (properties, current) => objectValues(properties[current])
);

export const getCurrentDeviceStateValue = createSelector(
    getCurrentDevice,
    device => (device || {}).state
);

export const getAvailableDataFormats = createSelector(
    getCurrentDeviceAttributes,
    attrs => unique(attrs.map(attr => attr.dataformat))
);

export const getCommandDisplevels = createSelector(
    getCurrentDeviceCommands,
    commands => Object.keys(commands
        .map(command => command.displevel)
        .reduce((accum, displevel) => ({...accum, [displevel]: true}), {}))
);

export const getCurrentDeviceCommandOutputs = createSelector(
    getCurrentDeviceName,
    getCommandOutputState,
    (name, output) => output[name!] || {}
);

export const getCurrentDeviceHasProperties = createSelector(
    getCurrentDeviceProperties,
    props => props.length > 0
);

export const getCurrentDeviceHasAttributes = createSelector(
    getCurrentDeviceAttributes,
    attrs => attrs.length > 0
);

export const getCurrentDeviceHasCommands = createSelector(
    getCurrentDeviceCommands,
    cmds => cmds.length > 0
);
