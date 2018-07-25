import {
    FETCH_DEVICE_SUCCESS
} from '../actions/actionTypes';

interface IDeviceProperty {
    name: string;
    value: string[];
}  

export interface IPropertiesState {
    [deviceName: string]: {
        [propertyName: string]: IDeviceProperty
    }
}

export default function properties(state: IPropertiesState = {}, action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        const {name, properties: props} = action.device;
        const hash = props.reduce((accum, property) => ({
            ...accum, [property.name]: property
        }), {});
        return {...state, [name]: hash};
    }
    
    default:
        return state;
    }
}
