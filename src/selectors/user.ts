import { createSelector } from "reselect";

import { IRootState } from "../reducers/rootReducer";

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
