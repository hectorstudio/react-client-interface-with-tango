import { fork } from "redux-saga/effects";

import user from "./user";
import tango from "./tango";

export default function* sagas() {
  yield fork(user);
  yield fork(tango);
}
