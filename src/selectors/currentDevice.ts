import { createSelector } from "reselect";
import { IRootState } from "../reducers/rootReducer";
import { objectValues, unique } from "../utils";
import { getCommandOutputState } from "./commandOutput";

const getAttributesState = (state: IRootState) => state.attributes;
const getCommandsState = (state: IRootState) => state.commands;
const getPropertiesState = (state: IRootState) => state.properties;

export function getCurrentDeviceName(state: IRootState) {
  return state.currentDevice;
}

function getDevices(state: IRootState) {
  return state.devices;
}

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

export const getCurrentDevice = createSelector(
  getDevices,
  getCurrentDeviceName,
  getCurrentDeviceProperties,
  getCurrentDeviceAttributes,
  getCurrentDeviceCommands,
  (devices, name, properties, attributes, commands) => {
    const device = devices[name];
    return device == null ? null : { ...device, properties, attributes, commands };
  }
);

export const getDevice = (name: string) => createSelector(
  getDevices,
  devices => devices[name]
);

export const getHasCurrentDevice = createSelector(
  getCurrentDevice,
  device => device != null
);

export const getCurrentDeviceServer = createSelector(
  getCurrentDevice,
  device => device ? device.server : null
);

export const getCurrentDeviceErrors = createSelector(
  getCurrentDevice,
  device => (device ? device.errors : [])
);

export const getCurrentDeviceStateValue = createSelector(
  getCurrentDevice,
  device => device ? device.state : null
);

export const getAvailableDataFormats = createSelector(
  getCurrentDeviceAttributes,
  attrs => unique(attrs.map(attr => attr.dataformat))
);

export const getDispLevels = createSelector(
  getCurrentDeviceCommands,
  getCurrentDeviceAttributes,
  (commands, attributes) =>
    Object.keys(
      commands
        .map(command => command.displevel)
        .concat(attributes.map(attribute => attribute.displevel))
        .reduce((accum, displevel) => ({ ...accum, [displevel]: true }), {})
    )
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
