import createGQLClient from "graphql-client";

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

function createClient(tangoDB) {
  return createGQLClient({ url: "/" + tangoDB + "/db" });
}

export async function fetchDeviceAttributes(tangoDB, device) {
  try {
    const res = await createClient(tangoDB).query(FETCH_ATTRIBUTES, { device });
    return res.data.device.attributes;
  } catch (err) {
    return [];
  }
}

export async function fetchCommands(tangoDB, device) {
  try {
    const res = await createClient(tangoDB).query(FETCH_COMMANDS, { device });
    return res.data.device.commands;
  } catch (err) {
    return [];
  }
}

export async function fetchDeviceNames(tangoDB) {
  try {
    const res = await createClient(tangoDB).query(FETCH_DEVICE_NAMES);
    return res.data.devices.map(({ name }) => name);
  } catch (err) {
    return [];
  }
}

export async function executeCommand(tangoDB, device, command) {
  try {
    const args = { device, command };
    const res = await createClient(tangoDB).query(EXECUTE_COMMAND, args);
    return res.data.executeCommand.output;
  } catch (err) {
    return null;
  }
}

export async function writeAttribute(tangoDB, device, attribute, value) {
  try {
    const args = { device, attribute, value };
    const res = await createClient(tangoDB).query(WRITE_ATTRIBUTE, args);
    return res.data.setAttributeValue.ok === true;
  } catch (err) {
    return false;
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
      const res = await createClient(tangoDB).query(FETCH_ATTRIBUTE_METADATA, {
        deviceName
      });

      for (const attribute of res.data.device.attributes) {
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
