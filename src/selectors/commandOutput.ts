import { IRootState } from '../reducers/rootReducer';

export function getCommandOutputState(state: IRootState) {
    return state.commandOutput;
}
