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

function createClient(tangoDB) {
  return createGQLClient({ url: "/" + tangoDB + "/db" });
}

export async function fetchAttributes(tangoDB, device) {
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
