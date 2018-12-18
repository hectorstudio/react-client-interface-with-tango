import { fork, take, put, call } from "redux-saga/effects";

import {
  FETCH_DEVICE_NAMES,
  FETCH_DEVICE_NAMES_SUCCESS,
  FETCH_DEVICE_NAMES_FAILED
} from "../actionTypes";

import TangoAPI from "../api/tango";
import { fetchDeviceNamesSuccess, fetchDeviceNamesFailed } from "../tango";

function* fetchDeviceNames() {
  while (true) {
    const { tangoDB } = yield take(FETCH_DEVICE_NAMES);
    try {
      const names = yield call(TangoAPI.fetchDeviceNames, tangoDB);
      yield put(fetchDeviceNamesSuccess(names));
    } catch (err) {
      yield put(fetchDeviceNamesFailed(err.toString()));
    }
  }
}

export default function* tango() {
  yield fork(fetchDeviceNames);
}
