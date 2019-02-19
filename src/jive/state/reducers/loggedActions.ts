import {
    FETCH_LOGGED_ACTIONS,
    FETCH_LOGGED_ACTIONS_FAILED,
    FETCH_LOGGED_ACTIONS_SUCCESS
} from '../actions/actionTypes';

export interface ILoggedActionState{
    timestamp: Date;
    username: string;
    category: string;
    target: string;
    action: string;
}
export interface ILoggedActionsState{
    loggedActions: ILoggedActionState[];
}

export default function loggedActions(state: ILoggedActionsState = {
    loggedActions:[]
}, action) {
    switch (action.type) {
    case FETCH_LOGGED_ACTIONS_SUCCESS: {
        return {...state, loggedActions: action.logs};
    }
    default:
        return state;
    }
}