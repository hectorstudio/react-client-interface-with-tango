import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

export function getLoggedActions(state: IRootState) {
    return state.loggedActions;
}
