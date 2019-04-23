import { FETCH_LOGGED_ACTIONS_SUCCESS } from "../actions/actionTypes";

export interface ILoggedActionState {
  __typename: string;
  timestamp: string;
  user: string;
  device: string;
  name: string;
}

export interface ILoggedActionsState {
  [deviceName: string]: {
    ILoggedActionState;
  };
}

export default function loggedActions(state: ILoggedActionsState = {}, action) {
  switch (action.type) {
    case FETCH_LOGGED_ACTIONS_SUCCESS: {
      return { ...state, [action.logs.name]: action.logs.userActions };
    }
    default:
      return state;
  }
}
