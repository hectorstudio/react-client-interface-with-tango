import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

function getDevicesState(state: IRootState) {
    return state.devices;
}

export const getCurrentDevice = createSelector(
    getDevicesState,
    state => state.current
);

export const getCurrentDeviceName = createSelector(
    getCurrentDevice,
    device => device ? device.name : undefined
);

export const getCurrentDeviceState = createSelector(
    getCurrentDevice,
    device => device ? device.state : undefined
);

export const getCurrentDeviceAttributes = createSelector(
    getCurrentDevice,
    device => device ? device.attributes || [] : []
);

export const getCurrentDeviceProperties = createSelector(
    getCurrentDevice,
    device => device ? device.properties || [] : []
);

export const getCurrentDeviceCommands = createSelector(
    getCurrentDevice,
    device => device ? device.commands || [] : []
);

export const getDeviceIsLoading = createSelector(
    getDevicesState,
    state => state.loadingDevice
);

export const getDeviceNamesAreLoading = createSelector(
    getDevicesState,
    state => state.loadingNames
);

export const getCommandsOutputLoading = createSelector(
    getDevicesState,
    state => state.loadingOutput
);

export const getAvailableDataFormats = createSelector(
    getCurrentDeviceAttributes,
    attrs => Object.keys(attrs.reduce((accum, attr) => ({
        ...accum, [attr.dataformat]: true
    }), {}))
);

export const getCommandValue = createSelector(
    getDevicesState,
    state => state.commandResults
);

export const getCommandDisplevels = createSelector(
    getCurrentDeviceCommands,
    commands => Object.keys(commands
        .map(command => command.displevel)
        .reduce((accum, displevel) => ({...accum, [displevel]: true}), {}))

    /*commands => Object.keys(
        commands
            .map(command => command.displevel)
            .reduce((accum, curr) => (
                {...accum, [curr]: true}
            , {})
    ))*/
);
