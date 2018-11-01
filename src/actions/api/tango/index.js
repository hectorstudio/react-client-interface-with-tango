import {
  FETCH_DEVICE_NAMES,
  EXECUTE_COMMAND,
  SET_DEVICE_ATTRIBUTE,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  FETCH_DEVICE
} from "./operations";

const client = require("graphql-client")({
  url: `/db`
});

function graphQL(query, variables) {
  return client.query(query, variables || {}, function(req, res) {
    if (res.status === 401) {
      throw new Error("Not authorized");
    }
  });
}

export default {
  async fetchDeviceNames() {
    const { data } = await graphQL(FETCH_DEVICE_NAMES);
    return data.devices.map(device => device.name);
  },

  async executeCommand(command, argin, device) {
    const params = argin ? { command, argin, device } : { command, device };
    const { data } = await graphQL(EXECUTE_COMMAND, params);
    return data.executeCommand.output;
  },

  async setDeviceAttribute(device, name, value) {
    const params = { device, name, value };
    const { data } = await graphQL(SET_DEVICE_ATTRIBUTE, params);
    return data.setAttributeValue.ok;
  },

  async setDeviceProperty(device, name, value) {
    const params = { device, name, value };
    const { data } = await graphQL(SET_DEVICE_PROPERTY, params);
    return data.putDeviceProperty.ok;
  },

  async deleteDeviceProperty(device, name) {
    const params = { device, name };
    const { data } = await graphQL(DELETE_DEVICE_PROPERTY, params);
    return data.deleteDeviceProperty.ok;
  },

  async fetchDevice(name) {
    const params = { name };
    const { data } = await graphQL(FETCH_DEVICE, params);
    return data.device;
  }
};
