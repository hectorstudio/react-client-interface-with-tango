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

const FETCH_NAMES = `
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
  return await createClient(tangoDB).query(FETCH_ATTRIBUTES, { device });
}

export async function fetchNames(tangoDB) {
  return await createClient(tangoDB).query(FETCH_NAMES);
}