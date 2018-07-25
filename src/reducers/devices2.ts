import {
    FETCH_DEVICE_SUCCESS
} from '../actions/actionTypes';

interface IDevice {
    name: string;
    state: string;
}

export interface IDevices2State {
    [name: string]: IDevice;
}

export default function allDevices(state: IDevices2State = {}, action) {
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
