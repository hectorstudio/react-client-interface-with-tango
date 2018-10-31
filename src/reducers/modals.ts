import {
    SET_MODAL,
    CLEAR_MODAL,
    LOGIN_SUCCESS,
} from '../actions/actionTypes';

/**
 * modalInstance: a string constant identifying a specific dialog implementation.  Defined in actions/modals.
 * entity: the object being viewed or altered in the dialog. Currently always refers to a property ID, but
 * could be an attribute or command as well.
 */
export interface IModalState {
    modalInstance: string;
    entity: string;
}

export default function modal(state: IModalState = {
    modalInstance: "",
    entity: "",
}, action) {
    switch (action.type) {
    case SET_MODAL:
        const {modalInstance, entity} = action;
        return {...state, modalInstance, entity};

    case CLEAR_MODAL:
        return {...state, modalInstance: "", entity: ""};

    // Not sure if this belongs here, but the answer might be restructuring the way modals are displayed
    case LOGIN_SUCCESS:
        return {...state, modalInstance: "", entity: ""}

    default:
        return state;
    }
}