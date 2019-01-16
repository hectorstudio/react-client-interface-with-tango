import { createSelector } from "reselect";
import { IUserState } from "./reducer";

// The part of the root state that the user reducer cares about,
// expecting the user state to have been combined in under the key
// "user". Can this be made more typesafe?

interface IRootState {
  user: IUserState;
}

export function getUserState(state: IRootState) {
  return state.user;
}

export const getIsLoggedIn = createSelector(
  getUserState,
  state => state.username != null
);

export const getUsername = createSelector(
  getUserState,
  state => state.username
);

export const getAwaitingResponse = createSelector(
  getUserState,
  state => state.awaitingResponse
);

export const getLoginFailure = createSelector(
  getUserState,
  state => state.loginFailed && !state.awaitingResponse
);

export const getLoginDialogVisible = createSelector(
  getUserState,
  state => state.loginDialogVisible
);
