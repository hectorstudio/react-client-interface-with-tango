import { GraphQLClient } from "graphql-request";

import {
  FETCH_DEVICE_NAMES,
  EXECUTE_COMMAND,
  SET_DEVICE_ATTRIBUTE,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  FETCH_DEVICE
} from "./operations";

export default {
  async fetchDeviceNames(tangoDB) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const data = await client.request(FETCH_DEVICE_NAMES);
    return data.devices.map(device => device.name);
  },

  async executeCommand(tangoDB, command, argin, device) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const params = argin ? { command, argin, device } : { command, device };
    const data = await client.request(EXECUTE_COMMAND, params);
    return data.executeCommand.output;
  },

  async setDeviceAttribute(tangoDB, device, name, value) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const params = { device, name, value };
    const data = await client.request(SET_DEVICE_ATTRIBUTE, params);
    return data.setAttributeValue.ok;
  },

  async setDeviceProperty(tangoDB, device, name, value) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const params = { device, name, value };
    const data = await client.request(SET_DEVICE_PROPERTY, params);
    return data.putDeviceProperty.ok;
  },

  async deleteDeviceProperty(tangoDB, device, name) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const params = { device, name };
    const data = await client.request(DELETE_DEVICE_PROPERTY, params);
    return data.deleteDeviceProperty.ok;
  },

  async fetchDevice(tangoDB, name) {
    const client = new GraphQLClient(process.env.REACT_APP_BASE_URL + tangoDB + "/db");
    const params = { name };
    const data = await client.request(FETCH_DEVICE, params);
    return data.device;
  }
};
