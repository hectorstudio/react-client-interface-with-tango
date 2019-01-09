import { createSelector } from "reselect";
import { IRootState } from "../reducers/rootReducer";
import { objectValues } from "../utils";
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

// export const getCurrentDeviceAttributes = createSelector(
//   getAttributesState,
//   getCurrentDeviceName,
//   (attributes, current) => objectValues(attributes[current])
// );

// export const getCurrentDeviceCommands = createSelector(
//   getCommandsState,
//   getCurrentDeviceName,
//   (commands, current) => objectValues(commands[current])
// );

// export const getCurrentDeviceProperties = createSelector(
//   getPropertiesState,
//   getCurrentDeviceName,
//   (properties, current) => objectValues(properties[current])
// );

// export const getCurrentDevice = createSelector(
//   getDevices,
//   getCurrentDeviceName,
//   getCurrentDeviceProperties,
//   getCurrentDeviceAttributes,
//   getCurrentDeviceCommands,
//   (devices, name, properties, attributes, commands) => {
//     const device = devices[name];
//     return device == null ? null : { ...device, properties, attributes, commands };
//   }
// );

export const getDevice = (name: string) => createSelector(
  getDevices,
  getPropertiesState,
  getAttributesState,
  getCommandsState,
  (devices, propertiesState, attributesState, commandsState) => {
    const device = devices[name];
    const properties = objectValues(propertiesState[name]);
    const attributes = objectValues(attributesState[name]);
    const commands = objectValues(commandsState[name]);
    return { ...device, properties, attributes, commands };
  }
);

export const getAvailableDispLevels = createSelector(
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
