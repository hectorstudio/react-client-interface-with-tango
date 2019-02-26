import { GraphQLClient } from "graphql-request";

import {
  FETCH_DEVICE_NAMES,
  EXECUTE_COMMAND,
  SET_DEVICE_ATTRIBUTE,
  SET_DEVICE_PROPERTY,
  DELETE_DEVICE_PROPERTY,
  FETCH_DEVICE,
  ATTRIBUTES_SUB,
  FETCH_DATABASE_INFO,
  FETCH_LOGGED_ACTIONS,
  FETCH_ALL_LOGGED_ACTIONS
} from "./operations";

function client(tangoDB) {
  return new GraphQLClient(`/${tangoDB}/db`);
}

function socketUrl(tangoDB) {
  const loc = window.location;
  const protocol = loc.protocol.replace('http', 'ws');
  return protocol + '//' + loc.host + '/' + tangoDB + '/socket';
}

function createSocket(tangoDB) {
  return new WebSocket(socketUrl(tangoDB), "graphql-ws");
}

export default {
  async fetchDatabaseInfo(tangoDB) {
    const data = await client(tangoDB).request(FETCH_DATABASE_INFO);
    return data.info;
  },

  async fetchDeviceNames(tangoDB) {
    const data = await client(tangoDB).request(FETCH_DEVICE_NAMES);
    return data.devices.map(device => device.name);
  },

  async fetchLoggedActions(tangoDB, deviceName, limit){
    const params = {deviceName, limit}
    const isGlobal = deviceName === "";
    const query = isGlobal ? FETCH_ALL_LOGGED_ACTIONS : FETCH_LOGGED_ACTIONS
    const data = await client(tangoDB).request(query, params);
    if (isGlobal){
      return {name: "", userActions: data.userActions};
    }else{

      return {name: data.device.name, userActions: data.device.userActions};
    }
   
  },

  async executeCommand(tangoDB, command, argin, device) {
    const params = argin ? { command, argin, device } : { command, device };
    const data = await client(tangoDB).request(EXECUTE_COMMAND, params);
    return data.executeCommand;
  },

  async setDeviceAttribute(tangoDB, device, name, value) {
    const params = { device, name, value };
    const data = await client(tangoDB).request(SET_DEVICE_ATTRIBUTE, params);
    return data.setAttributeValue.ok;
  },

  async setDeviceProperty(tangoDB, device, name, value) {
    const params = { device, name, value };
    const data = await client(tangoDB).request(SET_DEVICE_PROPERTY, params);
    return data.putDeviceProperty.ok;
  },

  async deleteDeviceProperty(tangoDB, device, name) {
    const params = { device, name };
    const data = await client(tangoDB).request(DELETE_DEVICE_PROPERTY, params);
    return data.deleteDeviceProperty.ok;
  },

  async fetchDevice(tangoDB, name) {
    const params = { name };
    
    let device = null;
    let errors = [];

    try {
      const data = await client(tangoDB).request(FETCH_DEVICE, params);
      device = data.device;
    } catch (err) {
      // The structure of errors is currently not ideal and will probably undergo change. Update this logic accordingly.
      errors = err.response.errors[0];
      device = err.response.data.device;
      if (device == null) {
        return null;
      }
    }

    return { ...device, errors };
  },

  changeEventEmitter(tangoDB, fullNames) {
    const socket = createSocket(tangoDB);
    return emit => {
      socket.addEventListener("open", () => {
        const variables = { fullNames };
        const startMessage = JSON.stringify({
          type: "start",
          payload: {
            query: ATTRIBUTES_SUB,
            variables
          }
        });
        socket.send(startMessage);
      });
  
      socket.addEventListener("error", err => {
        emit(new Error(err.reason));
      });
  
      socket.addEventListener("message", msg => {
        const frame = JSON.parse(msg.data);
        if (frame.type === "data" && frame.payload.errors == null) {
          emit(frame.payload.data.attributes);
        }
      });
  
      return () => {
        socket.close();
      };
    };
  }
};
