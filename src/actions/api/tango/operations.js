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

export const FETCH_DEVICE = `
query FetchDevice($name: String!) {
  device(name: $name) {
    name
    state
    server {
      id
      host
    }
    attributes {
      name
      dataformat
      datatype
      value
      quality
      writable
      description
      displevel
      minvalue
      maxvalue
    }
    properties{
      name
      value
    }
    commands{
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
