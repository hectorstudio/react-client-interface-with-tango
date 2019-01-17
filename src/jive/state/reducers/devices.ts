import {
    FETCH_DEVICE_SUCCESS, ATTRIBUTE_CHANGE
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

    case ATTRIBUTE_CHANGE: {
        const { device: deviceName, name, data } = action.data;
        if (name === "State") {
            const deviceState = data.value;
            const device = { ...state[deviceName], state: deviceState };
            return {...state, [deviceName]: device };
        } else {
            return state;
        }
    }
    
    default:
        return state;
    }
}
