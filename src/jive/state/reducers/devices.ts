import {
    FETCH_DEVICE_SUCCESS, ATTRIBUTE_FRAME_RECEIVED
} from '../actions/actionTypes';

interface IDevice {
    name: string;
    state: string;
    server: {
        id: string;
        host: string;
    },
    errors: object[]
}

export interface IDevicesState {
    [name: string]: IDevice;
}

export default function devices(state: IDevicesState = {}, action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        const {
            attributes,
            properties,
            commands,
            name,
            ...core
        } = action.device;
        return {...state, [name]: {...core, name}};
    }

    case ATTRIBUTE_FRAME_RECEIVED: {
        const { device: deviceName, attribute, value } = action.frame;
        if (attribute === "State") {
            const device = { ...state[deviceName], state: value };
            return {...state, [deviceName]: device };
        } else {
            return state;
        }
    }
    
    default:
        return state;
    }
}
