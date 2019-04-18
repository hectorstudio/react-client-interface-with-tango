import { request as graphqlRequest } from "graphql-request";

const FETCH_ATTRIBUTES = `
query FetchAttributeNames($device: String!) {
  device(name: $device) {
    attributes {
      name
      dataformat
      datatype
    }
  }
}
`;

const FETCH_COMMANDS = `
query FetchCommandNames($device: String!) {
  device(name: $device) {
    commands {
      name
      intype
    }
  }
}
`;

const FETCH_DEVICE_NAMES = `
query {
  devices {
    name
  }
}
`;

const EXECUTE_COMMAND = `
mutation ExecuteCommand($device: String!, $command: String!) {
  executeCommand(device: $device, command: $command) {
    ok
    output
  }
}`;

const WRITE_ATTRIBUTE = `
mutation WriteAttribute($device: String!, $attribute: String!, $value: ScalarTypes!) {
  setAttributeValue(device: $device, name: $attribute, value: $value) {
    ok
    attribute {
      value
      writevalue
      timestamp
    }
  }
}`;

const FETCH_ATTRIBUTE_METADATA = `
query FetchAttributeMetadata($deviceName: String!) {
  device(name: $deviceName) {
    attributes {
        name
        dataformat
        datatype
      }
    }
  }
  `;

function request<T = any>(tangoDB: string, query: string, args?: object): Promise<T> {
  const url = `/${tangoDB}/db`;
  return graphqlRequest(url, query, args || {});
}

export async function fetchDeviceAttributes(tangoDB, device) {
  try {
    const data = await request(tangoDB, FETCH_ATTRIBUTES, { device });
    const { attributes } = data.device;
    if (attributes != null) {
      return attributes;
    } else {
      // Some kind of error reporting could go here. This should only happen when the attributes resolver in the backend fails for some unexpected reason. For now, just return an empty list.
      return [];
    }
  } catch (err) {
    return [];
  }
}

export async function fetchCommands(tangoDB, device) {
  try {
    const data = await request(tangoDB, FETCH_COMMANDS, { device });
    return data.device.commands;
  } catch (err) {
    return [];
  }
}

export async function fetchDeviceNames(tangoDB) {
  try {
    const data = await request(tangoDB, FETCH_DEVICE_NAMES);
    return data.devices.map(({ name }) => name);
  } catch (err) {
    return [];
  }
}

export async function executeCommand(tangoDB, device, command) {
  try {
    const args = { device, command };
    const data = await request(tangoDB, EXECUTE_COMMAND, args);
    return data.executeCommand.output;
  } catch (err) {
    return null;
  }
}

export async function writeAttribute(tangoDB, device, attribute, value) {
  try {
    const args = { device, attribute, value };
    const data = await request(tangoDB, WRITE_ATTRIBUTE, args);
    return data.setAttributeValue;
  } catch (err) {
    return { ok: false, attribute: null };
  }
}

function deviceNameFromFull(fullName) {
  const parts = fullName.split("/");
  return parts.slice(0, 3).join("/");
}

// This is a cumbersome and potentially slow way of retrieving all attribute metadata.
// Simplify it when there exists a `query { attributes(fullNames: [String]) }' resolver available in the backend

export async function fetchAttributeMetadata(tangoDB, fullNames) {
  try {
    const deviceNames = fullNames
      .map(deviceNameFromFull)
      .filter((name, i, names) => names.indexOf(name) === i);

    const result = {};

    for (const deviceName of deviceNames) {
      const data = await request(tangoDB, FETCH_ATTRIBUTE_METADATA, {
        deviceName
      });

      for (const attribute of data.device.attributes) {
        const { name, dataformat, datatype } = attribute;

        const dataFormat = dataformat.toLowerCase();
        const dataType = datatype;

        const fullName = `${deviceName}/${name}`;
        result[fullName] = { dataFormat, dataType };
      }
    }

    return result;
  } catch (err) {
    alert(err);
    return null;
  }
}
