import { FETCH_DEVICE_SUCCESS } from "../actions/actionTypes";

interface IDeviceProperty {
    name: string,
    value: string[],
}

export type ICurrentDevicePropertiesState = IDeviceProperty[];

export default function currentDeviceProperties(state: ICurrentDevicePropertiesState = [], action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        return [...action.device.properties || []];
    }
    default:
        return state;
    }
}
