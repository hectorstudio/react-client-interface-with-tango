import { fork } from "redux-saga/effects";

import createUserSaga from "../../../shared/user/state/saga";
import tango from "./tango";

export default function* sagas() {
  yield fork(createUserSaga());
  yield fork(tango);
}
