import { fork } from "redux-saga/effects";

import user from "../../../shared/user/state/saga";
import tango from "./tango";

export default function* sagas() {
  yield fork(user);
  yield fork(tango);
}
