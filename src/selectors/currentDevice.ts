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

export const getCurrentDeviceCommandOutputs = createSelector(
  getCurrentDeviceName,
  getCommandOutputState,
  (name, output) => output[name!] || {}
);
