import { SET_MODAL, CLEAR_MODAL } from './actionTypes';

export function setModal(modalInstance, entity) {
    return {type: SET_MODAL, modalInstance, entity};
}

export function clearModal(){
    return {type: CLEAR_MODAL}
}

export const CREATE_PROPERTY = "CREATE_PROPERTY"; 
export const EDIT_PROPERTY = "EDIT_PROPERTY"; 
export const DELETE_PROPERTY = "DELETE_PROPERTY"; 