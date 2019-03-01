import { FETCH_DATABASE_INFO_SUCCESS } from "../actions/actionTypes";

export interface IDatabaseState {
  info: string | null;
}

export default function database(
  state: IDatabaseState = { info: null },
  action
) {
  switch (action.type) {
    case FETCH_DATABASE_INFO_SUCCESS:
      return { ...state, info: action.info };
    default:
      return state;
  }
}
