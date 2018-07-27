import { IRootState } from '../reducers/rootReducer';

export function getError(state: IRootState) {
    return state.error;
}
