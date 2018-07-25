import {
    FETCH_DEVICE_SUCCESS, CHANGE
} from '../actions/actionTypes';

interface IDeviceAttribute {
    name: string,
    value: any,
    dataformat: string,
}

export interface IAttributesState {
    [deviceName: string]: {
        [attributeName: string]: IDeviceAttribute
    }
}

export default function allAttributes(state: IAttributesState = {}, action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        const {name, attributes} = action.device;
        const hash = attributes.reduce((accum, attribute) => ({
            ...accum, [attribute.name]: attribute
        }), {});
        return {...state, [name]: hash};
    }

    case CHANGE: {
        const {data: {value}, name, device} = action.data;
        const oldDevice = state[device];
        const oldAttribute = oldDevice[name];
        return {
            ...state,
            [device]: {
                ...oldDevice,
                [name]: {...oldAttribute, value}
            }
        };
    }
    
    default:
        return state;
    }
}
