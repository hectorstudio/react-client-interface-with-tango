import { FETCH_DEVICE_SUCCESS, CHANGE } from "../actions/actionTypes";

interface IDeviceAttribute {
    name: string;
    value: any;
    datatype: string;
    dataformat: string;
    quality: string;
}

export interface ICurrentDeviceAttributesState {
    [name: string]: IDeviceAttribute
}

export default function currentDeviceProperties(state: ICurrentDeviceAttributesState = {}, action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        return action.device.attributes.reduce((accum, attribute) => {
            const {name} = attribute;
            return {...accum, [name]: {...attribute}};
        }, {});
    }

    case CHANGE: {
        const {data: {value}, name} = action.data;
        const old = state[name];
        return {...state, [name]: {...old, value}};
    }

    default:
        return state;
    }
}
