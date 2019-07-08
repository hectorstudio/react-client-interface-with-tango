export const FETCH_DATABASE_INFO = `
query {
  info
}`;

export const FETCH_DEVICE_NAMES = `
query {
  devices {
    name
  }
}
`;

export const EXECUTE_COMMAND = `
mutation ExecuteCommand($command: String!, $device: String!, $argin: ScalarTypes) {
  executeCommand(command: $command, device: $device, argin: $argin) {
    ok
    message
    output
  }
}
`;

export const SET_DEVICE_ATTRIBUTE = `
mutation SetDeviceAttribute($device: String!, $name: String!, $value: ScalarTypes!) {
  setAttributeValue(device: $device, name: $name, value: $value) {
    ok
    message
    attribute {
      device
      name
      value
      writevalue
      quality
    }
  }
}
`;

export const SET_DEVICE_PROPERTY = `
mutation PutDeviceProperty($device: String!, $name: String!, $value: [String]) {
  putDeviceProperty(device: $device, name: $name, value: $value) {
    ok
    message
  }
}
`;

export const DELETE_DEVICE_PROPERTY = `
mutation DeleteDeviceProperty($device: String!, $name: String!) {
  deleteDeviceProperty(device: $device, name: $name) {
    ok
    message
  }
}
`;

export const FETCH_ALL_LOGGED_ACTIONS = `
query FetchUserActions($limit: Int) {
  userActions(first: $limit) {
    __typename
    timestamp
    user
    device
    name
    ...on SetAttributeValueUserAction {
      value
      valueBefore
      valueAfter
    }
    ...on ExcuteCommandUserAction {
      argin
    }
    ...on PutDevicePropertyUserAction {
      value
    }
  }
}
`;
export const FETCH_LOGGED_ACTIONS = `
query FetchDevice($deviceName: String!, $limit: Int) {
    device(name: $deviceName) {
      name
      userActions(first: $limit) {
        __typename
        timestamp
        user
        device
        name
        ...on SetAttributeValueUserAction {
          value
          valueBefore
          valueAfter
        }
        ...on ExcuteCommandUserAction {
          argin
        }
        ...on PutDevicePropertyUserAction {
          value
        }
      }
    }
}
`;

export const FETCH_DEVICE = `
query FetchDevice($name: String!) {
  device(name: $name) {
    name
    connected
    state
    server {
      id
      host
    }
    attributes {
      name
      dataformat
      datatype
      writable
      description
      displevel
      minvalue
      maxvalue
    }
    properties {
      name
      value
    }
    commands {
      name
      tag
      displevel
      intype
      intypedesc
      outtype
      outtypedesc
    }
  }
}
`;

export const FETCH_DEVICE_STATE = `
query FetchDevice($name: String!) {
  device(name: $name) {
    state
  }
}`;

export const ATTRIBUTES_SUB_WITH_VALUES = `
subscription Attributes($fullNames: [String]!) {
  attributes(fullNames: $fullNames) {
    device
    attribute
    value
    writeValue
    quality
  }
}`;

export const ATTRIBUTES_SUB_WITHOUT_VALUES = `
subscription Attributes($fullNames: [String]!) {
  attributes(fullNames: $fullNames) {
    device
    attribute
    quality
  }
}`;
