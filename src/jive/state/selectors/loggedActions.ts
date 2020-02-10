<<<<<<< HEAD
import { IRootState } from "../reducers/rootReducer";

export function getLoggedActions(state: IRootState, device: string) {
  return state.loggedActions[device];
=======
import { IRootState } from '../reducers/rootReducer';

export function getLoggedActions(state: IRootState, device: string) {
    return state.loggedActions[device];
>>>>>>> origin/master
}
