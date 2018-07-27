import { IRootState } from '../reducers/rootReducer';

export function queryDeviceWithName(state: IRootState, name: string) {
    return state.devices[name];
}
