import createGQLClient from "graphql-client";

const FETCH_ATTRIBUTES = `
query FetchNames($device: String!) {
  device(name: $device) {
    attributes {
      name
      dataformat
      datatype
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

export async function fetchDeviceNames(tangoDB) {
  try {
    const res = await createClient(tangoDB).query(FETCH_DEVICE_NAMES);
    return res.data.devices.map(({ name }) => name);
  } catch (err) {
    return [];
  }
}
