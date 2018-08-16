import {
    FETCH_DEVICE_SUCCESS
} from '../actions/actionTypes';

interface IDevice {
    name: string;
    state: string;
    server: {
        id: string;
        host: string;
    }
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
    
    default:
        return state;
    }
}
