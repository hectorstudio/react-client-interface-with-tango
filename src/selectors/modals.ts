import { createSelector } from 'reselect';
import { IRootState } from '../reducers/rootReducer';

function getModalState(state: IRootState){
    return state.modal;
}
export const getModalInstance = createSelector(
    getModalState,
    state => state.modalInstance
)

export const getEntity = createSelector(
    getModalState,
    state => state.entity
)

export const getIsShowing = createSelector(
    getModalState,
    state => state.entity !== ""
)