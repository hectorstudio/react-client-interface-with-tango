import { FETCH_DEVICE_SUCCESS } from '../actions/actionTypes';

export interface ICurrentDeviceInfoState {
    name?: string;
    state?: string;
}

export default function currentDeviceInfo(state: ICurrentDeviceInfoState = {}, action) {
    switch (action.type) {
    case FETCH_DEVICE_SUCCESS: {
        const {name, state: deviceState} = action.device;
        return {...state, name, state: deviceState};
    }
    default:
        return state;
    }
}
