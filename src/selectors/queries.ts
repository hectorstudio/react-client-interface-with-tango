import { IRootState } from '../reducers/rootReducer';

export function queryExistsDevice(state: IRootState, name: string) {
    return state.devices[name] != null;
}
