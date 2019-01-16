import { createSelector } from "reselect";

import { IRootState } from "../../state/reducers/rootReducer";
import { objectValues } from "../../utils";

const getAttributesState = (state: IRootState) => state.attributes;
const getCommandsState = (state: IRootState) => state.commands;
const getPropertiesState = (state: IRootState) => state.properties;

function getDevices(state: IRootState) {
  return state.devices;
}

interface IHasName {
  name: string;
}

function compareByName(property1: IHasName, property2: IHasName) {
  const name1 = property1.name.toUpperCase();
  const name2 = property2.name.toUpperCase();
  if (name1 < name2) {
    return -1;
  } else if (name1 > name2) {
    return 1;
  } else {
    return 0;
  }
}

function sortedByName(entries: IHasName[]) {
  return entries.concat().sort(compareByName);
}

export const getDevice = (name: string) =>
  createSelector(
    getDevices,
    getPropertiesState,
    getAttributesState,
    getCommandsState,
    (devices, propertiesState, attributesState, commandsState) => {
      const device = devices[name];
      if (device == null) {
        return null;
      }

      const properties = sortedByName(objectValues(propertiesState[name]));
      const attributes = objectValues(attributesState[name]);
      const commands = objectValues(commandsState[name]);
      return { ...device, properties, attributes, commands };
    }
  );
